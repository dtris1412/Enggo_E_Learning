import db from "../../models/index.js";
import { askOpenAI } from "./aiService.js";
import {
  deductTokenUsage,
  getSystemQuota,
} from "../../admin/services/systemAIQuotaService.js";

/**
 * EXAM ANALYTICS SERVICE
 * Dùng AI để phân tích kết quả thi và đề xuất lộ trình học
 */

/**
 * Helper: Trừ token user và hệ thống sau khi gọi AI
 * (Tương tự logic trong aiController - tái sử dụng)
 */
const processTokenDeduction = async (userId, totalTokens) => {
  const quota = await getSystemQuota();
  const aiTokenUnit = quota.ai_token_unit;
  const aiTokensUsed = Math.ceil(totalTokens / aiTokenUnit);

  if (userId) {
    const wallet = await db.User_Token_Wallet.findOne({
      where: { user_id: userId },
    });

    if (wallet) {
      if (wallet.token_balance < aiTokensUsed) {
        throw new Error(
          `Không đủ AI token. Cần: ${aiTokensUsed}, Còn lại: ${wallet.token_balance}`,
        );
      }

      await wallet.update({
        token_balance: wallet.token_balance - aiTokensUsed,
        updated_at: new Date(),
      });

      await db.User_Token_Transaction.create({
        user_id: userId,
        amount: -aiTokensUsed,
        transaction_type: "usage",
        reference_id: null,
        created_at: new Date(),
      });
    }
  }

  await deductTokenUsage(totalTokens, aiTokensUsed);

  return { openai_tokens_used: totalTokens, ai_tokens_used: aiTokensUsed };
};

/**
 * Phân tích kết quả bài thi bằng AI và đề xuất lộ trình học
 * @param {number} user_exam_id - ID bài thi của user
 * @param {number} user_id - ID user (lấy từ token)
 * @returns {Promise<Object>}
 */
export const analyzeExamPerformance = async (user_exam_id, user_id) => {
  // 1. Load user_exam + exam info
  const userExam = await db.User_Exam.findOne({
    where: { user_exam_id, user_id },
    include: [
      {
        model: db.Exam,
        attributes: [
          "exam_id",
          "exam_title",
          "exam_type",
          "total_questions",
          "exam_code",
        ],
      },
    ],
  });

  if (!userExam) {
    return {
      success: false,
      message: "Không tìm thấy bài thi hoặc bạn không có quyền truy cập.",
    };
  }

  if (userExam.status === "submitted") {
    return {
      success: false,
      message: "Bài thi chưa được chấm điểm. Vui lòng thử lại sau.",
    };
  }

  // 2. Load user_exam_stats (đã tổng hợp sau submit)
  const stat = await db.User_Exam_Stat.findOne({
    where: { user_id, exam_id: userExam.exam_id },
  });

  if (!stat) {
    return {
      success: false,
      message:
        "Chưa có dữ liệu thống kê. Vui lòng nộp bài trước khi phân tích.",
    };
  }

  let weakness_types = [];
  try {
    weakness_types =
      typeof stat.weakness_type === "string"
        ? JSON.parse(stat.weakness_type)
        : stat.weakness_type || [];
  } catch {
    weakness_types = [];
  }

  // 3. Load chi tiết các câu sai, phân nhóm theo question_type
  const wrongAnswers = await db.User_Answer.findAll({
    where: { user_exam_id, is_correct: false },
    include: [
      {
        model: db.Container_Question,
        include: [
          {
            model: db.Question,
            attributes: ["question_id", "question_type", "question_content"],
          },
          {
            model: db.Question_Option,
            where: { is_correct: true },
            required: false,
            attributes: ["label", "content"],
          },
        ],
      },
      {
        model: db.Question_Option,
        as: "Question_Option",
        required: false,
        attributes: ["label", "content"],
      },
    ],
    limit: 20, // Giới hạn để tránh prompt quá dài
  });

  // Tóm tắt các câu sai để đưa vào prompt
  const wrongSummary = wrongAnswers.slice(0, 10).map((ans) => {
    const question = ans.Container_Question?.Question;
    const correctOpt = ans.Container_Question?.Question_Options?.[0];
    const selectedOpt = ans.Question_Option;
    return {
      question_type: question?.question_type || "unknown",
      question_preview:
        question?.question_content?.slice(0, 100) || "(no content)",
      user_answer: selectedOpt
        ? `${selectedOpt.label}: ${selectedOpt.content?.slice(0, 50)}`
        : "Không trả lời",
      correct_answer: correctOpt
        ? `${correctOpt.label}: ${correctOpt.content?.slice(0, 50)}`
        : "N/A",
    };
  });

  const examInfo = userExam.Exam;
  const totalAnswered = stat.total_correct + stat.total_wrong;
  const accuracyRate =
    totalAnswered > 0
      ? ((stat.total_correct / totalAnswered) * 100).toFixed(1)
      : "0.0";

  // 4. Load lịch sử thi của user từ DB để phân tích xu hướng
  const allUserStats = await db.User_Exam_Stat.findAll({
    where: { user_id },
    include: [
      {
        model: db.Exam,
        attributes: ["exam_id", "exam_title", "exam_type"],
      },
    ],
    order: [["updated_at", "DESC"]],
  });

  // Lịch sử điểm thi gần đây (max 10 bài, đã chấm)
  const recentExams = await db.User_Exam.findAll({
    where: { user_id, status: ["graded", "revised"] },
    include: [
      {
        model: db.Exam,
        attributes: ["exam_title", "exam_type"],
      },
    ],
    order: [["submitted_at", "DESC"]],
    limit: 10,
    attributes: ["user_exam_id", "total_score", "submitted_at"],
  });

  // Tổng hợp lịch sử thống kê
  const totalExamsTaken = allUserStats.length;
  const avgAccuracy =
    totalExamsTaken > 0
      ? (
          allUserStats.reduce((sum, s) => {
            const tot = s.total_correct + s.total_wrong;
            return sum + (tot > 0 ? (s.total_correct / tot) * 100 : 0);
          }, 0) / totalExamsTaken
        ).toFixed(1)
      : "0.0";

  // Tìm điểm yếu lặp lại qua nhiều bài thi
  const weaknessCounter = {};
  for (const s of allUserStats) {
    let wt = [];
    try {
      wt =
        typeof s.weakness_type === "string"
          ? JSON.parse(s.weakness_type)
          : s.weakness_type || [];
    } catch {
      wt = [];
    }
    for (const w of wt) {
      if (!weaknessCounter[w.type]) {
        weaknessCounter[w.type] = { appearances: 0, total_wrong: 0 };
      }
      weaknessCounter[w.type].appearances++;
      weaknessCounter[w.type].total_wrong += w.wrong_count;
    }
  }
  const recurringWeaknesses = Object.entries(weaknessCounter)
    .filter(([, v]) => v.appearances >= 2)
    .sort((a, b) => b[1].appearances - a[1].appearances)
    .slice(0, 5)
    .map(([type, v]) => ({
      type,
      appearances: v.appearances,
      total_wrong: v.total_wrong,
    }));

  // Xu hướng tiến bộ từ 3 bài gần nhất
  let progressTrend = "chưa đủ dữ liệu";
  if (allUserStats.length >= 3) {
    const sorted = [...allUserStats].sort(
      (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    );
    const last3 = sorted.slice(-3);
    const rates = last3.map((s) => {
      const tot = s.total_correct + s.total_wrong;
      return tot > 0 ? (s.total_correct / tot) * 100 : 0;
    });
    const delta = rates[2] - rates[0];
    if (delta >= 5) progressTrend = "đang tiến bộ rõ rệt";
    else if (delta >= 1) progressTrend = "tiến bộ nhẹ";
    else if (delta >= -1) progressTrend = "ổn định";
    else if (delta >= -5) progressTrend = "có dấu hiệu giảm sút";
    else progressTrend = "đang giảm sút đáng kể";
  }

  // Chuỗi điểm thi gần đây
  const recentScoresStr =
    recentExams.length > 0
      ? recentExams
          .slice(0, 5)
          .map(
            (e) =>
              `  - ${e.Exam?.exam_title ?? "N/A"}: ${e.total_score ?? "chưa có điểm"} điểm (${new Date(e.submitted_at).toLocaleDateString("vi-VN")})`,
          )
          .join("\n")
      : "  - Chưa có dữ liệu";

  // 5. Xây dựng prompt cho AI
  const weaknessTypesStr =
    weakness_types.length > 0
      ? weakness_types
          .map((w) => `  - ${w.type}: sai ${w.wrong_count} câu`)
          .join("\n")
      : "  - Không có dữ liệu";

  const recurringWeaknessStr =
    recurringWeaknesses.length > 0
      ? recurringWeaknesses
          .map(
            (w) =>
              `  - ${w.type}: xuất hiện ${w.appearances}/${totalExamsTaken} bài, tổng sai ${w.total_wrong} câu`,
          )
          .join("\n")
      : "  - Không có dạng yếu lặp lại";

  const wrongSampleStr =
    wrongSummary.length > 0
      ? wrongSummary
          .map(
            (w, i) =>
              `  Câu ${i + 1} [${w.question_type}]: "${w.question_preview}"\n    User chọn: ${w.user_answer}\n    Đáp án đúng: ${w.correct_answer}`,
          )
          .join("\n")
      : "  - Không có dữ liệu";

  const prompt = `Bạn là gia sư luyện thi ${examInfo.exam_type} chuyên nghiệp. Hãy phân tích toàn diện kết quả thi kết hợp với lịch sử học tập và đề xuất lộ trình cá nhân hóa.

📋 THÔNG TIN BÀI THI HIỆN TẠI:
- Đề thi: ${examInfo.exam_title} (${examInfo.exam_code})
- Loại: ${examInfo.exam_type}
- Tổng số câu: ${totalAnswered}/${examInfo.total_questions}
- Số câu đúng: ${stat.total_correct} | Số câu sai: ${stat.total_wrong}
- Tỷ lệ đúng: ${accuracyRate}%
- Điểm số: ${userExam.total_score ?? "N/A"}

📊 DẠNG CÂU HỎI YẾU NHẤT (bài thi này):
${weaknessTypesStr}

❌ MẪU CÁC CÂU SAI (tối đa 10 câu):
${wrongSampleStr}

📈 LỊCH SỬ HỌC TẬP (${totalExamsTaken} bài đã thi):
- Độ chính xác trung bình toàn bộ: ${avgAccuracy}%
- Xu hướng tiến bộ (3 bài gần nhất): ${progressTrend}
- Điểm thi gần đây:
${recentScoresStr}

🔁 ĐIỂM YẾU LẶP LẠI QUA NHIỀU BÀI THI:
${recurringWeaknessStr}

📝 YÊU CẦU PHÂN TÍCH:
1. Đánh giá tổng quan năng lực hiện tại dựa trên cả bài thi này lẫn lịch sử
2. Nhận xét xu hướng tiến bộ — học viên đang cải thiện hay giậm chân tại chỗ?
3. Tập trung phân tích các điểm yếu kéo dài (lặp lại nhiều bài), chỉ ra nguyên nhân gốc rễ
4. Đề xuất lộ trình học cụ thể: ưu tiên điểm yếu nào trước, thứ tự cải thiện
5. Các bài tập/phương pháp ôn luyện phù hợp với từng điểm yếu

Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, có cấu trúc rõ ràng.`;

  // 6. Gọi AI
  const aiResult = await askOpenAI({
    message: prompt,
    type: "chat",
    options: {
      model: "gpt-4o-mini",
      max_tokens: 1500,
      temperature: 0.7,
    },
  });

  // 7. Trừ token
  const tokenInfo = await processTokenDeduction(
    user_id,
    aiResult.usage?.total_tokens || 0,
  );

  return {
    success: true,
    data: {
      exam_info: {
        exam_id: examInfo.exam_id,
        exam_title: examInfo.exam_title,
        exam_type: examInfo.exam_type,
      },
      stats: {
        total_correct: stat.total_correct,
        total_wrong: stat.total_wrong,
        accuracy_rate: `${accuracyRate}%`,
        total_score: userExam.total_score,
        weakness_types,
      },
      historical_context: {
        total_exams_taken: totalExamsTaken,
        overall_avg_accuracy: `${avgAccuracy}%`,
        progress_trend: progressTrend,
        recurring_weaknesses: recurringWeaknesses,
      },
      ai_analysis: aiResult.content,
      token_usage: tokenInfo,
    },
  };
};

/**
 * Lấy lịch sử thống kê tổng thể của user trên tất cả các đề đã thi
 * - Không cần AI, thuần query DB
 * @param {number} user_id
 * @returns {Promise<Object>}
 */
export const getUserOverallStats = async (user_id) => {
  const stats = await db.User_Exam_Stat.findAll({
    where: { user_id },
    include: [
      {
        model: db.Exam,
        attributes: ["exam_id", "exam_title", "exam_type"],
      },
    ],
    order: [["updated_at", "DESC"]],
  });

  const result = stats.map((s) => {
    let weakness_types = [];
    try {
      weakness_types =
        typeof s.weakness_type === "string"
          ? JSON.parse(s.weakness_type)
          : s.weakness_type || [];
    } catch {
      weakness_types = [];
    }

    const total = s.total_correct + s.total_wrong;
    return {
      user_exam_stats_id: s.user_exam_stats_id,
      exam_id: s.exam_id,
      exam_title: s.Exam?.exam_title,
      exam_type: s.Exam?.exam_type,
      total_correct: s.total_correct,
      total_wrong: s.total_wrong,
      accuracy_rate:
        total > 0 ? ((s.total_correct / total) * 100).toFixed(1) : "0.0",
      weakness_types,
      updated_at: s.updated_at,
    };
  });

  return { success: true, data: result };
};

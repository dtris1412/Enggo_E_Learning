import db from "../../models/index.js";

/**
 * EXAM STATS SERVICE
 * Tổng hợp thống kê từ bảng user_answer vào 2 bảng:
 *  - user_exam_stats: kết quả tổng hợp của từng user cho từng đề
 *  - exam_question_stats: tổng hợp đúng/sai của từng câu hỏi
 */

/**
 * Tổng hợp và lưu user_exam_stats sau khi user nộp bài
 * @param {number} user_exam_id
 * @returns {Promise<Object>}
 */
export const computeAndSaveUserExamStats = async (user_exam_id) => {
  const userExam = await db.User_Exam.findByPk(user_exam_id, {
    attributes: ["user_id", "exam_id"],
  });

  if (!userExam) {
    throw new Error(`User_Exam ${user_exam_id} not found`);
  }

  const { user_id, exam_id } = userExam;

  // Lấy tất cả user_answer của lần thi này, join để lấy question_type
  const answers = await db.User_Answer.findAll({
    where: { user_exam_id },
    include: [
      {
        model: db.Container_Question,
        attributes: ["container_question_id"],
        include: [
          {
            model: db.Question,
            attributes: ["question_id", "question_type"],
          },
        ],
      },
    ],
  });

  let total_correct = 0;
  let total_wrong = 0;

  // Đếm số lần sai theo từng question_type
  const wrongPerType = {};

  for (const answer of answers) {
    const question = answer.Container_Question?.Question;
    const qType = question?.question_type || "unknown";

    if (answer.is_correct === true) {
      total_correct++;
    } else if (answer.is_correct === false) {
      total_wrong++;
      wrongPerType[qType] = (wrongPerType[qType] || 0) + 1;
    }
  }

  // Sắp xếp theo số lần sai giảm dần, lấy top 5 question_type yếu nhất
  const weakness_types = Object.entries(wrongPerType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, wrong_count: count }));

  // Upsert: Nếu đã có record (user_id + exam_id) thì update, ngược lại create
  const [stat, created] = await db.User_Exam_Stat.findOrCreate({
    where: { user_id, exam_id },
    defaults: {
      user_id,
      exam_id,
      total_correct,
      total_wrong,
      weakness_type: JSON.stringify(weakness_types),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  if (!created) {
    await stat.update({
      total_correct,
      total_wrong,
      weakness_type: JSON.stringify(weakness_types),
      updated_at: new Date(),
    });
  }

  return {
    user_id,
    exam_id,
    total_correct,
    total_wrong,
    weakness_types,
  };
};

/**
 * Tổng hợp và cập nhật exam_question_stats sau khi user nộp bài
 * - Mỗi câu trả lời sẽ increment total_correct hoặc total_wrong cho question_id tương ứng
 * @param {number} user_exam_id
 * @returns {Promise<void>}
 */
export const computeAndSaveExamQuestionStats = async (user_exam_id) => {
  const answers = await db.User_Answer.findAll({
    where: { user_exam_id },
    include: [
      {
        model: db.Container_Question,
        attributes: ["container_question_id", "question_id"],
      },
    ],
  });

  for (const answer of answers) {
    const question_id = answer.Container_Question?.question_id;
    if (!question_id) continue;

    // is_correct có thể null (chưa chấm), chỉ xử lý khi đã có kết quả
    if (answer.is_correct === null) continue;

    const [stat, created] = await db.Exam_Question_Stat.findOrCreate({
      where: { question_id },
      defaults: {
        question_id,
        total_correct: answer.is_correct ? 1 : 0,
        total_wrong: answer.is_correct ? 0 : 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (!created) {
      await stat.update({
        total_correct: stat.total_correct + (answer.is_correct ? 1 : 0),
        total_wrong: stat.total_wrong + (answer.is_correct ? 0 : 1),
        updated_at: new Date(),
      });
    }
  }
};

/**
 * Lấy thống kê của user cho một đề thi cụ thể
 * @param {number} user_id
 * @param {number} exam_id
 * @returns {Promise<Object>}
 */
export const getUserExamStats = async (user_id, exam_id) => {
  if (!user_id || !exam_id) {
    return { success: false, message: "user_id và exam_id là bắt buộc." };
  }

  const stat = await db.User_Exam_Stat.findOne({
    where: { user_id, exam_id },
    include: [
      {
        model: db.Exam,
        attributes: ["exam_id", "exam_title", "exam_type"],
      },
    ],
  });

  if (!stat) {
    return {
      success: false,
      message: "Chưa có dữ liệu thống kê cho đề thi này.",
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

  return {
    success: true,
    data: {
      user_exam_stats_id: stat.user_exam_stats_id,
      user_id: stat.user_id,
      exam_id: stat.exam_id,
      exam_title: stat.Exam?.exam_title,
      exam_type: stat.Exam?.exam_type,
      total_correct: stat.total_correct,
      total_wrong: stat.total_wrong,
      total_answered: stat.total_correct + stat.total_wrong,
      accuracy_rate:
        stat.total_correct + stat.total_wrong > 0
          ? (
              (stat.total_correct / (stat.total_correct + stat.total_wrong)) *
              100
            ).toFixed(1)
          : "0.0",
      weakness_types,
      updated_at: stat.updated_at,
    },
  };
};

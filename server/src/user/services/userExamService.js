import db from "../../models/index.js";
import {
  computeAndSaveUserExamStats,
  computeAndSaveExamQuestionStats,
} from "./examStatsService.js";
import {
  gradeIeltsWriting,
  speakingConversationTurn,
  evaluateIeltsSpeaking,
} from "./aiService.js";

/**
 * USER EXAM SERVICE
 * Quản lý quá trình thi thử online của user: bắt đầu bài thi, lưu câu trả lời, submit, xem kết quả
 */

// Bắt đầu bài thi mới
export const startExam = async (user_id, exam_id, selected_parts = []) => {
  if (!user_id || !exam_id) {
    return { success: false, message: "User ID and Exam ID are required." };
  }

  // Kiểm tra exam có tồn tại không
  const exam = await db.Exam.findByPk(exam_id);
  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  // Tạo user exam mới
  const newUserExam = await db.User_Exam.create({
    user_id,
    exam_id,
    selected_parts: selected_parts.length > 0 ? selected_parts : ["all"],
    started_at: new Date(),
    submitted_at: new Date(), // Tạm thời set giống started_at, sẽ update khi submit
    status: "submitted", // Set mặc định là submitted
    total_score: null,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Exam started successfully",
    data: {
      user_exam_id: newUserExam.user_exam_id,
      exam_id: newUserExam.exam_id,
      started_at: newUserExam.started_at,
    },
  };
};

// Lưu câu trả lời của user (có thể lưu từng câu hoặc nhiều câu)
export const saveAnswers = async (user_exam_id, answers) => {
  if (!user_exam_id || !answers || !Array.isArray(answers)) {
    return {
      success: false,
      message: "User exam ID and answers array are required.",
    };
  }

  // Kiểm tra user_exam có tồn tại không
  const userExam = await db.User_Exam.findByPk(user_exam_id);
  if (!userExam) {
    return { success: false, message: "User exam not found." };
  }

  // Lưu các câu trả lời
  const savedAnswers = [];
  for (const answer of answers) {
    const { container_question_id, question_option_id } = answer;

    if (!container_question_id) {
      continue;
    }

    // Kiểm tra xem đã có câu trả lời cho câu hỏi này chưa
    let userAnswer = await db.User_Answer.findOne({
      where: {
        user_exam_id,
        container_question_id,
      },
    });

    if (userAnswer) {
      // Cập nhật câu trả lời
      await userAnswer.update({
        question_option_id: question_option_id || null,
        updated_at: new Date(),
      });
    } else {
      // Tạo câu trả lời mới
      userAnswer = await db.User_Answer.create({
        user_exam_id,
        container_question_id,
        question_option_id: question_option_id || null,
        is_correct: null, // Sẽ được tính khi submit
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    savedAnswers.push(userAnswer);
  }

  return {
    success: true,
    message: "Answers saved successfully",
    data: {
      saved_count: savedAnswers.length,
    },
  };
};

// Submit bài thi và tính điểm
export const submitExam = async (user_exam_id) => {
  if (!user_exam_id) {
    return { success: false, message: "User exam ID is required." };
  }

  // Kiểm tra user_exam có tồn tại không
  const userExam = await db.User_Exam.findByPk(user_exam_id, {
    include: [
      {
        model: db.Exam,
        include: [
          {
            model: db.Exam_Container,
            include: [
              {
                model: db.Container_Question,
                include: [
                  {
                    model: db.Question_Option,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!userExam) {
    return { success: false, message: "User exam not found." };
  }

  // Lấy tất cả câu trả lời của user
  const userAnswers = await db.User_Answer.findAll({
    where: { user_exam_id },
    include: [
      {
        model: db.Container_Question,
        include: [
          {
            model: db.Question_Option,
          },
        ],
      },
      {
        model: db.Question_Option,
      },
    ],
  });

  // Tính điểm
  let totalScore = 0;
  let totalQuestions = 0;
  let correctAnswers = 0;

  for (const userAnswer of userAnswers) {
    const containerQuestion = userAnswer.Container_Question;
    const selectedOption = userAnswer.Question_Option;

    if (!containerQuestion) continue;

    totalQuestions++;

    // Tìm đáp án đúng
    const correctOption = containerQuestion.Question_Options?.find(
      (opt) => opt.is_correct === true,
    );

    // Kiểm tra xem user chọn đúng không
    const isCorrect =
      selectedOption &&
      correctOption &&
      selectedOption.question_option_id === correctOption.question_option_id;

    // Cập nhật is_correct trong user_answer
    await userAnswer.update({
      is_correct: isCorrect,
      updated_at: new Date(),
    });

    if (isCorrect) {
      correctAnswers++;
      totalScore += Number(containerQuestion.score || 1);
    }
  }

  // Cập nhật user_exam với submitted_at và total_score
  await userExam.update({
    submitted_at: new Date(),
    status: "graded",
    total_score: totalScore,
    updated_at: new Date(),
  });

  // Tổng hợp thống kê vào user_exam_stats và exam_question_stats
  // Chạy bất đồng bộ, không block response
  Promise.all([
    computeAndSaveUserExamStats(user_exam_id),
    computeAndSaveExamQuestionStats(user_exam_id),
  ]).catch((err) => console.error("[submitExam] Error computing stats:", err));

  return {
    success: true,
    message: "Exam submitted and graded successfully",
    data: {
      user_exam_id,
      total_score: totalScore,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      percentage:
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
    },
  };
};

// Xem kết quả bài thi
export const getExamResult = async (user_exam_id, user_id) => {
  if (!user_exam_id) {
    return { success: false, message: "User exam ID is required." };
  }

  const whereCondition = { user_exam_id };
  if (user_id) {
    whereCondition.user_id = user_id;
  }

  const userExam = await db.User_Exam.findOne({
    where: whereCondition,
    include: [
      {
        model: db.Exam,
        attributes: [
          "exam_id",
          "exam_title",
          "exam_code",
          "exam_type",
          "total_questions",
          "exam_duration",
        ],
        include: [
          {
            model: db.Certificate,
            attributes: ["certificate_id", "certificate_name"],
          },
        ],
      },
      {
        model: db.User_Answer,
        include: [
          {
            model: db.Container_Question,
            attributes: ["container_question_id", "order", "score"],
            include: [
              {
                model: db.Question,
                attributes: ["question_id", "question_content", "explanation"],
              },
              {
                model: db.Question_Option,
                attributes: [
                  "question_option_id",
                  "label",
                  "content",
                  "is_correct",
                  "order_index",
                ],
                order: [["order_index", "ASC"]],
              },
            ],
          },
          {
            model: db.Question_Option,
            as: "Question_Option",
            attributes: [
              "question_option_id",
              "label",
              "content",
              "order_index",
            ],
          },
        ],
      },
    ],
  });

  if (!userExam) {
    return { success: false, message: "Exam result not found." };
  }

  // Tính toán thống kê
  const totalQuestions = userExam.User_Answers?.length || 0;
  const correctAnswers =
    userExam.User_Answers?.filter((ans) => ans.is_correct).length || 0;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return {
    success: true,
    message: "Exam result retrieved successfully",
    data: {
      user_exam_id: userExam.user_exam_id,
      exam: userExam.Exam,
      started_at: userExam.started_at,
      submitted_at: userExam.submitted_at,
      status: userExam.status,
      total_score: userExam.total_score,
      statistics: {
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        percentage: percentage.toFixed(2),
      },
      answers: userExam.User_Answers,
    },
  };
};

// Xem chi tiết lần thi (cho review)
export const getExamAttemptDetail = async (user_exam_id, user_id) => {
  return getExamResult(user_exam_id, user_id);
};

// Xóa bài thi chưa submit (abandon exam)
export const abandonExam = async (user_exam_id, user_id) => {
  if (!user_exam_id) {
    return { success: false, message: "User exam ID is required." };
  }

  const whereCondition = { user_exam_id };
  if (user_id) {
    whereCondition.user_id = user_id;
  }

  const userExam = await db.User_Exam.findOne({
    where: whereCondition,
  });

  if (!userExam) {
    return { success: false, message: "User exam not found." };
  }

  // Xóa tất cả câu trả lời
  await db.User_Answer.destroy({
    where: { user_exam_id },
  });

  // Xóa user exam
  await userExam.destroy();

  return {
    success: true,
    message: "Exam abandoned successfully",
  };
};

// Lấy trạng thái bài thi đang làm
export const getOngoingExam = async (user_id) => {
  if (!user_id) {
    return { success: false, message: "User ID is required." };
  }

  // Tìm bài thi đang làm (status = 'submitted' nhưng chưa có total_score)
  // Hoặc có thể thêm status 'in_progress' trong database
  const userExam = await db.User_Exam.findOne({
    where: {
      user_id,
      status: "submitted",
    },
    include: [
      {
        model: db.Exam,
        attributes: ["exam_id", "exam_title", "exam_code", "exam_duration"],
      },
    ],
    order: [["started_at", "DESC"]],
  });

  if (!userExam) {
    return {
      success: true,
      message: "No ongoing exam found",
      data: null,
    };
  }

  // Lấy các câu trả lời đã lưu
  const savedAnswers = await db.User_Answer.findAll({
    where: { user_exam_id: userExam.user_exam_id },
    attributes: ["container_question_id", "question_option_id"],
  });

  return {
    success: true,
    message: "Ongoing exam retrieved successfully",
    data: {
      user_exam_id: userExam.user_exam_id,
      exam: userExam.Exam,
      started_at: userExam.started_at,
      saved_answers: savedAnswers,
    },
  };
};

// Lấy lịch sử thi của user
export const getUserExamHistory = async (user_id, limit = 10, page = 1) => {
  try {
    console.log("[getUserExamHistory] Called with:", { user_id, limit, page });

    if (!user_id) {
      return { success: false, message: "User ID is required." };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await db.User_Exam.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: db.Exam,
          required: false, // Use LEFT JOIN to get all user_exams
          attributes: [
            "exam_id",
            "exam_title",
            "exam_code",
            "exam_type",
            "total_questions",
          ],
          include: [
            {
              model: db.Certificate,
              attributes: ["certificate_id", "certificate_name"],
            },
          ],
        },
        {
          model: db.User_Answer,
          attributes: ["user_answer_id", "is_correct"],
        },
      ],
      attributes: [
        "user_exam_id",
        "exam_id",
        "started_at",
        "submitted_at",
        "status",
        "total_score",
        "selected_parts",
      ],
      limit: Number(limit),
      offset,
      order: [["started_at", "DESC"]],
    });

    console.log("[getUserExamHistory] Query results:", {
      totalRows: rows.length,
      count,
      firstRow: rows[0]
        ? {
            user_exam_id: rows[0].user_exam_id,
            hasExam: !!rows[0].Exam,
          }
        : null,
    });

    // Filter out user exams where the exam has been deleted
    const validRows = rows.filter((userExam) => userExam.Exam !== null);

    console.log("[getUserExamHistory] After filtering:", {
      validRowsCount: validRows.length,
    });

    // Calculate statistics for each exam attempt
    const examsWithStats = validRows.map((userExam) => {
      const totalQuestions = userExam.User_Answers?.length || 0;
      const correctAnswers =
        userExam.User_Answers?.filter((ans) => ans.is_correct).length || 0;
      const incorrectAnswers = totalQuestions - correctAnswers;
      const percentage =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // Convert to plain object and add statistics
      const examData = userExam.toJSON();
      examData.statistics = {
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        percentage: percentage.toFixed(2),
      };
      // Remove User_Answers from response as we only need the stats
      delete examData.User_Answers;

      return examData;
    });

    console.log("[getUserExamHistory] Success:", {
      examsWithStatsCount: examsWithStats.length,
    });

    return {
      success: true,
      message: "User exam history retrieved successfully",
      data: examsWithStats,
      pagination: {
        total: validRows.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(validRows.length / Number(limit)),
      },
    };
  } catch (error) {
    console.error("[getUserExamHistory] ERROR:", error);
    console.error("[getUserExamHistory] Error stack:", error.stack);
    return {
      success: false,
      message: error.message || "Failed to get exam history",
    };
  }
};

// ─────────────────────────────────────────────
// IELTS Writing
// ─────────────────────────────────────────────

export const submitWritingTask = async (
  user_exam_id,
  container_question_id,
  content,
) => {
  try {
    if (!content || content.trim().split(/\s+/).filter(Boolean).length < 5) {
      return { success: false, message: "Nội dung bài viết quá ngắn." };
    }

    const containerQuestion = await db.Container_Question.findByPk(
      container_question_id,
      {
        include: [
          { model: db.Question },
          {
            model: db.Exam_Container,
            attributes: [
              "container_id",
              "content",
              "type",
              "instruction",
              "skill",
            ],
          },
        ],
      },
    );

    if (!containerQuestion) {
      return { success: false, message: "Không tìm thấy câu hỏi." };
    }

    const task_prompt = [
      containerQuestion.Exam_Container?.instruction,
      containerQuestion.Exam_Container?.content,
      containerQuestion.Question?.question_content,
    ]
      .filter(Boolean)
      .join("\n\n");

    const skill = containerQuestion.Exam_Container?.skill;
    // Determine task type: Writing Task 1 is typically the shorter report/chart task
    const task_type = skill === "writing" ? "task2" : "task1";
    const word_count = content.trim().split(/\s+/).filter(Boolean).length;

    const submission = await db.Writing_Submission.create({
      user_exam_id,
      container_question_id,
      content: content.trim(),
      word_count,
      status: "submitted",
      submitted_at: new Date(),
    });

    let feedbackData = null;
    try {
      const grading = await gradeIeltsWriting({
        task_prompt,
        user_content: content,
        task_type,
      });

      feedbackData = await db.Writing_Feedback.create({
        submission_id: submission.submission_id,
        model_name: "gpt-4o-mini",
        overall_score: grading.overall_band || 0,
        criteria_scores: grading.criteria_scores || {},
        comments: JSON.stringify({
          feedback: grading.feedback,
          sample_improvements: grading.sample_improvements || [],
          word_count_note: grading.word_count_note || "",
        }),
        created_at: new Date(),
      });

      await submission.update({
        status: "graded",
        final_score: grading.overall_band,
      });
    } catch (aiError) {
      console.error("[submitWritingTask] AI grading error:", aiError);
    }

    return {
      success: true,
      message: "Bài viết đã được nộp và chấm điểm",
      data: {
        submission: {
          submission_id: submission.submission_id,
          word_count: submission.word_count,
          status: submission.status,
          final_score: submission.final_score,
        },
        feedback: feedbackData
          ? {
              overall_score: feedbackData.overall_score,
              criteria_scores: feedbackData.criteria_scores,
              comments: (() => {
                try {
                  return JSON.parse(feedbackData.comments);
                } catch {
                  return feedbackData.comments;
                }
              })(),
            }
          : null,
      },
    };
  } catch (error) {
    console.error("[submitWritingTask] ERROR:", error);
    return {
      success: false,
      message: error.message || "Failed to submit writing task",
    };
  }
};

export const getWritingSubmissions = async (user_exam_id) => {
  try {
    const submissions = await db.Writing_Submission.findAll({
      where: { user_exam_id },
      include: [{ model: db.Writing_Feedback }],
      order: [["submitted_at", "DESC"]],
    });
    return { success: true, data: submissions };
  } catch (error) {
    console.error("[getWritingSubmissions] ERROR:", error);
    return { success: false, message: error.message };
  }
};

// ─────────────────────────────────────────────
// IELTS Speaking
// ─────────────────────────────────────────────

export const handleSpeakingTurn = async (
  user_exam_id,
  container_id,
  messages,
  part_type,
) => {
  try {
    const container = await db.Exam_Container.findByPk(container_id, {
      attributes: ["container_id", "content", "instruction", "skill"],
      include: [
        {
          model: db.Container_Question,
          include: [{ model: db.Question }],
        },
      ],
    });

    // Auto-detect part type from instruction text if not provided
    const inferPartType = (instr) => {
      if (!instr) return "part1";
      const lower = instr.toLowerCase();
      if (lower.includes("part 3") || lower.includes("part3")) return "part3";
      if (lower.includes("part 2") || lower.includes("part2")) return "part2";
      return "part1";
    };
    const detectedPartType = part_type || inferPartType(container?.instruction);

    const promptParts = [container?.instruction, container?.content];
    if (container?.Container_Questions?.length > 0) {
      promptParts.push(
        "Topic questions / cue card bullet points:\n" +
          container.Container_Questions.map(
            (cq, i) => `${i + 1}. ${cq.Question?.question_content}`,
          ).join("\n"),
      );
    }
    const part_context = promptParts.filter(Boolean).join("\n\n");

    const result = await speakingConversationTurn({
      messages,
      part_context,
      part_type: detectedPartType,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("[handleSpeakingTurn] ERROR:", error);
    return {
      success: false,
      message: error.message || "Failed to process speaking turn",
    };
  }
};

export const submitSpeakingSession = async (
  user_exam_id,
  container_id,
  messages,
  duration_seconds,
) => {
  try {
    const container = await db.Exam_Container.findByPk(container_id, {
      attributes: ["container_id", "content", "instruction"],
      include: [
        {
          model: db.Container_Question,
          attributes: ["container_question_id"],
          limit: 1,
          order: [["order", "ASC"]],
        },
      ],
    });

    if (!container) {
      return { success: false, message: "Speaking container not found" };
    }

    const container_question_id =
      container.Container_Questions?.[0]?.container_question_id;
    if (!container_question_id) {
      return {
        success: false,
        message: "No questions found for this speaking part",
      };
    }

    const transcript = messages
      .map(
        (m) => `${m.role === "user" ? "CANDIDATE" : "EXAMINER"}: ${m.content}`,
      )
      .join("\n\n");

    const part_context = [container.instruction, container.content]
      .filter(Boolean)
      .join("\n");

    const record = await db.Speaking_Record.create({
      user_exam_id,
      container_question_id,
      audio_url: "text_session",
      duration: duration_seconds || 0,
      submitted_at: new Date(),
    });

    let feedbackData = null;
    try {
      const evaluation = await evaluateIeltsSpeaking({
        transcript,
        part_context,
      });

      feedbackData = await db.Speaking_Feedback.create({
        record_id: record.record_id,
        model_name: "gpt-4o-mini",
        overall_score: evaluation.overall_band || 0,
        criteria_scores: evaluation.criteria_scores || {},
        comments: JSON.stringify({
          feedback: evaluation.feedback,
          transcript_excerpt: transcript.substring(0, 800),
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });

      await record.update({ final_score: evaluation.overall_band });
    } catch (aiError) {
      console.error("[submitSpeakingSession] AI evaluation error:", aiError);
    }

    return {
      success: true,
      message: "Phiên speaking đã được đánh giá",
      data: {
        record: {
          record_id: record.record_id,
          final_score: record.final_score,
        },
        feedback: feedbackData
          ? {
              overall_score: feedbackData.overall_score,
              criteria_scores: feedbackData.criteria_scores,
              comments: (() => {
                try {
                  return JSON.parse(feedbackData.comments);
                } catch {
                  return feedbackData.comments;
                }
              })(),
            }
          : null,
      },
    };
  } catch (error) {
    console.error("[submitSpeakingSession] ERROR:", error);
    return {
      success: false,
      message: error.message || "Failed to submit speaking session",
    };
  }
};

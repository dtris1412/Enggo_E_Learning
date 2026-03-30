import db from "../../models/index.js";
import {
  computeAndSaveUserExamStats,
  computeAndSaveExamQuestionStats,
} from "./examStatsService.js";
import {
  gradeIeltsWriting,
  speakingConversationTurn,
  evaluateIeltsSpeaking,
  evaluateIeltsSpeakingAll,
} from "./aiService.js";
import {
  deductTokenUsage,
  getSystemQuota,
} from "../../admin/services/systemAIQuotaService.js";

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

  // Lấy writing submissions + feedback
  const writingSubmissions = await db.Writing_Submission.findAll({
    where: { user_exam_id },
    include: [{ model: db.Writing_Feedback, required: false }],
    order: [["submission_id", "ASC"]],
  });

  // Tính writing band (IELTS: Task1 = 1/3, Task2 = 2/3)
  let writingBand = null;
  const gradedWriting = writingSubmissions.filter((s) => s.final_score != null);
  if (gradedWriting.length > 0) {
    const getTaskType = (sub) => {
      const fb = sub.Writing_Feedbacks?.[0];
      if (!fb) return "task2";
      try {
        return JSON.parse(fb.comments)?.task_type || "task2";
      } catch {
        return "task2";
      }
    };
    const t1 = gradedWriting.filter((s) => getTaskType(s) === "task1");
    const t2 = gradedWriting.filter((s) => getTaskType(s) !== "task1");
    if (t1.length > 0 && t2.length > 0) {
      const t1Avg = t1.reduce((s, t) => s + t.final_score, 0) / t1.length;
      const t2Avg = t2.reduce((s, t) => s + t.final_score, 0) / t2.length;
      writingBand = t1Avg * (1 / 3) + t2Avg * (2 / 3);
    } else {
      writingBand =
        gradedWriting.reduce((s, t) => s + t.final_score, 0) /
        gradedWriting.length;
    }
    writingBand = Math.round(writingBand * 2) / 2;
  }

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
      writing_results:
        writingSubmissions.length > 0
          ? {
              final_band: writingBand,
              graded_count: gradedWriting.length,
              total_count: writingSubmissions.length,
              submissions: writingSubmissions,
            }
          : null,
      speaking_results: await (async () => {
        const speakingRecords = await db.Speaking_Record.findAll({
          where: { user_exam_id },
          include: [{ model: db.Speaking_Feedback, required: false }],
          order: [["record_id", "ASC"]],
        });
        if (speakingRecords.length === 0) return null;
        const gradedSpeaking = speakingRecords.filter(
          (r) => r.final_score != null,
        );
        let speakingBand = null;
        if (gradedSpeaking.length > 0) {
          speakingBand =
            gradedSpeaking.reduce((s, r) => s + r.final_score, 0) /
            gradedSpeaking.length;
          speakingBand = Math.round(speakingBand * 2) / 2;
        }
        return {
          final_band: speakingBand,
          graded_count: gradedSpeaking.length,
          total_count: speakingRecords.length,
          records: speakingRecords,
        };
      })(),
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
  user_id,
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

    // Detect task type from the instruction field: "Task 1" → task1, otherwise → task2
    const instruction = (
      containerQuestion.Exam_Container?.instruction || ""
    ).toLowerCase();
    const task_type =
      instruction.includes("task 1") || instruction.includes("task1")
        ? "task1"
        : "task2";

    const word_count = content.trim().split(/\s+/).filter(Boolean).length;

    // ── 1. Lưu submission ──────────────────────────────────────────────────
    const submission = await db.Writing_Submission.create({
      user_exam_id,
      container_question_id,
      content: content.trim(),
      word_count,
      status: "submitted",
      submitted_at: new Date(),
    });

    // ── 2. Gọi AI chấm điểm ───────────────────────────────────────────────
    let feedbackData = null;
    let aiError = null;

    const grading = await gradeIeltsWriting({
      task_prompt,
      user_content: content,
      task_type,
    }).catch((err) => {
      aiError = err;
      console.error("[submitWritingTask] AI grading error:", err.message);
      return null;
    });

    if (grading) {
      // ── 3. Lưu Writing_Feedback ─────────────────────────────────────────
      feedbackData = await db.Writing_Feedback.create({
        submission_id: submission.submission_id,
        model_name: "gpt-4o-mini",
        overall_score: grading.overall_band || 0,
        criteria_scores: grading.criteria_scores || {},
        comments: JSON.stringify({
          criteria_comments: grading.criteria_comments || {},
          feedback: grading.feedback || {},
          sample_improvements: grading.sample_improvements || [],
          word_count_note: grading.word_count_note || "",
          task_type,
        }),
        created_at: new Date(),
      });

      // Update submission status
      await submission.update({
        status: "graded",
        final_score: grading.overall_band,
      });

      // ── 4. Trừ token user + ghi transaction ─────────────────────────────
      try {
        const totalOpenAITokens = grading.usage?.total_tokens || 0;
        if (user_id && totalOpenAITokens > 0) {
          const quota = await getSystemQuota();
          const aiTokensUsed = Math.ceil(
            totalOpenAITokens / (quota.ai_token_unit || 1000),
          );

          const wallet = await db.User_Token_Wallet.findOne({
            where: { user_id },
          });

          if (wallet && wallet.token_balance >= aiTokensUsed) {
            await wallet.update({
              token_balance: wallet.token_balance - aiTokensUsed,
              updated_at: new Date(),
            });

            await db.User_Token_Transaction.create({
              user_id,
              amount: -aiTokensUsed,
              transaction_type: "usage",
              reference_id: submission.submission_id,
              created_at: new Date(),
            });
          }

          await deductTokenUsage(totalOpenAITokens, aiTokensUsed);
        }
      } catch (tokenErr) {
        // Token deduction failure should NOT block returning feedback
        console.error(
          "[submitWritingTask] Token deduction error:",
          tokenErr.message,
        );
      }
    }

    const parsedComments = (() => {
      try {
        return feedbackData ? JSON.parse(feedbackData.comments) : null;
      } catch {
        return null;
      }
    })();

    return {
      success: true,
      message: feedbackData
        ? "Bài viết đã được nộp và chấm điểm"
        : "Bài viết đã được nộp (chưa chấm được: " +
          (aiError?.message || "lỗi AI") +
          ")",
      data: {
        submission: {
          submission_id: submission.submission_id,
          word_count: submission.word_count,
          status: submission.status,
          final_score: submission.final_score,
          task_type,
        },
        feedback: feedbackData
          ? {
              overall_score: feedbackData.overall_score,
              criteria_scores: feedbackData.criteria_scores,
              criteria_comments: parsedComments?.criteria_comments || {},
              comments: parsedComments,
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
// Submit ALL writing tasks at once + final band
// ─────────────────────────────────────────────
export const submitAllWritingTasks = async (user_exam_id, tasks, user_id) => {
  if (!tasks || tasks.length === 0) {
    return { success: false, message: "Không có bài writing nào để nộp." };
  }

  const results = [];
  let totalOpenAITokens = 0;

  for (const task of tasks) {
    const { container_question_id, content } = task;

    if (!content || content.trim().split(/\s+/).filter(Boolean).length < 5) {
      results.push({
        container_question_id,
        success: false,
        message: "Bài viết quá ngắn",
        feedback: null,
      });
      continue;
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
      results.push({
        container_question_id,
        success: false,
        message: "Không tìm thấy câu hỏi",
        feedback: null,
      });
      continue;
    }

    const task_prompt = [
      containerQuestion.Exam_Container?.instruction,
      containerQuestion.Exam_Container?.content,
      containerQuestion.Question?.question_content,
    ]
      .filter(Boolean)
      .join("\n\n");

    const instr = (
      containerQuestion.Exam_Container?.instruction || ""
    ).toLowerCase();
    const task_type =
      instr.includes("task 1") || instr.includes("task1") ? "task1" : "task2";

    const word_count = content.trim().split(/\s+/).filter(Boolean).length;

    const submission = await db.Writing_Submission.create({
      user_exam_id,
      container_question_id,
      content: content.trim(),
      word_count,
      status: "submitted",
      submitted_at: new Date(),
    });

    const grading = await gradeIeltsWriting({
      task_prompt,
      user_content: content,
      task_type,
    }).catch((err) => {
      console.error(
        "[submitAllWriting] AI error task",
        container_question_id,
        err.message,
      );
      return null;
    });

    let feedbackData = null;
    if (grading) {
      feedbackData = await db.Writing_Feedback.create({
        submission_id: submission.submission_id,
        model_name: "gpt-4o-mini",
        overall_score: grading.overall_band || 0,
        criteria_scores: grading.criteria_scores || {},
        comments: JSON.stringify({
          criteria_comments: grading.criteria_comments || {},
          feedback: grading.feedback || {},
          sample_improvements: grading.sample_improvements || [],
          word_count_note: grading.word_count_note || "",
          task_type,
        }),
        created_at: new Date(),
      });

      await submission.update({
        status: "graded",
        final_score: grading.overall_band,
      });
      totalOpenAITokens += grading.usage?.total_tokens || 0;
    }

    const parsedComments = (() => {
      try {
        return feedbackData ? JSON.parse(feedbackData.comments) : null;
      } catch {
        return null;
      }
    })();

    results.push({
      container_question_id,
      task_type,
      instruction: containerQuestion.Exam_Container?.instruction || "",
      success: !!feedbackData,
      submission: {
        submission_id: submission.submission_id,
        word_count,
        status: submission.status,
        final_score: submission.final_score,
        task_type,
      },
      feedback: feedbackData
        ? {
            overall_score: feedbackData.overall_score,
            criteria_scores: feedbackData.criteria_scores,
            criteria_comments: parsedComments?.criteria_comments || {},
            comments: parsedComments,
          }
        : null,
    });
  }

  // ── Calculate final writing band ────────────────────────────────
  // IELTS standard weight: Task 1 = 1/3, Task 2 = 2/3
  const gradedTasks = results.filter((r) => r.feedback?.overall_score != null);
  let finalBand = null;

  if (gradedTasks.length > 0) {
    const task1 = gradedTasks.find((r) => r.task_type === "task1");
    const task2List = gradedTasks.filter((r) => r.task_type === "task2");

    if (task1 && task2List.length > 0) {
      const task2Avg =
        task2List.reduce((s, t) => s + t.feedback.overall_score, 0) /
        task2List.length;
      finalBand = task1.feedback.overall_score * (1 / 3) + task2Avg * (2 / 3);
    } else {
      finalBand =
        gradedTasks.reduce((s, t) => s + t.feedback.overall_score, 0) /
        gradedTasks.length;
    }
    finalBand = Math.round(finalBand * 2) / 2; // round to nearest 0.5
  }

  // ── Token deduction ─────────────────────────────────────────────
  if (user_id && totalOpenAITokens > 0) {
    try {
      const quota = await getSystemQuota();
      const aiTokensUsed = Math.ceil(
        totalOpenAITokens / (quota.ai_token_unit || 1000),
      );
      const wallet = await db.User_Token_Wallet.findOne({ where: { user_id } });
      if (wallet && wallet.token_balance >= aiTokensUsed) {
        await wallet.update({
          token_balance: wallet.token_balance - aiTokensUsed,
          updated_at: new Date(),
        });
        await db.User_Token_Transaction.create({
          user_id,
          amount: -aiTokensUsed,
          transaction_type: "usage",
          reference_id: user_exam_id,
          created_at: new Date(),
        });
      }
      await deductTokenUsage(totalOpenAITokens, aiTokensUsed);
    } catch (tokenErr) {
      console.error("[submitAllWriting] Token error:", tokenErr.message);
    }
  }

  return {
    success: true,
    message: `Đã chấm ${gradedTasks.length}/${results.length} bài writing`,
    data: {
      tasks: results,
      final_band: finalBand,
      graded_count: gradedTasks.length,
      total_count: results.length,
    },
  };
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
      container.Container_Questions?.[0]?.container_question_id ?? null;

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

    // Save transcript as draft — AI evaluation happens when exam is submitted
    await db.Speaking_Feedback.create({
      record_id: record.record_id,
      model_name: "draft",
      overall_score: 0,
      criteria_scores: {},
      comments: JSON.stringify({ status: "draft", transcript }),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      success: true,
      message: "Đã lưu phần speaking. AI sẽ đánh giá khi bạn nộp bài.",
      data: { record_id: record.record_id, status: "saved" },
    };
  } catch (error) {
    console.error("[submitSpeakingSession] ERROR:", error);
    return {
      success: false,
      message: error.message || "Failed to submit speaking session",
    };
  }
};

// Evaluate all speaking parts at once (called at exam submission)
export const evaluateAllSpeakingService = async (user_exam_id) => {
  try {
    const records = await db.Speaking_Record.findAll({
      where: { user_exam_id },
      include: [{ model: db.Speaking_Feedback, required: false }],
      order: [["record_id", "ASC"]],
    });

    if (records.length === 0) return { success: true, data: null };

    // Skip if already evaluated
    const alreadyDone = records.some(
      (r) => r.final_score != null && r.final_score > 0,
    );
    if (alreadyDone) return { success: true, data: null };

    // Collect draft transcripts
    const parts = records.map((record, idx) => {
      const fb = record.Speaking_Feedbacks?.[0];
      const parsed = fb
        ? (() => {
            try {
              return JSON.parse(fb.comments);
            } catch {
              return {};
            }
          })()
        : {};
      return {
        part_number: idx + 1,
        transcript: parsed.transcript || "",
        record_id: record.record_id,
        feedback_id: fb?.speaking_feedback_id ?? null,
      };
    });

    // One AI call for all parts combined
    const evaluation = await evaluateIeltsSpeakingAll({ parts });

    const combinedTranscript = parts
      .map(
        (p) =>
          `=== PART ${p.part_number} ===\n${p.transcript || "(Không có transcript)"}`,
      )
      .join("\n\n");

    const commentsJson = JSON.stringify({
      feedback: evaluation.feedback,
      criteria_comments: evaluation.criteria_comments || {},
      transcript: combinedTranscript,
    });

    // Update each record's final_score and save full feedback on first record
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      await record.update({ final_score: evaluation.overall_band || 0 });

      const part = parts[i];
      if (part.feedback_id) {
        const fb = record.Speaking_Feedbacks[0];
        await fb.update({
          model_name: "gpt-4o-mini",
          overall_score: evaluation.overall_band || 0,
          criteria_scores: evaluation.criteria_scores || {},
          comments:
            i === 0
              ? commentsJson
              : JSON.stringify({
                  status: "graded",
                  transcript: part.transcript,
                }),
        });
      } else {
        await db.Speaking_Feedback.create({
          record_id: record.record_id,
          model_name: "gpt-4o-mini",
          overall_score: evaluation.overall_band || 0,
          criteria_scores: i === 0 ? evaluation.criteria_scores || {} : {},
          comments:
            i === 0 ? commentsJson : JSON.stringify({ status: "graded" }),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    return {
      success: true,
      data: {
        overall_band: evaluation.overall_band,
        records_evaluated: records.length,
      },
    };
  } catch (error) {
    console.error("[evaluateAllSpeakingService] ERROR:", error);
    return { success: false, message: error.message };
  }
};

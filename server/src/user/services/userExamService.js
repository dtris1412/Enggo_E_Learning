import db from "../../models/index.js";

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

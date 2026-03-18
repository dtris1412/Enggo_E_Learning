import db from "../../models/index.js";

/**
 * CONTAINER QUESTION SERVICE
 * Quản lý nghiệp vụ liên kết Question với Container
 */

const addQuestionToContainer = async (
  container_id,
  question_id,
  order,
  image_url,
  score,
) => {
  if (!container_id || !question_id || !order) {
    return { success: false, message: "All fields are required." };
  }

  const container = await db.Exam_Container.findByPk(container_id);
  if (!container) {
    return { success: false, message: "Container not found." };
  }

  const question = await db.Question.findByPk(question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }

  const newContainerQuestion = await db.Container_Question.create({
    container_id,
    question_id,
    order,
    image_url: image_url || null,
    score: score || 1.0,
  });

  return {
    success: true,
    message: "Question added to container successfully",
    data: newContainerQuestion,
  };
};

const removeQuestionFromContainer = async (container_question_id) => {
  if (!container_question_id) {
    return { success: false, message: "Container Question ID is required." };
  }

  const containerQuestion = await db.Container_Question.findByPk(
    container_question_id,
  );
  if (!containerQuestion) {
    return { success: false, message: "Container question not found." };
  }

  await containerQuestion.destroy();

  return {
    success: true,
    message: "Question removed from container successfully",
  };
};

const updateQuestionOrderInContainer = async (
  container_question_id,
  order,
  image_url,
  score,
) => {
  if (!container_question_id) {
    return { success: false, message: "Container Question ID is required." };
  }

  const containerQuestion = await db.Container_Question.findByPk(
    container_question_id,
  );
  if (!containerQuestion) {
    return { success: false, message: "Container question not found." };
  }

  const updateData = {};
  if (order !== undefined) updateData.order = order;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (score !== undefined) updateData.score = score;

  await containerQuestion.update(updateData);

  return {
    success: true,
    message: "Question updated successfully",
    data: containerQuestion,
  };
};

/**
 * Thêm nhiều câu hỏi vào container cùng lúc
 * @param {number} container_id - ID của container
 * @param {Array} questionsData - Mảng các câu hỏi
 * Mỗi câu hỏi có cấu trúc:
 * {
 *   question_content: "Nội dung câu hỏi",
 *   explanation: "Giải thích",
 *   order: 1,
 *   image_url: "https://...",
 *   score: 1.0,
 *   options: [
 *     { label: "A", content: "Đáp án A", is_correct: false, order_index: 1 },
 *     { label: "B", content: "Đáp án B", is_correct: true, order_index: 2 },
 *     ...
 *   ]
 * }
 */
const addMultipleQuestionsToContainer = async (container_id, questionsData) => {
  // Kiểm tra container tồn tại
  const container = await db.Exam_Container.findByPk(container_id);
  if (!container) {
    return { success: false, message: "Container not found." };
  }

  // Validate input
  if (!Array.isArray(questionsData) || questionsData.length === 0) {
    return {
      success: false,
      message: "Questions data must be a non-empty array.",
    };
  }

  // Validate từng câu hỏi
  for (let i = 0; i < questionsData.length; i++) {
    const q = questionsData[i];

    if (!q.question_content || !q.question_content.trim()) {
      return {
        success: false,
        message: `Question at index ${i} must have question_content.`,
      };
    }

    if (!q.order || isNaN(q.order)) {
      return {
        success: false,
        message: `Question at index ${i} must have a valid order number.`,
      };
    }

    if (!Array.isArray(q.options) || q.options.length === 0) {
      return {
        success: false,
        message: `Question at index ${i} must have at least one option.`,
      };
    }

    // Validate options
    for (let j = 0; j < q.options.length; j++) {
      const opt = q.options[j];
      if (!opt.label || !opt.content || opt.is_correct === undefined) {
        return {
          success: false,
          message: `Option at index ${j} in question ${i} is missing required fields (label, content, is_correct).`,
        };
      }
    }

    // Kiểm tra có ít nhất 1 đáp án đúng
    const hasCorrectAnswer = q.options.some((opt) => opt.is_correct === true);
    if (!hasCorrectAnswer) {
      return {
        success: false,
        message: `Question at index ${i} must have at least one correct answer.`,
      };
    }
  }

  // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
  const transaction = await db.sequelize.transaction();

  try {
    const createdQuestions = [];

    for (const questionData of questionsData) {
      // 1. Tạo Question
      const question = await db.Question.create(
        {
          question_content: questionData.question_content.trim(),
          explanation: questionData.explanation?.trim() || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction },
      );

      // 2. Tạo Container_Question (liên kết question với container)
      const containerQuestion = await db.Container_Question.create(
        {
          container_id,
          question_id: question.question_id,
          order: questionData.order,
          image_url: questionData.image_url?.trim() || null,
          score: questionData.score || 1.0,
        },
        { transaction },
      );

      // 3. Tạo Question_Options
      const optionsToCreate = questionData.options.map((opt) => ({
        container_question_id: containerQuestion.container_question_id,
        label: opt.label.trim(),
        content: opt.content.trim(),
        is_correct: opt.is_correct,
        order_index: opt.order_index || 1,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const options = await db.Question_Option.bulkCreate(optionsToCreate, {
        transaction,
      });

      createdQuestions.push({
        question,
        containerQuestion,
        options,
      });
    }

    // Commit transaction
    await transaction.commit();

    return {
      success: true,
      message: `${createdQuestions.length} questions added to container successfully.`,
      data: createdQuestions,
    };
  } catch (error) {
    // Rollback nếu có lỗi
    await transaction.rollback();
    console.error("[addMultipleQuestionsToContainer] Error:", error);
    return {
      success: false,
      message: "Failed to add questions to container.",
      error: error.message,
    };
  }
};

export {
  addQuestionToContainer,
  removeQuestionFromContainer,
  updateQuestionOrderInContainer,
  addMultipleQuestionsToContainer,
};

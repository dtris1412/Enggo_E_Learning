import {
  createQuestion as createQuestionService,
  updateQuestion as updateQuestionService,
  getQuestionsByLessonIdPaginated as getQuestionsByLessonIdPaginatedService,
  getQuestionsPaginated as getQuestionsPaginatedService,
  getQuestionById as getQuestionByIdService,
  lockQuestion as lockQuestionService,
  unlockQuestion as unlockQuestionService,
} from "../services/lesson_questionService.js";

const createQuestion = async (req, res) => {
  try {
    const {
      order_index,
      question_type,
      content,
      correct_answer,
      explaination,
      difficulty_level,
      generate_by_ai,
      options,
      ai_model,
      status,
    } = req.body;
    const { lesson_id } = req.body;
    const result = await createQuestionService(
      order_index,
      question_type,
      content,
      correct_answer,
      explaination,
      difficulty_level,
      generate_by_ai,
      lesson_id,
      options,
      ai_model,
      status,
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: result.data,
    });
  } catch (err) {
    console.error("Create question error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const {
      order_index,
      question_type,
      content,
      correct_answer,
      explaination,
      difficulty_level,
      generate_by_ai,
      options,
      ai_model,
      status,
    } = req.body;
    const { lesson_question_id } = req.params;
    const result = await updateQuestionService(
      lesson_question_id,
      order_index,
      question_type,
      content,
      correct_answer,
      explaination,
      difficulty_level,
      generate_by_ai,
      options,
      ai_model,
      status,
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: result.data,
    });
  } catch (err) {
    console.error("Update question error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getQuestionsByLessonIdPaginated = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const { search = "", limit = 10, page = 1 } = req.query;
    const result = await getQuestionsByLessonIdPaginatedService(
      lesson_id,
      search,
      page,
      limit,
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions: result.questions,
      totalQuestions: result.totalQuestions,
    });
  } catch (err) {
    console.error("Get questions by lesson ID error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getQuestionsPaginated = async (req, res) => {
  try {
    const { search = "", limit = 10, page = 1, lesson_id } = req.query;
    const result = await getQuestionsPaginatedService(
      search,
      page,
      limit,
      lesson_id,
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions: result.questions,
      totalQuestions: result.totalQuestions,
    });
  } catch (err) {
    console.error("Get questions paginated error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { lesson_question_id } = req.params;
    const result = await getQuestionByIdService(lesson_question_id);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Question retrieved successfully",
      data: result.data,
    });
  } catch (err) {
    console.error("Get question by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const lockQuestion = async (req, res) => {
  try {
    const { lesson_question_id } = req.params;
    const result = await lockQuestionService(lesson_question_id);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Question locked successfully",
      data: result.data,
    });
  } catch (err) {
    console.error("Lock question error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const unlockQuestion = async (req, res) => {
  try {
    const { lesson_question_id } = req.params;
    const result = await unlockQuestionService(lesson_question_id);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Question unlocked successfully",
      data: result.data,
    });
  } catch (err) {
    console.error("Unlock question error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  createQuestion,
  updateQuestion,
  getQuestionsByLessonIdPaginated,
  getQuestionsPaginated,
  getQuestionById,
  lockQuestion,
  unlockQuestion,
};

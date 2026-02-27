import flashcardService from "../services/flashcardService.js";

// Lấy danh sách flashcards trong một set
const getFlashcardsBySetId = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const { page, limit, difficulty_level } = req.query;

    const result = await flashcardService.getFlashcardsBySetId({
      flashcard_set_id,
      page,
      limit,
      difficulty_level,
    });

    return res.status(200).json({
      success: true,
      message: "Flashcards retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get flashcards error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get flashcards",
      error: error.message,
    });
  }
};

// Lấy flashcard theo ID
const getFlashcardById = async (req, res) => {
  try {
    const { flashcard_id } = req.params;

    const flashcard = await flashcardService.getFlashcardById(flashcard_id);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: "Flashcard not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Flashcard retrieved successfully",
      data: flashcard,
    });
  } catch (error) {
    console.error("Get flashcard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get flashcard",
      error: error.message,
    });
  }
};

// Tạo flashcard mới
const createFlashcard = async (req, res) => {
  try {
    const {
      flashcard_set_id,
      container_question_id,
      front_content,
      back_content,
      example,
      difficulty_level,
      pronunciation,
    } = req.body;

    // Validate required fields
    if (!flashcard_set_id || !front_content || !back_content) {
      return res.status(400).json({
        success: false,
        message:
          "flashcard_set_id, front_content, and back_content are required",
      });
    }

    // Validate difficulty_level
    const validDifficultyLevels = ["beginner", "intermediate", "advanced"];
    if (difficulty_level && !validDifficultyLevels.includes(difficulty_level)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid difficulty_level. Must be: beginner, intermediate, or advanced",
      });
    }

    const flashcard = await flashcardService.createFlashcard({
      flashcard_set_id,
      container_question_id,
      front_content,
      back_content,
      example,
      difficulty_level,
      pronunciation,
    });

    return res.status(201).json({
      success: true,
      message: "Flashcard created successfully",
      data: flashcard,
    });
  } catch (error) {
    console.error("Create flashcard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create flashcard",
      error: error.message,
    });
  }
};

// Tạo nhiều flashcards cùng lúc
const createMultipleFlashcards = async (req, res) => {
  try {
    const { flashcard_set_id, flashcards } = req.body;

    // Validate
    if (!flashcard_set_id || !flashcards || !Array.isArray(flashcards)) {
      return res.status(400).json({
        success: false,
        message: "flashcard_set_id and flashcards array are required",
      });
    }

    // Validate từng flashcard
    for (const card of flashcards) {
      if (!card.front_content || !card.back_content) {
        return res.status(400).json({
          success: false,
          message: "Each flashcard must have front_content and back_content",
        });
      }
    }

    const createdFlashcards = await flashcardService.createMultipleFlashcards(
      flashcard_set_id,
      flashcards,
    );

    return res.status(201).json({
      success: true,
      message: "Flashcards created successfully",
      data: createdFlashcards,
    });
  } catch (error) {
    console.error("Create multiple flashcards error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create flashcards",
      error: error.message,
    });
  }
};

// Cập nhật flashcard
const updateFlashcard = async (req, res) => {
  try {
    const { flashcard_id } = req.params;
    const {
      container_question_id,
      front_content,
      back_content,
      example,
      difficulty_level,
      pronunciation,
    } = req.body;

    const updateData = {};

    if (container_question_id !== undefined)
      updateData.container_question_id = container_question_id;
    if (front_content) updateData.front_content = front_content;
    if (back_content) updateData.back_content = back_content;
    if (example !== undefined) updateData.example = example;
    if (pronunciation !== undefined) updateData.pronunciation = pronunciation;

    if (difficulty_level) {
      const validDifficultyLevels = ["beginner", "intermediate", "advanced"];
      if (!validDifficultyLevels.includes(difficulty_level)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid difficulty_level. Must be: beginner, intermediate, or advanced",
        });
      }
      updateData.difficulty_level = difficulty_level;
    }

    const flashcard = await flashcardService.updateFlashcard(
      flashcard_id,
      updateData,
    );

    return res.status(200).json({
      success: true,
      message: "Flashcard updated successfully",
      data: flashcard,
    });
  } catch (error) {
    console.error("Update flashcard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update flashcard",
      error: error.message,
    });
  }
};

// Xóa flashcard
const deleteFlashcard = async (req, res) => {
  try {
    const { flashcard_id } = req.params;

    await flashcardService.deleteFlashcard(flashcard_id);

    return res.status(200).json({
      success: true,
      message: "Flashcard deleted successfully",
    });
  } catch (error) {
    console.error("Delete flashcard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete flashcard",
      error: error.message,
    });
  }
};

// Xóa nhiều flashcards
const deleteMultipleFlashcards = async (req, res) => {
  try {
    const { flashcard_ids } = req.body;

    if (!flashcard_ids || !Array.isArray(flashcard_ids)) {
      return res.status(400).json({
        success: false,
        message: "flashcard_ids array is required",
      });
    }

    await flashcardService.deleteMultipleFlashcards(flashcard_ids);

    return res.status(200).json({
      success: true,
      message: "Flashcards deleted successfully",
    });
  } catch (error) {
    console.error("Delete multiple flashcards error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete flashcards",
      error: error.message,
    });
  }
};

export {
  getFlashcardsBySetId,
  getFlashcardById,
  createFlashcard,
  createMultipleFlashcards,
  updateFlashcard,
  deleteFlashcard,
  deleteMultipleFlashcards,
};

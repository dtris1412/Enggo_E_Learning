import db from "../../models/index.js";
import { Op } from "sequelize";
import userFlashcardSetService from "./userFlashcardSetService.js";

// Lấy tất cả flashcards trong một set (có phân trang)
// User chỉ có thể xem flashcards trong sets mà họ có quyền xem
const getFlashcardsBySetId = async (
  flashcard_set_id,
  user_id = null,
  page = 1,
  limit = 20,
  difficulty_level = "",
) => {
  // Kiểm tra quyền xem flashcard set trước
  const setPermission = await userFlashcardSetService.getFlashcardSetById(
    flashcard_set_id,
    user_id,
  );

  if (!setPermission.success) {
    return setPermission; // Trả về lỗi permission
  }

  const offset = (Number(page) - 1) * Number(limit);

  const whereClause = { flashcard_set_id };

  // Filter theo difficulty_level
  if (difficulty_level) {
    whereClause.difficulty_level = difficulty_level;
  }

  const { count, rows } = await db.Flashcard.findAndCountAll({
    where: whereClause,
    limit: Number(limit),
    offset: Number(offset),
    order: [["flashcard_id", "ASC"]],
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      flashcards: rows,
    },
  };
};

// Lấy flashcard theo ID
const getFlashcardById = async (flashcard_id, user_id = null) => {
  if (!flashcard_id) {
    return { success: false, message: "Flashcard ID is required." };
  }

  const flashcard = await db.Flashcard.findOne({
    where: { flashcard_id },
    include: [
      {
        model: db.Flashcard_Set,
        attributes: [
          "flashcard_set_id",
          "title",
          "description",
          "user_id",
          "visibility",
        ],
      },
    ],
  });

  if (!flashcard) {
    return { success: false, message: "Flashcard not found." };
  }

  // Kiểm tra quyền xem (qua flashcard set)
  const set = flashcard.Flashcard_Set;
  if (set.visibility !== "public" && set.user_id !== user_id) {
    return {
      success: false,
      message: "You don't have permission to view this flashcard.",
    };
  }

  return {
    success: true,
    data: flashcard,
  };
};

// Tạo flashcard mới
// Chỉ owner của flashcard set mới được tạo flashcard
const createFlashcard = async (flashcard_set_id, user_id, data) => {
  // Kiểm tra ownership của flashcard set
  const flashcardSet = await db.Flashcard_Set.findOne({
    where: {
      flashcard_set_id,
      user_id, // Phải là owner
    },
  });

  if (!flashcardSet) {
    return {
      success: false,
      message:
        "Flashcard set not found or you don't have permission to add flashcards.",
    };
  }

  const {
    front_content,
    back_content,
    example = null,
    difficulty_level = null,
    pronunciation = null,
  } = data;

  if (!front_content || !front_content.trim()) {
    return { success: false, message: "Front content is required." };
  }

  if (!back_content || !back_content.trim()) {
    return { success: false, message: "Back content is required." };
  }

  // Validate difficulty_level nếu có
  if (
    difficulty_level &&
    !["easy", "medium", "hard"].includes(difficulty_level)
  ) {
    return {
      success: false,
      message: "Invalid difficulty level. Must be 'easy', 'medium', or 'hard'.",
    };
  }

  const flashcard = await db.Flashcard.create({
    flashcard_set_id,
    front_content: front_content.trim(),
    back_content: back_content.trim(),
    example: example?.trim() || null,
    difficulty_level,
    pronunciation: pronunciation?.trim() || null,
  });

  // Cập nhật total_cards trong flashcard_set
  await userFlashcardSetService.updateTotalCards(flashcard_set_id);

  return {
    success: true,
    message: "Flashcard created successfully.",
    data: flashcard,
  };
};

// Tạo nhiều flashcards cùng lúc
const createMultipleFlashcards = async (
  flashcard_set_id,
  user_id,
  flashcardsData,
) => {
  // Kiểm tra ownership
  const flashcardSet = await db.Flashcard_Set.findOne({
    where: {
      flashcard_set_id,
      user_id,
    },
  });

  if (!flashcardSet) {
    return {
      success: false,
      message: "Flashcard set not found or you don't have permission.",
    };
  }

  if (!Array.isArray(flashcardsData) || flashcardsData.length === 0) {
    return {
      success: false,
      message: "Flashcards data must be a non-empty array.",
    };
  }

  // Validate từng item
  for (const card of flashcardsData) {
    if (!card.front_content || !card.front_content.trim()) {
      return {
        success: false,
        message: "All flashcards must have front_content.",
      };
    }
    if (!card.back_content || !card.back_content.trim()) {
      return {
        success: false,
        message: "All flashcards must have back_content.",
      };
    }
  }

  const flashcards = await db.Flashcard.bulkCreate(
    flashcardsData.map((card) => ({
      flashcard_set_id,
      front_content: card.front_content.trim(),
      back_content: card.back_content.trim(),
      example: card.example?.trim() || null,
      difficulty_level: card.difficulty_level || null,
      pronunciation: card.pronunciation?.trim() || null,
    })),
  );

  // Cập nhật total_cards
  await userFlashcardSetService.updateTotalCards(flashcard_set_id);

  return {
    success: true,
    message: `${flashcards.length} flashcards created successfully.`,
    data: flashcards,
  };
};

// Cập nhật flashcard
// Chỉ owner của flashcard set mới được update
const updateFlashcard = async (flashcard_id, user_id, data) => {
  const flashcard = await db.Flashcard.findOne({
    where: { flashcard_id },
    include: [
      {
        model: db.Flashcard_Set,
        attributes: ["flashcard_set_id", "user_id"],
      },
    ],
  });

  if (!flashcard) {
    return { success: false, message: "Flashcard not found." };
  }

  // Kiểm tra ownership qua flashcard set
  if (flashcard.Flashcard_Set.user_id !== user_id) {
    return {
      success: false,
      message: "You don't have permission to update this flashcard.",
    };
  }

  const {
    front_content,
    back_content,
    example,
    difficulty_level,
    pronunciation,
  } = data;

  // Validate
  if (
    front_content !== undefined &&
    (!front_content || !front_content.trim())
  ) {
    return { success: false, message: "Front content cannot be empty." };
  }

  if (back_content !== undefined && (!back_content || !back_content.trim())) {
    return { success: false, message: "Back content cannot be empty." };
  }

  if (
    difficulty_level &&
    !["easy", "medium", "hard"].includes(difficulty_level)
  ) {
    return {
      success: false,
      message: "Invalid difficulty level. Must be 'easy', 'medium', or 'hard'.",
    };
  }

  // Update
  const updateData = {};
  if (front_content !== undefined)
    updateData.front_content = front_content.trim();
  if (back_content !== undefined) updateData.back_content = back_content.trim();
  if (example !== undefined) updateData.example = example?.trim() || null;
  if (difficulty_level !== undefined)
    updateData.difficulty_level = difficulty_level;
  if (pronunciation !== undefined)
    updateData.pronunciation = pronunciation?.trim() || null;

  await flashcard.update(updateData);

  return {
    success: true,
    message: "Flashcard updated successfully.",
    data: flashcard,
  };
};

// Xóa flashcard
// Chỉ owner của flashcard set mới được delete
const deleteFlashcard = async (flashcard_id, user_id) => {
  const flashcard = await db.Flashcard.findOne({
    where: { flashcard_id },
    include: [
      {
        model: db.Flashcard_Set,
        attributes: ["flashcard_set_id", "user_id"],
      },
    ],
  });

  if (!flashcard) {
    return { success: false, message: "Flashcard not found." };
  }

  // Kiểm tra ownership
  if (flashcard.Flashcard_Set.user_id !== user_id) {
    return {
      success: false,
      message: "You don't have permission to delete this flashcard.",
    };
  }

  const flashcard_set_id = flashcard.flashcard_set_id;

  await flashcard.destroy();

  // Cập nhật total_cards
  await userFlashcardSetService.updateTotalCards(flashcard_set_id);

  return {
    success: true,
    message: "Flashcard deleted successfully.",
  };
};

// Xóa nhiều flashcards
const deleteMultipleFlashcards = async (flashcard_ids, user_id) => {
  if (!Array.isArray(flashcard_ids) || flashcard_ids.length === 0) {
    return {
      success: false,
      message: "Flashcard IDs must be a non-empty array.",
    };
  }

  const flashcards = await db.Flashcard.findAll({
    where: { flashcard_id: { [Op.in]: flashcard_ids } },
    include: [
      {
        model: db.Flashcard_Set,
        attributes: ["flashcard_set_id", "user_id"],
      },
    ],
  });

  if (flashcards.length === 0) {
    return { success: false, message: "No flashcards found." };
  }

  // Kiểm tra ownership - tất cả phải cùng set và user phải là owner
  const flashcard_set_id = flashcards[0].Flashcard_Set.flashcard_set_id;
  const isOwner = flashcards.every(
    (card) =>
      card.Flashcard_Set.user_id === user_id &&
      card.Flashcard_Set.flashcard_set_id === flashcard_set_id,
  );

  if (!isOwner) {
    return {
      success: false,
      message: "You don't have permission to delete these flashcards.",
    };
  }

  await db.Flashcard.destroy({
    where: { flashcard_id: { [Op.in]: flashcard_ids } },
  });

  // Cập nhật total_cards
  await userFlashcardSetService.updateTotalCards(flashcard_set_id);

  return {
    success: true,
    message: `${flashcards.length} flashcards deleted successfully.`,
  };
};

export default {
  getFlashcardsBySetId,
  getFlashcardById,
  createFlashcard,
  createMultipleFlashcards,
  updateFlashcard,
  deleteFlashcard,
  deleteMultipleFlashcards,
};

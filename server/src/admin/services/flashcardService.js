import db from "../../models/index.js";
import { Op } from "sequelize";
import flashcardSetService from "./flashcard_setService.js";

// Lấy tất cả flashcards trong một set (có phân trang)
const getFlashcardsBySetId = async ({
  flashcard_set_id,
  page = 1,
  limit = 20,
  difficulty_level = "",
}) => {
  const offset = (page - 1) * limit;

  const whereClause = { flashcard_set_id };

  // Filter theo difficulty_level
  if (difficulty_level) {
    whereClause.difficulty_level = difficulty_level;
  }

  const { count, rows } = await db.Flashcard.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: offset,
    order: [["flashcard_id", "ASC"]],
  });

  return {
    flashcards: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy flashcard theo ID
const getFlashcardById = async (flashcard_id) => {
  const flashcard = await db.Flashcard.findOne({
    where: { flashcard_id },
    include: [
      {
        model: db.Flashcard_Set,
        attributes: ["flashcard_set_id", "title", "description"],
      },
    ],
  });

  return flashcard;
};

// Tạo flashcard mới
const createFlashcard = async ({
  flashcard_set_id,
  container_question_id = null,
  front_content,
  back_content,
  example = null,
  difficulty_level = null,
  pronunciation = null,
}) => {
  const flashcard = await db.Flashcard.create({
    flashcard_set_id,
    container_question_id,
    front_content,
    back_content,
    example,
    difficulty_level,
    pronunciation,
  });

  // Cập nhật total_cards trong flashcard_set
  await flashcardSetService.updateTotalCards(flashcard_set_id);

  return flashcard;
};

// Tạo nhiều flashcards cùng lúc
const createMultipleFlashcards = async (flashcard_set_id, flashcardsData) => {
  const flashcards = await db.Flashcard.bulkCreate(
    flashcardsData.map((card) => ({
      ...card,
      flashcard_set_id,
    })),
  );

  // Cập nhật total_cards
  await flashcardSetService.updateTotalCards(flashcard_set_id);

  return flashcards;
};

// Cập nhật flashcard
const updateFlashcard = async (flashcard_id, data) => {
  const flashcard = await db.Flashcard.findByPk(flashcard_id);

  if (!flashcard) {
    throw new Error("Flashcard not found");
  }

  await flashcard.update(data);

  return flashcard;
};

// Xóa flashcard
const deleteFlashcard = async (flashcard_id) => {
  const flashcard = await db.Flashcard.findByPk(flashcard_id);

  if (!flashcard) {
    throw new Error("Flashcard not found");
  }

  const flashcard_set_id = flashcard.flashcard_set_id;

  await flashcard.destroy();

  // Cập nhật total_cards
  await flashcardSetService.updateTotalCards(flashcard_set_id);

  return { message: "Flashcard deleted successfully" };
};

// Xóa nhiều flashcards
const deleteMultipleFlashcards = async (flashcard_ids) => {
  const flashcards = await db.Flashcard.findAll({
    where: { flashcard_id: { [Op.in]: flashcard_ids } },
  });

  if (flashcards.length === 0) {
    throw new Error("No flashcards found");
  }

  const flashcard_set_id = flashcards[0].flashcard_set_id;

  await db.Flashcard.destroy({
    where: { flashcard_id: { [Op.in]: flashcard_ids } },
  });

  // Cập nhật total_cards
  await flashcardSetService.updateTotalCards(flashcard_set_id);

  return { message: "Flashcards deleted successfully" };
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

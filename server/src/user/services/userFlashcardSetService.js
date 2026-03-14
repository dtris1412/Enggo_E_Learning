import db from "../../models/index.js";
import { Op } from "sequelize";

// Lấy tất cả flashcard sets (phân trang, filter, search)
// User chỉ thấy: flashcard sets public HOẶC của chính họ
const getFlashcardSetsPaginated = async (
  user_id = null,
  search = "",
  page = 1,
  limit = 10,
  visibility = "",
  created_by_type = "",
  sortBy = "created_at",
  sortOrder = "DESC",
) => {
  console.log("[getFlashcardSetsPaginated] START - Params:", {
    user_id,
    search,
    page,
    limit,
    visibility,
    created_by_type,
    sortBy,
    sortOrder,
  });

  const offset = (Number(page) - 1) * Number(limit);

  const whereClause = {};

  // User can see: public sets OR their own sets
  if (user_id) {
    // Logged in: can see public sets OR own sets
    Object.assign(whereClause, {
      [Op.or]: [{ visibility: "public" }, { user_id: user_id }],
    });
  } else {
    // Not logged in: only public sets
    whereClause.visibility = "public";
  }

  // Search theo title hoặc description
  if (search && search.trim()) {
    whereClause[Op.and] = whereClause[Op.and] || [];
    whereClause[Op.and].push({
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ],
    });
  }

  // Filter theo visibility (chỉ áp dụng nếu user muốn filter thêm)
  if (visibility) {
    whereClause.visibility = visibility;
  }

  // Filter theo created_by_type
  if (created_by_type) {
    whereClause.created_by_type = created_by_type;
  }

  // Validate sortBy field
  const allowedSortFields = [
    "created_at",
    "updated_at",
    "title",
    "total_cards",
  ];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  console.log(
    "[getFlashcardSetsPaginated] Where clause:",
    JSON.stringify(whereClause, null, 2),
  );
  console.log("[getFlashcardSetsPaginated] Sort:", {
    validSortBy,
    validSortOrder,
  });

  const { count, rows } = await db.Flashcard_Set.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
    limit: Number(limit),
    offset: Number(offset),
    order: [[validSortBy, validSortOrder]],
    distinct: true,
  });

  console.log(
    "[getFlashcardSetsPaginated] Result: Found",
    count,
    "sets,",
    rows.length,
    "rows returned",
  );

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      flashcardSets: rows,
    },
  };
};

// Lấy flashcard set theo ID
// User có thể xem: public sets HOẶC sets của chính họ
const getFlashcardSetById = async (flashcard_set_id, user_id = null) => {
  console.log("[getFlashcardSetById] START - Params:", {
    flashcard_set_id,
    user_id,
  });

  if (!flashcard_set_id) {
    console.log("[getFlashcardSetById] ERROR: Flashcard set ID is required");
    return { success: false, message: "Flashcard set ID is required." };
  }

  const whereClause = {
    flashcard_set_id,
  };

  // User can see: public sets OR their own sets
  if (user_id) {
    // Logged in: can see public sets OR own sets
    Object.assign(whereClause, {
      [Op.or]: [{ visibility: "public" }, { user_id: user_id }],
    });
  } else {
    // Not logged in: only public sets
    whereClause.visibility = "public";
  }

  console.log(
    "[getFlashcardSetById] Where clause:",
    JSON.stringify(whereClause, null, 2),
  );

  const flashcardSet = await db.Flashcard_Set.findOne({
    where: whereClause,
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
      {
        model: db.Flashcard,
        attributes: [
          "flashcard_id",
          "front_content",
          "back_content",
          "example",
          "difficulty_level",
          "pronunciation",
        ],
        order: [["flashcard_id", "ASC"]],
      },
    ],
  });

  if (!flashcardSet) {
    console.log(
      "[getFlashcardSetById] ERROR: Flashcard set not found or no permission",
    );
    return {
      success: false,
      message:
        "Flashcard set not found or you don't have permission to view it.",
    };
  }

  console.log("[getFlashcardSetById] SUCCESS: Found set", {
    flashcard_set_id: flashcardSet.flashcard_set_id,
    user_id: flashcardSet.user_id,
    visibility: flashcardSet.visibility,
    total_cards: flashcardSet.total_cards,
  });

  return {
    success: true,
    data: flashcardSet,
  };
};

// Tạo flashcard set mới (user phải login)
const createFlashcardSet = async (user_id, data) => {
  console.log("[createFlashcardSet] START - Params:", { user_id, data });

  const { title, description = null, visibility = "private" } = data;

  if (!title || !title.trim()) {
    console.log("[createFlashcardSet] ERROR: Title is required");
    return { success: false, message: "Title is required." };
  }

  // Validate visibility
  if (!["public", "private"].includes(visibility)) {
    console.log("[createFlashcardSet] ERROR: Invalid visibility:", visibility);
    return {
      success: false,
      message: "Invalid visibility. Must be 'public' or 'private'.",
    };
  }

  const flashcardSet = await db.Flashcard_Set.create({
    user_id,
    title: title.trim(),
    description: description?.trim() || null,
    visibility,
    created_by_type: "user", // Đánh dấu là user tạo
    total_cards: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });

  console.log("[createFlashcardSet] SUCCESS: Created set", {
    flashcard_set_id: flashcardSet.flashcard_set_id,
    title: flashcardSet.title,
    visibility: flashcardSet.visibility,
  });

  return {
    success: true,
    message: "Flashcard set created successfully.",
    data: flashcardSet,
  };
};

// Cập nhật flashcard set (chỉ owner)
const updateFlashcardSet = async (flashcard_set_id, user_id, data) => {
  console.log("[updateFlashcardSet] START - Params:", {
    flashcard_set_id,
    user_id,
    data,
  });

  const flashcardSet = await db.Flashcard_Set.findOne({
    where: {
      flashcard_set_id,
      user_id, // Chỉ owner mới update được
    },
  });

  if (!flashcardSet) {
    console.log("[updateFlashcardSet] ERROR: Set not found or no permission", {
      flashcard_set_id,
      user_id,
    });
    return {
      success: false,
      message:
        "Flashcard set not found or you don't have permission to update it.",
    };
  }

  console.log("[updateFlashcardSet] Found set to update:", {
    flashcard_set_id: flashcardSet.flashcard_set_id,
    current_title: flashcardSet.title,
  });

  const { title, description, visibility } = data;

  // Validate
  if (title !== undefined && (!title || !title.trim())) {
    console.log("[updateFlashcardSet] ERROR: Title cannot be empty");
    return { success: false, message: "Title cannot be empty." };
  }

  if (visibility && !["public", "private"].includes(visibility)) {
    console.log("[updateFlashcardSet] ERROR: Invalid visibility:", visibility);
    return {
      success: false,
      message: "Invalid visibility. Must be 'public' or 'private'.",
    };
  }

  // Update
  const updateData = {
    updated_at: new Date(),
  };

  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined)
    updateData.description = description?.trim() || null;
  if (visibility !== undefined) updateData.visibility = visibility;

  await flashcardSet.update(updateData);

  console.log("[updateFlashcardSet] SUCCESS: Updated set", {
    flashcard_set_id,
    updateData,
  });

  return {
    success: true,
    message: "Flashcard set updated successfully.",
    data: flashcardSet,
  };
};

// Xóa flashcard set (chỉ owner)
const deleteFlashcardSet = async (flashcard_set_id, user_id) => {
  console.log("[deleteFlashcardSet] START - Params:", {
    flashcard_set_id,
    user_id,
  });

  const flashcardSet = await db.Flashcard_Set.findOne({
    where: {
      flashcard_set_id,
      user_id, // Chỉ owner mới delete được
    },
  });

  if (!flashcardSet) {
    console.log("[deleteFlashcardSet] ERROR: Set not found or no permission", {
      flashcard_set_id,
      user_id,
    });
    return {
      success: false,
      message:
        "Flashcard set not found or you don't have permission to delete it.",
    };
  }

  console.log("[deleteFlashcardSet] Deleting set and its flashcards:", {
    flashcard_set_id,
  });

  // Xóa tất cả flashcards trong set trước
  const deletedFlashcards = await db.Flashcard.destroy({
    where: { flashcard_set_id },
  });
  console.log("[deleteFlashcardSet] Deleted", deletedFlashcards, "flashcards");

  // Xóa set
  await flashcardSet.destroy();
  console.log("[deleteFlashcardSet] SUCCESS: Deleted set", {
    flashcard_set_id,
  });

  return {
    success: true,
    message: "Flashcard set deleted successfully.",
  };
};

// Cập nhật total_cards count (internal helper)
const updateTotalCards = async (flashcard_set_id) => {
  console.log("[updateTotalCards] START - Params:", { flashcard_set_id });

  const flashcardSet = await db.Flashcard_Set.findByPk(flashcard_set_id);

  if (!flashcardSet) {
    console.log("[updateTotalCards] ERROR: Flashcard set not found", {
      flashcard_set_id,
    });
    throw new Error("Flashcard set not found");
  }

  const count = await db.Flashcard.count({
    where: { flashcard_set_id },
  });

  console.log(
    "[updateTotalCards] Updating total_cards from",
    flashcardSet.total_cards,
    "to",
    count,
  );

  flashcardSet.total_cards = count;
  flashcardSet.updated_at = new Date();
  await flashcardSet.save();

  console.log("[updateTotalCards] SUCCESS: Updated total_cards", {
    flashcard_set_id,
    total_cards: count,
  });

  return flashcardSet;
};

// Lấy flashcard sets của user hiện tại
const getMyFlashcardSets = async (
  user_id,
  page = 1,
  limit = 10,
  search = "",
  sortBy = "created_at",
  sortOrder = "DESC",
) => {
  console.log("[getMyFlashcardSets] START - Params:", {
    user_id,
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  const offset = (Number(page) - 1) * Number(limit);

  const whereClause = {
    user_id, // Chỉ lấy sets của user
  };

  // Search theo title hoặc description
  if (search && search.trim()) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  // Validate sortBy field
  const allowedSortFields = [
    "created_at",
    "updated_at",
    "title",
    "total_cards",
  ];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  console.log(
    "[getMyFlashcardSets] Where clause:",
    JSON.stringify(whereClause, null, 2),
  );
  console.log("[getMyFlashcardSets] Sort:", { validSortBy, validSortOrder });

  const { count, rows } = await db.Flashcard_Set.findAndCountAll({
    where: whereClause,
    limit: Number(limit),
    offset: Number(offset),
    order: [[validSortBy, validSortOrder]],
    distinct: true,
  });

  console.log(
    "[getMyFlashcardSets] SUCCESS: Found",
    count,
    "sets,",
    rows.length,
    "rows returned",
  );

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      flashcardSets: rows,
    },
  };
};

export default {
  getFlashcardSetsPaginated,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  updateTotalCards,
  getMyFlashcardSets,
};

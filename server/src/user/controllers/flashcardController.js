import userFlashcardSetService from "../services/userFlashcardSetService.js";
import userFlashcardService from "../services/userFlashcardService.js";

// ==================== FLASHCARD SET CONTROLLERS ====================

// Lấy tất cả flashcard sets (public và của user nếu đã login)
const getFlashcardSetsPaginated = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      visibility,
      created_by_type,
      sortBy,
      sortOrder,
    } = req.query;

    const user_id = req.user?.user_id; // Optional - từ optionalVerifyToken

    console.log("[CONTROLLER] getFlashcardSetsPaginated - Request:", {
      user_id,
      isAuthenticated: !!req.user,
      filters: {
        search,
        page,
        limit,
        visibility,
        created_by_type,
        sortBy,
        sortOrder,
      },
    });

    const result = await userFlashcardSetService.getFlashcardSetsPaginated(
      user_id,
      search,
      page,
      limit,
      visibility,
      created_by_type,
      sortBy,
      sortOrder,
    );

    if (!result.success) {
      console.log(
        "[CONTROLLER] getFlashcardSetsPaginated - Error:",
        result.message,
      );
      return res.status(400).json(result);
    }

    console.log(
      "[CONTROLLER] getFlashcardSetsPaginated - Success: Found",
      result.data?.totalItems,
      "sets",
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getFlashcardSetsPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy flashcard sets của user hiện tại
const getMyFlashcardSets = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy, sortOrder } = req.query;

    const user_id = req.user.user_id; // Required - từ verifyToken

    console.log("[CONTROLLER] getMyFlashcardSets - Request:", {
      user_id,
      filters: { search, page, limit, sortBy, sortOrder },
    });

    const result = await userFlashcardSetService.getMyFlashcardSets(
      user_id,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    );

    if (!result.success) {
      console.log("[CONTROLLER] getMyFlashcardSets - Error:", result.message);
      return res.status(400).json(result);
    }

    console.log(
      "[CONTROLLER] getMyFlashcardSets - Success: Found",
      result.data?.totalItems,
      "sets",
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getMyFlashcardSets:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy flashcard set theo ID
const getFlashcardSetById = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user?.user_id; // Optional

    console.log("[CONTROLLER] getFlashcardSetById - Request:", {
      flashcard_set_id,
      user_id,
      isAuthenticated: !!req.user,
    });

    const result = await userFlashcardSetService.getFlashcardSetById(
      flashcard_set_id,
      user_id,
    );

    if (!result.success) {
      console.log("[CONTROLLER] getFlashcardSetById - Error:", result.message);
      return res.status(404).json(result);
    }

    console.log("[CONTROLLER] getFlashcardSetById - Success");
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getFlashcardSetById:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Tạo flashcard set mới (auth required)
const createFlashcardSet = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardSetService.createFlashcardSet(
      user_id,
      req.body,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createFlashcardSet controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Cập nhật flashcard set (auth required, owner only)
const updateFlashcardSet = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardSetService.updateFlashcardSet(
      flashcard_set_id,
      user_id,
      req.body,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateFlashcardSet controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Xóa flashcard set (auth required, owner only)
const deleteFlashcardSet = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardSetService.deleteFlashcardSet(
      flashcard_set_id,
      user_id,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteFlashcardSet controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ==================== FLASHCARD CONTROLLERS ====================

// Lấy tất cả flashcards trong một set
const getFlashcardsBySetId = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const { page = 1, limit = 20, difficulty_level } = req.query;

    const user_id = req.user?.user_id; // Optional

    const result = await userFlashcardService.getFlashcardsBySetId(
      flashcard_set_id,
      user_id,
      page,
      limit,
      difficulty_level,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getFlashcardsBySetId controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy flashcard theo ID
const getFlashcardById = async (req, res) => {
  try {
    const { flashcard_id } = req.params;
    const user_id = req.user?.user_id; // Optional

    const result = await userFlashcardService.getFlashcardById(
      flashcard_id,
      user_id,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getFlashcardById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Tạo flashcard mới (auth required, owner only)
const createFlashcard = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardService.createFlashcard(
      flashcard_set_id,
      user_id,
      req.body,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createFlashcard controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Tạo nhiều flashcards cùng lúc (auth required, owner only)
const createMultipleFlashcards = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id; // Required
    const { flashcards } = req.body;

    const result = await userFlashcardService.createMultipleFlashcards(
      flashcard_set_id,
      user_id,
      flashcards,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createMultipleFlashcards controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Cập nhật flashcard (auth required, owner only)
const updateFlashcard = async (req, res) => {
  try {
    const { flashcard_id } = req.params;
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardService.updateFlashcard(
      flashcard_id,
      user_id,
      req.body,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateFlashcard controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Xóa flashcard (auth required, owner only)
const deleteFlashcard = async (req, res) => {
  try {
    const { flashcard_id } = req.params;
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardService.deleteFlashcard(
      flashcard_id,
      user_id,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteFlashcard controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Xóa nhiều flashcards (auth required, owner only)
const deleteMultipleFlashcards = async (req, res) => {
  try {
    const { flashcard_ids } = req.body;
    const user_id = req.user.user_id; // Required

    const result = await userFlashcardService.deleteMultipleFlashcards(
      flashcard_ids,
      user_id,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteMultipleFlashcards controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export {
  // Flashcard Set Controllers
  getFlashcardSetsPaginated,
  getMyFlashcardSets,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  // Flashcard Controllers
  getFlashcardsBySetId,
  getFlashcardById,
  createFlashcard,
  createMultipleFlashcards,
  updateFlashcard,
  deleteFlashcard,
  deleteMultipleFlashcards,
};

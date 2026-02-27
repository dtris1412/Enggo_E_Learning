import flashcardSetService from "../services/flashcard_setService.js";

// Lấy danh sách flashcard sets có phân trang
const getFlashcardSetsPaginated = async (req, res) => {
  try {
    const { page, limit, search, visibility, created_by_type, sortBy, order } =
      req.query;

    const result = await flashcardSetService.getFlashcardSetsPaginated({
      page,
      limit,
      search,
      visibility,
      created_by_type,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Flashcard sets retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get flashcard sets error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get flashcard sets",
      error: error.message,
    });
  }
};

// Lấy flashcard set theo ID
const getFlashcardSetById = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;

    const flashcardSet =
      await flashcardSetService.getFlashcardSetById(flashcard_set_id);

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: "Flashcard set not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Flashcard set retrieved successfully",
      data: flashcardSet,
    });
  } catch (error) {
    console.error("Get flashcard set error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get flashcard set",
      error: error.message,
    });
  }
};

// Tạo flashcard set mới
const createFlashcardSet = async (req, res) => {
  try {
    const {
      user_id: targetUserId, // Admin có thể chỉ định user_id khác
      user_exam_id,
      exam_id,
      source_type,
      source_id,
      title,
      description,
      visibility,
    } = req.body;

    const currentUserId = req.user.user_id; // User đang đăng nhập (từ authMiddleware)
    const currentUserRole = req.user.role; // Role của user hiện tại

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Validate source_type (chỉ cho phép manual và exam)
    const validSourceTypes = ["manual", "exam"];
    if (source_type && !validSourceTypes.includes(source_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid source_type. Must be: manual or exam",
      });
    }

    // Nếu source_type = exam, cần có exam_id hoặc source_id
    if (source_type === "exam" && !exam_id && !source_id) {
      return res.status(400).json({
        success: false,
        message: "exam_id is required when source_type is exam",
      });
    }

    // Xác định user_id cho flashcard set
    let finalUserId;
    if (currentUserRole === 1) {
      // Admin có thể tạo cho user khác hoặc chính mình
      finalUserId = targetUserId || currentUserId;
    } else {
      // User thường chỉ tạo cho chính mình
      finalUserId = currentUserId;
    }

    // Tự động xác định created_by_type
    // Nếu source_type = "exam" → AI generated
    // Ngược lại → dựa vào role (admin hoặc user)
    let created_by_type;
    if (source_type === "exam") {
      created_by_type = "AI";
    } else {
      created_by_type = currentUserRole === 1 ? "admin" : "user";
    }

    // Validate visibility
    const validVisibility = ["private", "public", "shared"];
    if (visibility && !validVisibility.includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visibility. Must be: private, public, or shared",
      });
    }

    const flashcardSet = await flashcardSetService.createFlashcardSet({
      user_id: finalUserId,
      user_exam_id,
      exam_id: exam_id || source_id, // Hỗ trợ cả exam_id và source_id
      source_type: source_type || "manual",
      title,
      description,
      visibility: visibility || "private",
      created_by_type,
    });

    return res.status(201).json({
      success: true,
      message: "Flashcard set created successfully",
      data: flashcardSet,
    });
  } catch (error) {
    console.error("Create flashcard set error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create flashcard set",
      error: error.message,
    });
  }
};

// Cập nhật flashcard set
const updateFlashcardSet = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const {
      user_exam_id,
      exam_id,
      source_type,
      title,
      description,
      visibility,
      created_by_type,
    } = req.body;

    const updateData = {};

    if (user_exam_id !== undefined) updateData.user_exam_id = user_exam_id;
    if (exam_id !== undefined) updateData.exam_id = exam_id;
    if (source_type !== undefined) updateData.source_type = source_type;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (visibility) {
      const validVisibility = ["private", "public", "shared"];
      if (!validVisibility.includes(visibility)) {
        return res.status(400).json({
          success: false,
          message: "Invalid visibility. Must be: private, public, or shared",
        });
      }
      updateData.visibility = visibility;
    }

    if (created_by_type) {
      const validCreatedByTypes = ["admin", "user", "AI"];
      if (!validCreatedByTypes.includes(created_by_type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid created_by_type. Must be: admin, user, or AI",
        });
      }
      updateData.created_by_type = created_by_type;
    }

    const flashcardSet = await flashcardSetService.updateFlashcardSet(
      flashcard_set_id,
      updateData,
    );

    return res.status(200).json({
      success: true,
      message: "Flashcard set updated successfully",
      data: flashcardSet,
    });
  } catch (error) {
    console.error("Update flashcard set error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update flashcard set",
      error: error.message,
    });
  }
};

// Xóa flashcard set
const deleteFlashcardSet = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;

    await flashcardSetService.deleteFlashcardSet(flashcard_set_id);

    return res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (error) {
    console.error("Delete flashcard set error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete flashcard set",
      error: error.message,
    });
  }
};

export {
  getFlashcardSetsPaginated,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
};

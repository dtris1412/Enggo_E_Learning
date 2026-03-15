import userFlashcardProgressService from "../services/userFlashcardProgressService.js";

// Bắt đầu học một flashcard set
const startFlashcardSet = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] startFlashcardSet - Request:", {
      user_id,
      flashcard_set_id,
    });

    if (!flashcard_set_id || isNaN(Number(flashcard_set_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid flashcard set ID.",
      });
    }

    const result = await userFlashcardProgressService.startFlashcardSet(
      Number(flashcard_set_id),
      user_id,
    );

    if (!result.success) {
      console.log("[CONTROLLER] startFlashcardSet - Error:", result.message);
      return res.status(400).json(result);
    }

    console.log("[CONTROLLER] startFlashcardSet - Success");
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in startFlashcardSet:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Review một flashcard
const reviewFlashcard = async (req, res) => {
  try {
    const { flashcard_id } = req.params;
    const { quality } = req.body;
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] reviewFlashcard - Request:", {
      user_id,
      flashcard_id,
      quality,
    });

    if (!flashcard_id || isNaN(Number(flashcard_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid flashcard ID.",
      });
    }

    if (!quality) {
      return res.status(400).json({
        success: false,
        message: "Quality rating is required (again, hard, good, easy).",
      });
    }

    const result = await userFlashcardProgressService.reviewFlashcard(
      Number(flashcard_id),
      user_id,
      quality,
    );

    if (!result.success) {
      console.log("[CONTROLLER] reviewFlashcard - Error:", result.message);
      return res.status(400).json(result);
    }

    console.log("[CONTROLLER] reviewFlashcard - Success");
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in reviewFlashcard:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy progress của một set
const getFlashcardSetProgress = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] getFlashcardSetProgress - Request:", {
      user_id,
      flashcard_set_id,
    });

    if (!flashcard_set_id || isNaN(Number(flashcard_set_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid flashcard set ID.",
      });
    }

    const result = await userFlashcardProgressService.getFlashcardSetProgress(
      Number(flashcard_set_id),
      user_id,
    );

    if (!result.success) {
      console.log(
        "[CONTROLLER] getFlashcardSetProgress - Error:",
        result.message,
      );
      return res.status(400).json(result);
    }

    console.log("[CONTROLLER] getFlashcardSetProgress - Success");
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getFlashcardSetProgress:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy card tiếp theo cần học
const getNextCard = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] getNextCard - Request:", {
      user_id,
      flashcard_set_id,
    });

    if (!flashcard_set_id || isNaN(Number(flashcard_set_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid flashcard set ID.",
      });
    }

    const result = await userFlashcardProgressService.getNextCard(
      Number(flashcard_set_id),
      user_id,
    );

    if (!result.success) {
      console.log("[CONTROLLER] getNextCard - Error:", result.message);
      return res.status(400).json(result);
    }

    console.log("[CONTROLLER] getNextCard - Success");
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getNextCard:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy review queue hôm nay
const getDailyReviewQueue = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] getDailyReviewQueue - Request:", { user_id });

    const result =
      await userFlashcardProgressService.getDailyReviewQueue(user_id);

    if (!result.success) {
      console.log("[CONTROLLER] getDailyReviewQueue - Error:", result.message);
      return res.status(400).json(result);
    }

    console.log(
      "[CONTROLLER] getDailyReviewQueue - Success:",
      result.data.totalDue,
      "cards due",
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getDailyReviewQueue:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Lấy danh sách sets đang học
const getActiveSets = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] getActiveSets - Request:", { user_id });

    const result = await userFlashcardProgressService.getActiveSets(user_id);

    if (!result.success) {
      console.log("[CONTROLLER] getActiveSets - Error:", result.message);
      return res.status(400).json(result);
    }

    console.log(
      "[CONTROLLER] getActiveSets - Success:",
      result.active_sets?.length || 0,
      "sets",
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getActiveSets:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get due notifications for user
const getDueNotifications = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result =
      await userFlashcardProgressService.getDueNotifications(user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    console.log(
      "[CONTROLLER] getDueNotifications - Success:",
      result.total_due_cards,
      "cards due,",
      result.total_sets_with_due,
      "sets",
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in getDueNotifications:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Reset toàn bộ progress của một flashcard set
const resetFlashcardSetProgress = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] resetFlashcardSetProgress - Request:", {
      user_id,
      flashcard_set_id,
    });

    if (!flashcard_set_id || isNaN(Number(flashcard_set_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid flashcard set ID.",
      });
    }

    const result = await userFlashcardProgressService.resetFlashcardSetProgress(
      Number(flashcard_set_id),
      user_id,
    );

    if (!result.success) {
      console.log(
        "[CONTROLLER] resetFlashcardSetProgress - Error:",
        result.message,
      );
      return res.status(400).json(result);
    }

    console.log("[CONTROLLER] resetFlashcardSetProgress - Success");
    res.status(200).json(result);
  } catch (err) {
    console.error("[CONTROLLER] Error in resetFlashcardSetProgress:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export {
  startFlashcardSet,
  reviewFlashcard,
  getFlashcardSetProgress,
  getNextCard,
  getDailyReviewQueue,
  getActiveSets,
  getDueNotifications,
  resetFlashcardSetProgress,
};

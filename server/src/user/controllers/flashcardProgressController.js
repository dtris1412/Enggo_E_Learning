import userFlashcardProgressService from "../services/userFlashcardProgressService.js";
import db from "../../models/index.js";
import { sendFlashcardReminderEmail } from "../../shared/services/emailService.js";

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

// Send immediate flashcard reminder email for a specific set
const sendFlashcardReminderNow = async (req, res) => {
  try {
    const { flashcard_set_id } = req.params;
    const user_id = req.user.user_id;

    console.log("[CONTROLLER] sendFlashcardReminderNow - Request:", {
      user_id,
      flashcard_set_id,
    });

    if (!flashcard_set_id || isNaN(Number(flashcard_set_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid flashcard set ID.",
      });
    }

    // Get user info
    const user = await db.User.findByPk(user_id, {
      attributes: ["user_id", "user_email", "full_name", "user_name"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get flashcard set info
    const flashcardSet = await db.Flashcard_Set.findOne({
      where: {
        flashcard_set_id,
        [db.Sequelize.Op.or]: [{ visibility: "public" }, { user_id }],
      },
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message:
          "Flashcard set not found or you don't have permission to access it.",
      });
    }

    // Get all flashcard IDs in this set
    const flashcardsInSet = await db.Flashcard.findAll({
      where: { flashcard_set_id },
      attributes: ["flashcard_id"],
      raw: true,
    });
    const flashcardIds = flashcardsInSet.map((f) => f.flashcard_id);

    if (flashcardIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This flashcard set has no cards.",
      });
    }

    // Count due cards in this set
    const now = new Date();
    const dueCards = await db.User_Flashcard_Progress.count({
      where: {
        user_id,
        flashcard_id: { [db.Sequelize.Op.in]: flashcardIds },
        next_review_at: { [db.Sequelize.Op.lte]: now },
      },
    });

    if (dueCards === 0) {
      return res.status(400).json({
        success: false,
        message: "You have no cards due for review in this set.",
      });
    }

    // Get learning and mastered stats for this set
    const learningCards = await db.User_Flashcard_Progress.count({
      where: {
        user_id,
        flashcard_id: { [db.Sequelize.Op.in]: flashcardIds },
        repetition_count: {
          [db.Sequelize.Op.gt]: 0,
          [db.Sequelize.Op.lt]: 3,
        },
      },
    });

    const masteredCards = await db.User_Flashcard_Progress.count({
      where: {
        user_id,
        flashcard_id: { [db.Sequelize.Op.in]: flashcardIds },
        repetition_count: { [db.Sequelize.Op.gte]: 3 },
      },
    });

    // Send email
    try {
      await sendFlashcardReminderEmail({
        user_email: user.user_email,
        full_name: user.full_name || user.user_name,
        set_name: flashcardSet.name,
        set_id: flashcardSet.flashcard_set_id,
        due_count: dueCards,
        learning_count: learningCards,
        mastered_count: masteredCards,
      });

      console.log(
        "[CONTROLLER] sendFlashcardReminderNow - Email sent successfully",
      );
      return res.status(200).json({
        success: true,
        message: `Reminder email sent! You have ${dueCards} cards due for review in "${flashcardSet.name}".`,
        data: {
          due_count: dueCards,
          learning_count: learningCards,
          mastered_count: masteredCards,
        },
      });
    } catch (emailError) {
      console.error(
        "[CONTROLLER] sendFlashcardReminderNow - Email failed:",
        emailError,
      );
      return res.status(500).json({
        success: false,
        message: "Failed to send reminder email. Please try again.",
        error: emailError.message,
      });
    }
  } catch (err) {
    console.error("[CONTROLLER] Error in sendFlashcardReminderNow:", err);
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
  sendFlashcardReminderNow,
};

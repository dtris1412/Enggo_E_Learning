import db from "../../models/index.js";
import { Op } from "sequelize";

// SM-2 Algorithm Implementation
// Quality ratings: again(0), hard(3), good(4), easy(5)
const calculateNextReview = (
  repetitionCount,
  easeFactor,
  intervalDays,
  quality,
) => {
  let newRepetition = repetitionCount;
  let newEaseFactor = easeFactor;
  let newInterval = intervalDays;

  // Calculate new ease factor
  newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  // Calculate new interval based on quality
  if (quality < 3) {
    // Again - reset and review after 10 minutes
    newRepetition = 0;
    newInterval = 10 / (24 * 60); // 10 minutes converted to days (0.00694 days)
  } else {
    newRepetition = repetitionCount + 1;

    if (newRepetition === 1) {
      // First review
      if (quality === 3) {
        // Hard - review after 6 hours for first time
        newInterval = 6 / 24; // 6 hours = 0.25 days
      } else if (quality === 4) {
        // Good - review after 1 day
        newInterval = 1;
      } else {
        // Easy - review after 4 days
        newInterval = 4;
      }
    } else if (newRepetition === 2) {
      newInterval = 6; // 6 days
    } else {
      newInterval = Math.round(intervalDays * newEaseFactor);
    }

    // Adjust interval based on quality (for repetition > 2)
    if (quality === 3 && newRepetition > 2) {
      // Hard - reduce interval slightly
      newInterval = Math.max(1, Math.round(newInterval * 0.85));
    } else if (quality === 5 && newRepetition > 2) {
      // Easy - increase interval
      newInterval = Math.round(newInterval * 1.3);
    }
  }

  return {
    repetitionCount: newRepetition,
    easeFactor: newEaseFactor,
    intervalDays: newInterval,
  };
};

// Bắt đầu học một flashcard set
const startFlashcardSet = async (flashcard_set_id, user_id) => {
  try {
    // Kiểm tra set có tồn tại và user có quyền truy cập không
    const flashcardSet = await db.Flashcard_Set.findOne({
      where: {
        flashcard_set_id,
        [Op.or]: [{ visibility: "public" }, { user_id }],
      },
    });

    if (!flashcardSet) {
      return {
        success: false,
        message: "Flashcard set not found or access denied.",
      };
    }

    // Kiểm tra xem user đã bắt đầu set này chưa
    let userFlashcardSet = await db.User_Flashcard_Set.findOne({
      where: { user_id, flashcard_set_id },
    });

    if (userFlashcardSet) {
      // Đã tồn tại - update status nếu cần
      if (userFlashcardSet.status === "archived") {
        await userFlashcardSet.update({ status: "active" });
      }
      return {
        success: true,
        message: "Flashcard set already started.",
        data: userFlashcardSet,
      };
    }

    // Tạo mới user_flashcard_set
    userFlashcardSet = await db.User_Flashcard_Set.create({
      user_id,
      flashcard_set_id,
      started_at: new Date(),
      progress_percent: 0,
      status: "active",
    });

    return {
      success: true,
      message: "Started learning flashcard set successfully.",
      data: userFlashcardSet,
    };
  } catch (error) {
    console.error("[startFlashcardSet] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Review một flashcard
const reviewFlashcard = async (flashcard_id, user_id, quality) => {
  try {
    // Validate quality (again/hard/good/easy)
    const qualityMap = {
      again: 0,
      hard: 3,
      good: 4,
      easy: 5,
    };

    const qualityScore = qualityMap[quality];
    if (qualityScore === undefined) {
      return {
        success: false,
        message: "Invalid quality. Must be: again, hard, good, or easy.",
      };
    }

    // Kiểm tra flashcard có tồn tại không
    const flashcard = await db.Flashcard.findOne({
      where: { flashcard_id },
      include: [
        {
          model: db.Flashcard_Set,
          attributes: ["flashcard_set_id", "user_id", "visibility"],
        },
      ],
    });

    if (!flashcard) {
      return { success: false, message: "Flashcard not found." };
    }

    // Kiểm tra quyền truy cập
    const flashcardSet = flashcard.Flashcard_Set;
    if (
      flashcardSet.visibility !== "public" &&
      flashcardSet.user_id !== user_id
    ) {
      return { success: false, message: "Access denied." };
    }

    // Đảm bảo user đã bắt đầu học set này
    let userFlashcardSet = await db.User_Flashcard_Set.findOne({
      where: {
        user_id,
        flashcard_set_id: flashcardSet.flashcard_set_id,
      },
    });

    if (!userFlashcardSet) {
      // Tự động tạo nếu chưa có
      userFlashcardSet = await db.User_Flashcard_Set.create({
        user_id,
        flashcard_set_id: flashcardSet.flashcard_set_id,
        started_at: new Date(),
        progress_percent: 0,
        status: "active",
      });
    }

    // Lấy progress hiện tại của card
    let progress = await db.User_Flashcard_Progress.findOne({
      where: { user_id, flashcard_id },
    });

    let repetitionCount = 0;
    let easeFactor = 2.5;
    let intervalDays = 0;

    if (progress) {
      repetitionCount = progress.repetition_count;
      easeFactor = progress.ease_factor;
      intervalDays = progress.interval_days;
    }

    // Tính toán SM-2
    const sm2Result = calculateNextReview(
      repetitionCount,
      easeFactor,
      intervalDays,
      qualityScore,
    );

    const now = new Date();
    const nextReviewAt = new Date(
      now.getTime() + sm2Result.intervalDays * 24 * 60 * 60 * 1000,
    );

    if (progress) {
      // Update existing progress
      await progress.update({
        repetition_count: sm2Result.repetitionCount,
        ease_factor: sm2Result.easeFactor,
        interval_days: sm2Result.intervalDays,
        next_review_at: nextReviewAt,
        last_reviewed_at: now,
        last_core: quality,
      });
    } else {
      // Create new progress
      progress = await db.User_Flashcard_Progress.create({
        user_id,
        flashcard_id,
        repetition_count: sm2Result.repetitionCount,
        ease_factor: sm2Result.easeFactor,
        interval_days: sm2Result.intervalDays,
        next_review_at: nextReviewAt,
        last_reviewed_at: now,
        last_core: quality,
      });
    }

    // Cập nhật progress_percent của set
    await updateSetProgress(user_id, flashcardSet.flashcard_set_id);

    return {
      success: true,
      message: "Flashcard reviewed successfully.",
      data: {
        progress,
        nextReview: {
          intervalDays: sm2Result.intervalDays,
          nextReviewAt,
        },
      },
    };
  } catch (error) {
    console.error("[reviewFlashcard] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Cập nhật progress_percent của set
const updateSetProgress = async (user_id, flashcard_set_id) => {
  try {
    // Đếm tổng số cards trong set
    const totalCards = await db.Flashcard.count({
      where: { flashcard_set_id },
    });

    if (totalCards === 0) return;

    // Đếm số cards đã từng review (có User_Flashcard_Progress record)
    // Không phụ thuộc vào repetition_count vì khi click "Chưa nhớ" sẽ reset về 0
    const allCardIds = await db.Flashcard.findAll({
      where: { flashcard_set_id },
      attributes: ["flashcard_id"],
      raw: true,
    }).then((cards) => cards.map((c) => c.flashcard_id));

    const reviewedCardsCount = await db.User_Flashcard_Progress.count({
      where: {
        user_id,
        flashcard_id: { [Op.in]: allCardIds },
      },
    });

    const progressPercent = (reviewedCardsCount / totalCards) * 100;

    // Cập nhật user_flashcard_set
    await db.User_Flashcard_Set.update(
      {
        progress_percent: progressPercent,
        status: progressPercent >= 100 ? "completed" : "active",
      },
      {
        where: { user_id, flashcard_set_id },
      },
    );
  } catch (error) {
    console.error("[updateSetProgress] Error:", error);
  }
};

// Lấy progress của một set
const getFlashcardSetProgress = async (flashcard_set_id, user_id) => {
  try {
    // Kiểm tra quyền truy cập
    const flashcardSet = await db.Flashcard_Set.findOne({
      where: {
        flashcard_set_id,
        [Op.or]: [{ visibility: "public" }, { user_id }],
      },
    });

    if (!flashcardSet) {
      return {
        success: false,
        message: "Flashcard set not found or access denied.",
      };
    }

    // Lấy user_flashcard_set
    const userFlashcardSet = await db.User_Flashcard_Set.findOne({
      where: { user_id, flashcard_set_id },
    });

    // Lấy tất cả flashcards trong set
    const flashcards = await db.Flashcard.findAll({
      where: { flashcard_set_id },
      attributes: ["flashcard_id", "front_content"],
    });

    // Lấy progress của từng card
    const progressData = await db.User_Flashcard_Progress.findAll({
      where: {
        user_id,
        flashcard_id: { [Op.in]: flashcards.map((f) => f.flashcard_id) },
      },
    });

    // Map progress với flashcards
    const progressMap = {};
    progressData.forEach((p) => {
      progressMap[p.flashcard_id] = p;
    });

    const cardsWithProgress = flashcards.map((card) => ({
      flashcard_id: card.flashcard_id,
      front_content: card.front_content,
      progress: progressMap[card.flashcard_id] || null,
    }));

    // Thống kê
    const stats = {
      total: flashcards.length,
      new: flashcards.length - progressData.length, // Cards chưa có progress record
      learning: progressData.filter(
        (p) => p.repetition_count > 0 && p.repetition_count < 3,
      ).length,
      mastered: progressData.filter((p) => p.repetition_count >= 3).length,
      reviewing: progressData.filter((p) => p.repetition_count === 0).length, // Cards đang ôn lại (clicked "Chưa nhớ")
      due_for_review: progressData.filter(
        (p) => p.next_review_at && new Date(p.next_review_at) <= new Date(),
      ).length,
    };

    // Tính progress_percent: dựa trên số cards đã từng review (có progress record)
    const progressPercent =
      flashcards.length > 0
        ? Math.round((progressData.length / flashcards.length) * 100)
        : 0;

    return {
      success: true,
      cards_stats: stats,
      cards: cardsWithProgress,
      userFlashcardSet,
      progress_percent: progressPercent,
    };
  } catch (error) {
    console.error("[getFlashcardSetProgress] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Lấy card tiếp theo cần học trong set
const getNextCard = async (flashcard_set_id, user_id) => {
  try {
    // Kiểm tra quyền truy cập
    const flashcardSet = await db.Flashcard_Set.findOne({
      where: {
        flashcard_set_id,
        [Op.or]: [{ visibility: "public" }, { user_id }],
      },
    });

    if (!flashcardSet) {
      return {
        success: false,
        message: "Flashcard set not found or access denied.",
      };
    }

    // Lưu ý: Ưu tiên cards đến hạn review > cards mới
    // Session học được coi là hoàn thành khi không còn due hoặc new cards
    // Cards sắp tới (chưa đến hạn) sẽ hiển thị trong session tương lai
    const now = new Date();

    // 1. Cards đến hạn review
    const dueCard = await db.Flashcard.findOne({
      where: { flashcard_set_id },
      include: [
        {
          model: db.User_Flashcard_Progress,
          where: {
            user_id,
            next_review_at: { [Op.lte]: now },
          },
          required: true,
        },
      ],
      order: [[db.User_Flashcard_Progress, "next_review_at", "ASC"]],
    });

    if (dueCard) {
      return {
        success: true,
        data: {
          flashcard: dueCard,
          reason: "due",
        },
      };
    }

    // 2. Cards chưa học (new)
    const allCardIds = await db.Flashcard.findAll({
      where: { flashcard_set_id },
      attributes: ["flashcard_id"],
      raw: true,
    }).then((cards) => cards.map((c) => c.flashcard_id));

    const learnedCardIds = await db.User_Flashcard_Progress.findAll({
      where: {
        user_id,
        flashcard_id: { [Op.in]: allCardIds },
      },
      attributes: ["flashcard_id"],
      raw: true,
    }).then((cards) => cards.map((c) => c.flashcard_id));

    const newCardIds = allCardIds.filter((id) => !learnedCardIds.includes(id));

    if (newCardIds.length > 0) {
      const newCard = await db.Flashcard.findOne({
        where: { flashcard_id: newCardIds[0] },
      });

      return {
        success: true,
        data: {
          flashcard: newCard,
          reason: "new",
        },
      };
    }

    // 3. Không còn card due hoặc new - session hoàn thành
    // Cards sắp tới (upcoming) sẽ được review trong session tương lai
    return {
      success: true,
      data: null,
      message: "No more cards to review. Set completed!",
    };
  } catch (error) {
    console.error("[getNextCard] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Lấy review queue hôm nay (tất cả sets)
const getDailyReviewQueue = async (user_id) => {
  try {
    const now = new Date();

    // Lấy tất cả cards đến hạn review
    const dueCards = await db.User_Flashcard_Progress.findAll({
      where: {
        user_id,
        next_review_at: { [Op.lte]: now },
      },
      include: [
        {
          model: db.Flashcard,
          include: [
            {
              model: db.Flashcard_Set,
              attributes: ["flashcard_set_id", "title"],
            },
          ],
        },
      ],
      order: [["next_review_at", "ASC"]],
    });

    // Group by set
    const cardsBySet = {};
    dueCards.forEach((progress) => {
      const setId = progress.Flashcard.Flashcard_Set.flashcard_set_id;
      const setTitle = progress.Flashcard.Flashcard_Set.title;

      if (!cardsBySet[setId]) {
        cardsBySet[setId] = {
          flashcard_set_id: setId,
          title: setTitle,
          cards: [],
        };
      }

      cardsBySet[setId].cards.push({
        flashcard_id: progress.flashcard_id,
        front_content: progress.Flashcard.front_content,
        next_review_at: progress.next_review_at,
      });
    });

    const sets = Object.values(cardsBySet);

    return {
      success: true,
      data: {
        totalDue: dueCards.length,
        sets,
      },
    };
  } catch (error) {
    console.error("[getDailyReviewQueue] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Lấy danh sách sets đang học
const getActiveSets = async (user_id) => {
  try {
    const activeSets = await db.User_Flashcard_Set.findAll({
      where: {
        user_id,
        status: { [Op.in]: ["active", "completed"] },
      },
      include: [
        {
          model: db.Flashcard_Set,
          attributes: [
            "flashcard_set_id",
            "title",
            "description",
            "total_cards",
          ],
        },
      ],
      order: [["started_at", "DESC"]],
    });

    // Transform data and deduplicate by flashcard_set_id
    const seenIds = new Set();
    const transformedSets = activeSets
      .map((userSet) => ({
        flashcard_set_id: userSet.Flashcard_Set.flashcard_set_id,
        set_name: userSet.Flashcard_Set.title,
        description: userSet.Flashcard_Set.description,
        total_cards: userSet.Flashcard_Set.total_cards,
        progress_percent: userSet.progress_percent,
        started_at: userSet.started_at,
        status: userSet.status,
      }))
      .filter((set) => {
        // Deduplicate: only keep first occurrence of each flashcard_set_id
        if (seenIds.has(set.flashcard_set_id)) {
          return false;
        }
        seenIds.add(set.flashcard_set_id);
        return true;
      });

    return {
      success: true,
      active_sets: transformedSets,
    };
  } catch (error) {
    console.error("[getActiveSets] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Lấy danh sách thông báo về cards đến hạn ôn tập
const getDueNotifications = async (user_id) => {
  try {
    const now = new Date();

    // Lấy tất cả cards đến hạn của user
    const dueCards = await db.User_Flashcard_Progress.findAll({
      where: {
        user_id,
        next_review_at: { [Op.lte]: now },
      },
      include: [
        {
          model: db.Flashcard,
          required: true,
          include: [
            {
              model: db.Flashcard_Set,
              required: true,
              attributes: ["flashcard_set_id", "title", "description"],
            },
          ],
        },
      ],
      order: [["next_review_at", "ASC"]], // Oldest due first
    });

    // Group cards by flashcard set
    const notificationsBySet = {};

    dueCards.forEach((progress) => {
      const flashcard = progress.Flashcard;
      const flashcardSet = flashcard.Flashcard_Set;
      const setId = flashcardSet.flashcard_set_id;

      if (!notificationsBySet[setId]) {
        notificationsBySet[setId] = {
          flashcard_set_id: setId,
          set_title: flashcardSet.title,
          set_description: flashcardSet.description,
          due_cards: [],
          total_due: 0,
        };
      }

      notificationsBySet[setId].due_cards.push({
        flashcard_id: flashcard.flashcard_id,
        front_content: flashcard.front_content,
        back_content: flashcard.back_content,
        next_review_at: progress.next_review_at,
        due_hours_ago: Math.floor(
          (now - new Date(progress.next_review_at)) / (1000 * 60 * 60),
        ),
      });

      notificationsBySet[setId].total_due++;
    });

    // Convert to array and sort by total_due descending
    const notifications = Object.values(notificationsBySet).sort(
      (a, b) => b.total_due - a.total_due,
    );

    // Calculate total stats
    const totalDue = dueCards.length;
    const totalSets = notifications.length;

    return {
      success: true,
      total_due_cards: totalDue,
      total_sets_with_due: totalSets,
      notifications,
    };
  } catch (error) {
    console.error("[getDueNotifications] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

// Reset toàn bộ progress của một flashcard set
const resetFlashcardSetProgress = async (flashcard_set_id, user_id) => {
  try {
    // Kiểm tra quyền truy cập
    const flashcardSet = await db.Flashcard_Set.findOne({
      where: {
        flashcard_set_id,
        [Op.or]: [{ visibility: "public" }, { user_id }],
      },
    });

    if (!flashcardSet) {
      return {
        success: false,
        message: "Flashcard set not found or access denied.",
      };
    }

    // Lấy tất cả flashcard IDs trong set
    const flashcardIds = await db.Flashcard.findAll({
      where: { flashcard_set_id },
      attributes: ["flashcard_id"],
      raw: true,
    }).then((cards) => cards.map((c) => c.flashcard_id));

    // Xóa toàn bộ progress records
    const deletedCount = await db.User_Flashcard_Progress.destroy({
      where: {
        user_id,
        flashcard_id: { [Op.in]: flashcardIds },
      },
    });

    // Xóa hoặc reset user_flashcard_set record
    await db.User_Flashcard_Set.destroy({
      where: {
        user_id,
        flashcard_set_id,
      },
    });

    return {
      success: true,
      deleted_progress_count: deletedCount,
      message: "Progress reset successfully.",
    };
  } catch (error) {
    console.error("[resetFlashcardSetProgress] Error:", error);
    return { success: false, message: "Internal server error." };
  }
};

export default {
  startFlashcardSet,
  reviewFlashcard,
  getFlashcardSetProgress,
  getNextCard,
  getDailyReviewQueue,
  getActiveSets,
  getDueNotifications,
  resetFlashcardSetProgress,
};

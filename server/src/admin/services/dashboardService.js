import db from "../../models/index.js";
import { Op } from "sequelize";

const {
  User,
  Course,
  User_Exam,
  User_Subscription,
  Subscription_Price,
  Subscription_Plan,
  Order,
  Exam,
  Flashcard_Set,
  Flashcard,
  Document,
  Blog,
} = db;

// Get total users count
export const getTotalUsers = async () => {
  try {
    const count = await User.count();
    return { success: true, count };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get active courses count
export const getActiveCourses = async () => {
  try {
    const count = await Course.count({
      where: { course_status: true },
    });
    return { success: true, count };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get test statistics (graded tests and completion rate)
export const getTestStatistics = async () => {
  try {
    const totalAttempts = await User_Exam.count();
    const completedTests = await User_Exam.count({
      where: { status: "graded" },
    });
    const completionRate =
      totalAttempts > 0
        ? Math.round((completedTests / totalAttempts) * 100)
        : 0;

    return {
      success: true,
      data: {
        totalAttempts,
        completedTests,
        completionRate,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get recent subscriptions (last 10)
export const getRecentSubscriptions = async (limit = 10) => {
  try {
    const subscriptions = await User_Subscription.findAll({
      limit,
      order: [["started_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name", "user_email"],
        },
        {
          model: Subscription_Price,
          attributes: ["subscription_price_id", "price", "billing_type"],
          include: [
            {
              model: Subscription_Plan,
              attributes: ["subscription_plan_id", "name", "code"],
            },
          ],
        },
        {
          model: Order,
          attributes: ["order_id", "amount"],
        },
      ],
    });

    return { success: true, data: subscriptions };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get all dashboard statistics
export const getDashboardStatistics = async () => {
  try {
    const [
      totalUsersResult,
      activeCoursesResult,
      testStatsResult,
      recentSubsResult,
      recentExamsResult,
      recentFlashcardsResult,
      topDocumentsResult,
      topBlogsResult,
    ] = await Promise.all([
      getTotalUsers(),
      getActiveCourses(),
      getTestStatistics(),
      getRecentSubscriptions(6),
      getRecentCompletedExams(5),
      getRecentFlashcards(5),
      getTopDocuments(5),
      getTopBlogs(5),
    ]);

    if (!totalUsersResult.success) {
      throw new Error(`Failed to get total users: ${totalUsersResult.message}`);
    }
    if (!activeCoursesResult.success) {
      throw new Error(
        `Failed to get active courses: ${activeCoursesResult.message}`,
      );
    }
    if (!testStatsResult.success) {
      throw new Error(
        `Failed to get test statistics: ${testStatsResult.message}`,
      );
    }
    if (!recentSubsResult.success) {
      throw new Error(
        `Failed to get recent subscriptions: ${recentSubsResult.message}`,
      );
    }

    return {
      success: true,
      data: {
        totalUsers: totalUsersResult.count,
        activeCourses: activeCoursesResult.count,
        testStatistics: testStatsResult.data,
        recentSubscriptions: recentSubsResult.data,
        recentCompletedExams: recentExamsResult.success
          ? recentExamsResult.data
          : [],
        recentFlashcards: recentFlashcardsResult.success
          ? recentFlashcardsResult.data
          : [],
        topDocuments: topDocumentsResult.success ? topDocumentsResult.data : [],
        topBlogs: topBlogsResult.success ? topBlogsResult.data : [],
      },
    };
  } catch (error) {
    console.error("Error in getDashboardStatistics:", error);
    return { success: false, message: error.message };
  }
};

// Get recent completed exams
export const getRecentCompletedExams = async (limit = 5) => {
  try {
    const exams = await User_Exam.findAll({
      where: { status: "graded" },
      limit,
      order: [["submitted_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name"],
        },
        {
          model: Exam,
          attributes: ["exam_id", "exam_name"],
        },
      ],
      attributes: [
        "user_exam_id",
        "submitted_at",
        "total_score",
        "status",
        "started_at",
      ],
    });

    return { success: true, data: exams };
  } catch (error) {
    console.error("Error in getRecentCompletedExams:", error);
    return { success: false, message: error.message };
  }
};

// Get recent flashcards
export const getRecentFlashcards = async (limit = 5) => {
  try {
    const flashcards = await Flashcard_Set.findAll({
      limit,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name"],
        },
      ],
      attributes: [
        "flashcard_set_id",
        "title",
        "total_cards",
        "created_at",
        "description",
      ],
    });

    return { success: true, data: flashcards };
  } catch (error) {
    console.error("Error in getRecentFlashcards:", error);
    return { success: false, message: error.message };
  }
};

// Get top documents (by created_at as proxy for popularity)
export const getTopDocuments = async (limit = 5) => {
  try {
    const documents = await Document.findAll({
      limit,
      order: [["created_at", "DESC"]],
      attributes: [
        "document_id",
        "document_name",
        "document_type",
        "document_size",
        "file_type",
        "created_at",
      ],
    });

    // Add mock download count (sẽ cần thêm field thật sau)
    const documentsWithDownloads = documents.map((doc, index) => ({
      ...doc.toJSON(),
      download_count: Math.floor(Math.random() * 1000) + 500,
    }));

    return { success: true, data: documentsWithDownloads };
  } catch (error) {
    console.error("Error in getTopDocuments:", error);
    return { success: false, message: error.message };
  }
};

// Get top blogs by interaction count (views + likes + comments)
export const getTopBlogs = async (limit = 5) => {
  try {
    const blogs = await Blog.findAll({
      where: { blog_status: "published" },
      limit,
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name"],
        },
      ],
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM blog_likes
              WHERE blog_likes.blog_id = Blog.blog_id
            )`),
            "likes_count",
          ],
          [
            db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM blog_comments
              WHERE blog_comments.blog_id = Blog.blog_id
            )`),
            "comments_count",
          ],
          [
            db.sequelize.literal(`(
              views_count + 
              (SELECT COUNT(*) FROM blog_likes WHERE blog_likes.blog_id = Blog.blog_id) +
              (SELECT COUNT(*) FROM blog_comments WHERE blog_comments.blog_id = Blog.blog_id)
            )`),
            "interaction_count",
          ],
        ],
      },
      order: [[db.sequelize.literal("interaction_count"), "DESC"]],
      subQuery: false,
    });

    return { success: true, data: blogs };
  } catch (error) {
    console.error("Error in getTopBlogs:", error);
    return { success: false, message: error.message };
  }
};

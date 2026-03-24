import { askOpenAI, generateFlashcardSet } from "../services/aiService.js";
import db from "../../models/index.js";
import {
  deductTokenUsage,
  getSystemQuota,
} from "../../admin/services/systemAIQuotaService.js";

const {
  AI_Interaction,
  User_Exam,
  Container_Question,
  Flashcard_Set,
  Flashcard,
  User_Token_Wallet,
  User_Token_Transaction,
} = db;

/**
 * Helper: Xử lý trừ token cho user và system sau khi gọi AI
 * @param {number} userId - ID user (nullable)
 * @param {number} totalTokens - Tổng token OpenAI đã dùng
 * @returns {Promise<Object>} Token info
 */
const processTokenDeduction = async (userId, totalTokens) => {
  try {
    // Lấy quota hệ thống để biết ai_token_unit
    const quota = await getSystemQuota();
    const aiTokenUnit = quota.ai_token_unit;

    // Tính số AI token cần trừ
    const aiTokensUsed = Math.ceil(totalTokens / aiTokenUnit);

    // Nếu có user_id, trừ token user
    if (userId) {
      const wallet = await User_Token_Wallet.findOne({
        where: { user_id: userId },
      });

      if (wallet) {
        // Kiểm tra đủ token không
        if (wallet.token_balance < aiTokensUsed) {
          throw new Error(
            `Insufficient AI tokens. Required: ${aiTokensUsed}, Available: ${wallet.token_balance}`,
          );
        }

        // Trừ token user
        await wallet.update({
          token_balance: wallet.token_balance - aiTokensUsed,
          updated_at: new Date(),
        });

        // Ghi log transaction
        await User_Token_Transaction.create({
          user_id: userId,
          amount: -aiTokensUsed,
          transaction_type: "usage",
          reference_id: null,
          created_at: new Date(),
        });
      }
    }

    // Trừ token hệ thống
    await deductTokenUsage(totalTokens, aiTokensUsed);

    return {
      openai_tokens_used: totalTokens,
      ai_tokens_used: aiTokensUsed,
      ai_token_unit: aiTokenUnit,
    };
  } catch (error) {
    console.error("Token deduction error:", error);
    throw error;
  }
};

export const contextAssist = async (req, res) => {
  try {
    const { message, type, exam_id, question_id, user_history } = req.body;
    const user_id = req.user?.user_id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Xây dựng context từ dữ liệu
    let context = "";
    if (exam_id) {
      const exam = await User_Exam.findOne({
        where: { user_exam_id: exam_id, user_id },
        include: [{ model: db.Exam_Container }],
      });
      if (exam) {
        context += `Exam context: ${JSON.stringify(exam.dataValues)}\n`;
      }
    }

    if (question_id) {
      const question = await Container_Question.findByPk(question_id);
      if (question) {
        context += `Question context: ${question.question_text}\n`;
      }
    }

    if (user_history) {
      context += `User history: ${JSON.stringify(user_history)}\n`;
    }

    // Gọi AI với context
    const aiResponse = await askOpenAI({
      message: `${context}\n\nUser question: ${message}`,
      type: type || "chat",
    });

    // Xử lý trừ token
    let tokenInfo;
    try {
      tokenInfo = await processTokenDeduction(
        user_id,
        aiResponse.usage.total_tokens,
      );
    } catch (tokenError) {
      console.error("Token deduction error:", tokenError);
      return res.status(402).json({
        error: "Token quota exceeded",
        detail: tokenError.message,
      });
    }

    // Lưu interaction vào DB
    if (user_id && exam_id && question_id) {
      await AI_Interaction.create({
        user_id,
        user_exam_id: exam_id,
        container_question_id: question_id,
        promt: message,
        response: aiResponse.content,
        model_name: "gpt-4o-mini",
        token_usage: aiResponse.usage.total_tokens,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    res.json({
      reply: aiResponse.content,
      context_provided: !!context,
      token_info: tokenInfo,
    });
  } catch (error) {
    console.error("Context assist error:", error);
    res.status(500).json({ error: "AI service error", detail: error.message });
  }
};

/**
 * 2️⃣ Global AI Chat - Chat thông thường, có thể inject context
 * POST /api/user/ai/chat
 * Body: { message, context }
 */
export const globalChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    const user_id = req.user?.user_id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Inject context nếu có
    const fullMessage = context
      ? `Context: ${JSON.stringify(context)}\n\nUser: ${message}`
      : message;

    const aiResponse = await askOpenAI({
      message: fullMessage,
      type: "chat",
    });

    // Xử lý trừ token
    let tokenInfo;
    try {
      tokenInfo = await processTokenDeduction(
        user_id,
        aiResponse.usage.total_tokens,
      );
    } catch (tokenError) {
      console.error("Token deduction error:", tokenError);
      return res.status(402).json({
        error: "Token quota exceeded",
        detail: tokenError.message,
      });
    }

    res.json({ reply: aiResponse.content, token_info: tokenInfo });
  } catch (error) {
    console.error("Global chat error:", error);
    res.status(500).json({ error: "AI service error", detail: error.message });
  }
};

/**
 * 3️⃣ AI Analyzer - Phân tích dữ liệu người dùng, không chat
 * POST /api/user/ai/analyze
 * Body: { analysis_type, data }
 * Types: 'exam_performance', 'learning_path', 'weaknesses', 'practice_set'
 */
export const analyzeData = async (req, res) => {
  try {
    const { analysis_type, data } = req.body;
    const user_id = req.user?.user_id;

    if (!analysis_type || !data) {
      return res
        .status(400)
        .json({ error: "analysis_type and data are required" });
    }

    let prompt = "";
    let type = "chat";

    switch (analysis_type) {
      case "exam_performance":
        prompt = `Phân tích kết quả thi của học viên dựa trên dữ liệu sau và đưa ra nhận xét, điểm mạnh/yếu:\n${JSON.stringify(data)}`;
        break;

      case "learning_path":
        prompt = `Dựa trên lịch sử học tập sau, đề xuất lộ trình học phù hợp:\n${JSON.stringify(data)}`;
        break;

      case "weaknesses":
        prompt = `Phát hiện điểm yếu của học viên từ dữ liệu sau:\n${JSON.stringify(data)}`;
        break;

      case "practice_set":
        prompt = `Dựa trên dữ liệu học tập sau, tạo danh sách câu hỏi luyện tập phù hợp:\n${JSON.stringify(data)}`;
        type = "grading";
        break;

      default:
        return res.status(400).json({ error: "Invalid analysis_type" });
    }

    const aiResponse = await askOpenAI({ message: prompt, type });

    // Xử lý trừ token
    let tokenInfo;
    try {
      tokenInfo = await processTokenDeduction(
        user_id,
        aiResponse.usage.total_tokens,
      );
    } catch (tokenError) {
      console.error("Token deduction error:", tokenError);
      return res.status(402).json({
        error: "Token quota exceeded",
        detail: tokenError.message,
      });
    }

    res.json({
      analysis_type,
      analysis: aiResponse.content,
      token_info: tokenInfo,
    });
  } catch (error) {
    console.error("Analyze data error:", error);
    res.status(500).json({ error: "AI service error", detail: error.message });
  }
};

/**
 * 🔧 Helper: Tạo flashcard từ nội dung
 * POST /api/user/ai/generate-flashcard
 * Body: { content, topic }
 */
export const generateFlashcard = async (req, res) => {
  try {
    const { content, topic } = req.body;
    const user_id = req.user?.user_id;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const prompt = topic
      ? `Tạo flashcard về chủ đề "${topic}" từ nội dung sau:\n${content}`
      : `Tạo flashcard từ nội dung sau:\n${content}`;

    const aiResponse = await askOpenAI({
      message: prompt,
      type: "flashcard",
    });

    // Xử lý trừ token
    let tokenInfo;
    try {
      tokenInfo = await processTokenDeduction(
        user_id,
        aiResponse.usage.total_tokens,
      );
    } catch (tokenError) {
      console.error("Token deduction error:", tokenError);
      return res.status(402).json({
        error: "Token quota exceeded",
        detail: tokenError.message,
      });
    }

    res.json({ flashcards: aiResponse.content, token_info: tokenInfo });
  } catch (error) {
    console.error("Generate flashcard error:", error);
    res.status(500).json({ error: "AI service error", detail: error.message });
  }
};

/**
 * 📊 Lấy lịch sử tương tác AI của user
 * GET /api/user/ai/history
 */
export const getAIHistory = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { limit = 20, offset = 0 } = req.query;

    const interactions = await AI_Interaction.findAndCountAll({
      where: { user_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
      include: [
        { model: db.User_Exam, attributes: ["user_exam_id", "exam_id"] },
        {
          model: db.Container_Question,
          attributes: ["container_question_id", "question_text"],
        },
      ],
    });

    res.json({
      interactions: interactions.rows,
      total: interactions.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Get AI history error:", error);
    res.status(500).json({ error: "Failed to get AI history" });
  }
};

// Generate complete flashcard set from topic
export const generateFlashcardSetController = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {
      topic,
      cardCount = 10,
      difficulty = "medium",
      additionalContext,
      saveToDatabase = false,
      generatedData, // Accept pre-generated data for saving edited flashcards
    } = req.body;

    let dataToUse;
    let tokenUsage = null;

    // If generatedData is provided (user edited and wants to save), use it
    if (saveToDatabase && generatedData) {
      dataToUse = generatedData;
    } else {
      // Otherwise, generate new flashcard set
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const generatedResult = await generateFlashcardSet({
        topic,
        cardCount,
        difficulty,
        additionalContext,
      });

      // Extract usage and data
      tokenUsage = generatedResult.usage;
      dataToUse = {
        set_info: generatedResult.set_info,
        flashcards: generatedResult.flashcards,
      };

      // Xử lý trừ token nếu có usage
      if (tokenUsage) {
        try {
          const tokenInfo = await processTokenDeduction(
            user_id,
            tokenUsage.total_tokens,
          );
        } catch (tokenError) {
          console.error("Token deduction error:", tokenError);
          return res.status(402).json({
            error: "Token quota exceeded",
            detail: tokenError.message,
          });
        }
      }
    }

    // If user wants to save to database
    if (saveToDatabase) {
      const { set_info, flashcards } = dataToUse;

      // Create flashcard set
      const flashcardSet = await Flashcard_Set.create({
        user_id,
        title: set_info.title,
        description: set_info.description,
        visibility: "private",
        created_by_type: "AI",
        total_cards: flashcards.length,
      });

      // Create all flashcards
      const flashcardPromises = flashcards.map((card) =>
        Flashcard.create({
          flashcard_set_id: flashcardSet.flashcard_set_id,
          front_content: card.front_content,
          back_content: card.back_content,
          example: card.example || null,
          difficulty_level: card.difficulty_level,
          pronunciation: card.pronunciation || null,
        }),
      );

      await Promise.all(flashcardPromises);

      // Note: No need to log AI_Interaction here because:
      // 1. AI_Interaction is designed for exam/question context
      // 2. Flashcard generation is already tracked via created_by_type='AI'
      // 3. Token usage is logged in console via aiService.js

      return res.json({
        success: true,
        saved: true,
        flashcard_set_id: flashcardSet.flashcard_set_id,
        set_info,
        flashcards,
      });
    }

    // Otherwise, just return the generated data for preview
    res.json({
      success: true,
      saved: false,
      ...dataToUse,
    });
  } catch (error) {
    console.error("Generate flashcard set error:", error);
    res.status(500).json({
      error: "Failed to generate flashcard set",
      details: error.message,
    });
  }
};

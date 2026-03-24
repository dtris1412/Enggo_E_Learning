import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

/**
 * Hàm gọi OpenAI, có thể mở rộng cho nhiều nhiệm vụ khác nhau
 * @param {Object} params
 * @param {string} params.message - Nội dung chính
 * @param {string} [params.type] - Loại nhiệm vụ (chat, flashcard, grading...)
 * @param {string} [params.context] - Ngữ cảnh bổ sung
 * @param {Object} [params.options] - Tuỳ chọn model, max_tokens, temperature...
 * @returns {Promise<string>} - Kết quả trả về từ AI
 */
export const askOpenAI = async ({
  message,
  type = "chat",
  context = "",
  options = {},
}) => {
  let prompt = message;
  // Tuỳ loại nhiệm vụ, xây dựng prompt phù hợp
  if (type === "flashcard") {
    prompt = `Hãy tạo flashcard từ nội dung sau:\n${message}`;
  } else if (type === "grading") {
    prompt = `Hãy chấm điểm và nhận xét bài làm sau:\n${message}`;
  }
  // Có thể mở rộng thêm các loại khác ở đây

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: options.model || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: options.max_tokens || 500,
        temperature: options.temperature || 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response.data.choices[0].message.content.trim();
    const usage = response.data.usage;

    // Return both content and usage for token tracking
    return {
      content,
      usage: {
        prompt_tokens: usage?.prompt_tokens || 0,
        completion_tokens: usage?.completion_tokens || 0,
        total_tokens: usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    // Handle OpenAI API errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error;

      if (status === 429) {
        throw new Error(
          "Đã vượt quá giới hạn API. Vui lòng đợi một chút rồi thử lại.",
        );
      } else if (status === 401) {
        throw new Error("OpenAI API key không hợp lệ.");
      } else if (status === 403) {
        throw new Error("OpenAI API key không có quyền truy cập.");
      } else if (status >= 500) {
        throw new Error("OpenAI API đang gặp sự cố. Vui lòng thử lại sau.");
      } else {
        throw new Error(errorData?.message || `OpenAI API error: ${status}`);
      }
    }
    throw error;
  }
};

/**
 * Tạo toàn bộ flashcard set từ chủ đề/yêu cầu
 * @param {string} topic - Chủ đề hoặc yêu cầu từ người dùng
 * @param {number} cardCount - Số lượng flashcard muốn tạo (mặc định 10)
 * @param {string} difficulty - Độ khó (easy, medium, hard)
 * @returns {Promise<Object>} - Object chứa thông tin set và danh sách flashcards
 */
export const generateFlashcardSet = async ({
  topic,
  cardCount = 10,
  difficulty = "medium",
  additionalContext = "",
}) => {
  // Calculate optimal max_tokens based on card count (tiết kiệm tokens)
  // Mỗi card ~100 tokens, set_info ~50 tokens
  const estimatedTokens = Math.min(cardCount * 100 + 100, 4000);

  const prompt = `🎯 TẠO FLASHCARD HỌC TIẾNG ANH

📚 Chủ đề: "${topic}"
📊 Số lượng: ${cardCount} flashcards
🎚️ Độ khó: ${difficulty}
${additionalContext ? `\n💡 Yêu cầu thêm: ${additionalContext}` : ""}

📋 HƯỚNG DẪN:
- Nội dung phù hợp cho học TIẾNG ANH (vocabulary, phrases, idioms, collocations, grammar, expressions)
- Front: Tiếng Anh hoặc tình huống/câu hỏi
- Back: Nghĩa tiếng Việt, giải thích, hoặc đáp án
- Example: Câu ví dụ thực tế bằng tiếng Anh (bắt buộc)
- Pronunciation: IPA cho từ vựng khó

✨ VÍ DỤ FLASHCARD TỐT:
{
  "front_content": "procrastinate",
  "back_content": "trì hoãn, trì trệ (verb)",
  "example": "I tend to procrastinate when I have too much work to do.",
  "pronunciation": "/prəˈkræstɪneɪt/",
  "difficulty_level": "medium"
}

{
  "front_content": "It's raining cats and dogs",
  "back_content": "Mưa như trút nước (idiom)",
  "example": "We can't go out now - it's raining cats and dogs!",
  "pronunciation": null,
  "difficulty_level": "medium"
}

📤 OUTPUT FORMAT (JSON only, no markdown):
{
  "set_info": {
    "title": "[Tiếng Anh] Tiêu đề ngắn gọn",
    "description": "Mô tả chi tiết về bộ flashcard này, phù hợp cho học viên cần luyện..."
  },
  "flashcards": [
    {
      "front_content": "English word/phrase/question",
      "back_content": "Nghĩa tiếng Việt + giải thích",
      "example": "Example sentence in English (REQUIRED)",
      "pronunciation": "/IPA/ or null",
      "difficulty_level": "${difficulty}"
    }
  ]
}

⚠️ LƯU Ý:
- MỖI flashcard PHẢI có example sentence
- Ưu tiên từ vựng/cụm từ thực tế, thường gặp trong giao tiếp/luyện thi
- Pronunciation dùng IPA format chuẩn
- Difficulty phù hợp với từng loại nội dung`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert English language educator and IELTS/TOEIC instructor. Create high-quality flashcards for Vietnamese learners studying English. Focus on practical vocabulary, phrases, idioms, and expressions commonly used in exams and real communication. Always provide Vietnamese explanations and natural English example sentences. Return only valid JSON format.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: estimatedTokens,
        temperature: 0.7, // Giảm từ 0.8 để consistent hơn, ít retry
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiResponse = response.data.choices[0].message.content.trim();

    // Log token usage để theo dõi chi phí
    const usage = response.data.usage;
    if (usage) {
      console.log(`[Token Usage] Flashcard Generation:`, {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        estimated_cost: `$${(
          (usage.prompt_tokens * 0.15 + usage.completion_tokens * 0.6) /
          1000000
        ).toFixed(6)}`,
      });
    }

    // Parse JSON response
    try {
      // Remove markdown code blocks if present
      let jsonString = aiResponse;
      if (jsonString.includes("```json")) {
        jsonString = jsonString
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
      }
      if (jsonString.includes("```")) {
        jsonString = jsonString.replace(/```\n?/g, "");
      }

      const parsedData = JSON.parse(jsonString);

      // Validate structure
      if (!parsedData.set_info || !parsedData.flashcards) {
        throw new Error("Invalid response structure from AI");
      }

      // Return both data and usage for token tracking
      return {
        ...parsedData,
        usage: {
          prompt_tokens: usage?.prompt_tokens || 0,
          completion_tokens: usage?.completion_tokens || 0,
          total_tokens: usage?.total_tokens || 0,
        },
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("AI Response:", aiResponse);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    // Handle OpenAI API errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error;

      if (status === 429) {
        throw new Error(
          "Đã vượt quá giới hạn API. Vui lòng đợi một chút rồi thử lại hoặc kiểm tra quota của OpenAI API key.",
        );
      } else if (status === 401) {
        throw new Error(
          "OpenAI API key không hợp lệ. Vui lòng kiểm tra lại cấu hình.",
        );
      } else if (status === 403) {
        throw new Error(
          "OpenAI API key không có quyền truy cập. Vui lòng kiểm tra billing.",
        );
      } else if (status >= 500) {
        throw new Error("OpenAI API đang gặp sự cố. Vui lòng thử lại sau.");
      } else {
        throw new Error(errorData?.message || `OpenAI API error: ${status}`);
      }
    }

    // Re-throw other errors
    throw error;
  }
};

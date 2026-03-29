import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

// ─────────────────────────────────────────────
// Scope Validation - Chỉ trả lời học thuật tiếng Anh
// ─────────────────────────────────────────────

/**
 * Danh sách pattern NGOÀI phạm vi hỗ trợ.
 * Kiểm tra nhanh bằng regex trước khi gọi AI, tiết kiệm token.
 */
const OUT_OF_SCOPE_PATTERNS = [
  // Sức khỏe / y tế
  /\b(bị bệnh|triệu chứng|đau bụng|sốt|ốm|thuốc|bác sĩ|bệnh viện|khám bệnh|chữa bệnh|điều trị|dị ứng|ho|cảm cúm)\b/i,
  /\b(sick|symptom|disease|medicine|doctor|hospital|treatment|fever|cough|allergy|surgery)\b/i,

  // Tài chính / vay vốn
  /\b(vay vốn|vay tiền|lãi suất|ngân hàng|đầu tư chứng khoán|cổ phiếu|tiền tệ|tỷ giá|crypto|bitcoin)\b/i,
  /\b(loan|borrow money|interest rate|stock market|investment|cryptocurrency)\b/i,

  // Ngoại hình / cá nhân
  /\b(tôi có đẹp|tôi có xinh|tôi trông|tôi béo|tôi gầy|chế độ ăn|giảm cân|tăng cân)\b/i,
  /\b(am i beautiful|am i handsome|do i look|lose weight|gain weight|diet plan)\b/i,

  // Pháp lý / chính trị
  /\b(luật sư|kiện tụng|chính trị|bầu cử|đảng phái|quốc hội)\b/i,
  /\b(lawyer|lawsuit|politics|election|government policy)\b/i,

  // Nấu ăn / công thức
  /\b(công thức nấu|cách nấu|nguyên liệu nấu|món ăn|thực đơn)\b/i,
  /\b(cooking recipe|how to cook|ingredients for|food recipe)\b/i,
];

/**
 * Kiểm tra xem message có nằm ngoài phạm vi học thuật tiếng Anh không.
 * @param {string} message
 * @returns {{ isOutOfScope: boolean, reason: string|null }}
 */
export const checkScope = (message) => {
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(message)) {
      return {
        isOutOfScope: true,
        reason:
          "Xin lỗi, mình chỉ hỗ trợ các câu hỏi liên quan đến học tập tiếng Anh " +
          "(ngữ pháp, từ vựng, luyện thi IELTS/TOEIC, đọc hiểu, viết, phát âm,...). " +
          "Vui lòng đặt câu hỏi về tiếng Anh nhé! 😊",
      };
    }
  }
  return { isOutOfScope: false, reason: null };
};

// System prompt cho globalChat - buộc AI từ chối câu ngoài phạm vi
const ENGLISH_ASSISTANT_SYSTEM_PROMPT = `Bạn là trợ lý học tiếng Anh chuyên nghiệp cho nền tảng học tập Enggo.

PHẠM VI HỖ TRỢ (chỉ trả lời các chủ đề này):
✅ Ngữ pháp tiếng Anh (Grammar)
✅ Từ vựng, idioms, collocations, phrasal verbs
✅ Luyện thi IELTS, TOEIC, TOEFL
✅ Kỹ năng đọc hiểu, viết, nghe, nói
✅ Phát âm, IPA
✅ Giải thích câu hỏi/đáp án trong bài kiểm tra tiếng Anh
✅ Dịch thuật Anh-Việt liên quan đến học tập
✅ Gợi ý từ đồng nghĩa, trái nghĩa, cách dùng từ

NGOÀI PHẠM VI (từ chối lịch sự):
❌ Câu hỏi về sức khỏe, y tế
❌ Câu hỏi về tài chính, đầu tư, vay vốn
❌ Câu hỏi về chính trị, pháp luật
❌ Câu hỏi cá nhân không liên quan học tập
❌ Công thức nấu ăn, giải trí thuần túy

Nếu câu hỏi NGOÀI phạm vi, hãy trả lời:
"Xin lỗi, mình chỉ hỗ trợ các câu hỏi liên quan đến học tập tiếng Anh. Bạn có câu hỏi về tiếng Anh nào không? 😊"

Trả lời bằng tiếng Việt trừ khi user hỏi bằng tiếng Anh. Ngắn gọn, rõ ràng, dễ hiểu cho học viên Việt Nam.`;

// System prompt cho contextAssist - giải thích đáp án bài thi
const EXAM_EXPLANATION_SYSTEM_PROMPT = `Bạn là trợ lý giải thích đáp án tiếng Anh chuyên nghiệp cho nền tảng Enggo.

NHIỆM VỤ: Giải thích tại sao đáp án là đúng/sai trong bài kiểm tra tiếng Anh.

QUY TẮC:
- Giải thích ngắn gọn, rõ ràng (3-5 câu)
- Nêu rõ quy tắc ngữ pháp / từ vựng áp dụng
- Đưa ví dụ minh họa nếu cần
- Giải thích bằng tiếng Việt, giữ nguyên thuật ngữ tiếng Anh quan trọng
- KHÔNG đề cập thông tin cá nhân của user
- KHÔNG trả lời câu hỏi ngoài phạm vi giải thích bài thi tiếng Anh`;

/**
 * Hàm gọi OpenAI, có thể mở rộng cho nhiều nhiệm vụ khác nhau
 * @param {Object} params
 * @param {string} params.message - Nội dung chính
 * @param {string} [params.type] - Loại nhiệm vụ (chat, flashcard, grading, explanation)
 * @param {string} [params.context] - Ngữ cảnh bổ sung
 * @param {string} [params.systemPrompt] - System prompt tùy chỉnh (override mặc định)
 * @param {Object} [params.options] - Tuỳ chọn model, max_tokens, temperature...
 * @returns {Promise<{content, usage}>}
 */
export const askOpenAI = async ({
  message,
  type = "chat",
  context = "",
  systemPrompt = null,
  options = {},
}) => {
  let prompt = message;
  let resolvedSystemPrompt = systemPrompt;

  // Tuỳ loại nhiệm vụ, xây dựng prompt + system prompt phù hợp
  if (type === "flashcard") {
    prompt = `Hãy tạo flashcard từ nội dung sau:\n${message}`;
  } else if (type === "grading") {
    prompt = `Hãy chấm điểm và nhận xét bài làm sau:\n${message}`;
  } else if (type === "explanation") {
    // Giải thích đáp án bài thi tiếng Anh
    if (!resolvedSystemPrompt)
      resolvedSystemPrompt = EXAM_EXPLANATION_SYSTEM_PROMPT;
  } else if (type === "chat") {
    // Global chat - dùng system prompt giới hạn phạm vi
    if (!resolvedSystemPrompt)
      resolvedSystemPrompt = ENGLISH_ASSISTANT_SYSTEM_PROMPT;
  }

  const messages = [];
  if (resolvedSystemPrompt) {
    messages.push({ role: "system", content: resolvedSystemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: options.model || "gpt-4o-mini",
        messages, // dùng messages array đã có system prompt
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

// ─────────────────────────────────────────────
// IELTS Writing Grader
// ─────────────────────────────────────────────

/**
 * Chấm điểm bài viết IELTS theo rubric chuẩn
 * @param {string} task_prompt - Đề bài (nội dung container + câu hỏi)
 * @param {string} user_content - Bài viết của thí sinh
 * @param {'task1'|'task2'} task_type - Loại task
 * @returns {Promise<{overall_band, criteria_scores, feedback, corrected_sentences, usage}>}
 */
export const gradeIeltsWriting = async ({
  task_prompt,
  user_content,
  task_type = "task2",
}) => {
  const wordCount = user_content.trim().split(/\s+/).filter(Boolean).length;
  const minWords = task_type === "task1" ? 150 : 250;

  const systemPrompt = `You are an expert IELTS examiner with 15+ years of experience grading Writing tasks.
Grade the following ${task_type === "task1" ? "Task 1 (report/graph description)" : "Task 2 (essay)"} response strictly according to the official IELTS Writing band descriptors.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "overall_band": <number 0-9, step 0.5>,
  "criteria_scores": {
    ${
      task_type === "task1"
        ? `"task_achievement": <0-9>,
    "coherence_cohesion": <0-9>,
    "lexical_resource": <0-9>,
    "grammatical_range_accuracy": <0-9>`
        : `"task_response": <0-9>,
    "coherence_cohesion": <0-9>,
    "lexical_resource": <0-9>,
    "grammatical_range_accuracy": <0-9>`
    }
  },
  "feedback": {
    "strengths": ["..."],
    "improvements": ["..."],
    "overall_comment": "..."
  },
  "word_count_note": "...",
  "sample_improvements": ["up to 2 corrected example sentences from the essay"]
}`;

  const userMessage = `TASK PROMPT:\n${task_prompt}\n\nCANDIDATE RESPONSE (${wordCount} words, minimum required: ${minWords}):\n${user_content}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const raw = response.data.choices[0].message.content.trim();
  const usage = response.data.usage;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Fallback if JSON parse fails
    parsed = {
      overall_band: null,
      criteria_scores: {},
      feedback: { overall_comment: raw },
      sample_improvements: [],
    };
  }

  return {
    ...parsed,
    usage: {
      prompt_tokens: usage?.prompt_tokens || 0,
      completion_tokens: usage?.completion_tokens || 0,
      total_tokens: usage?.total_tokens || 0,
    },
  };
};

// ─────────────────────────────────────────────
// IELTS Speaking Conversation & Evaluator
// ─────────────────────────────────────────────

/**
 * Một lượt đối thoại với AI Speaking Examiner
 * @param {Array} messages - Lịch sử conversation [{ role: 'user'|'ai', content }]
 * @param {string} part_context - Mô tả part (Part 1/2/3) + context
 * @param {string} part_type - 'part1'|'part2'|'part3'
 * @returns {Promise<{reply, is_finished, usage}>}
 */
export const speakingConversationTurn = async ({
  messages,
  part_context,
  part_type = "part1",
}) => {
  const partGuide = {
    part1:
      "Part 1 - Introduction & Interview (about 4-5 minutes): Ask short, friendly questions about familiar topics (family, work, hobbies, hometown). After 3-4 exchanges, wrap up Part 1 naturally.",
    part2:
      "Part 2 - Individual Long Turn (about 3-4 minutes): Give the candidate a cue card. Let them speak for 1-2 minutes, then ask 1-2 follow-up questions.",
    part3:
      "Part 3 - Two-way Discussion (about 4-5 minutes): Ask deeper, more abstract questions related to Part 2 topic. Encourage extended responses.",
  };

  const systemPrompt = `You are a professional IELTS Speaking Examiner conducting an official IELTS Speaking test.
Role: ${partGuide[part_type] || partGuide["part1"]}
Context: ${part_context}

Rules:
- Stay strictly in role as IELTS examiner
- Keep your responses SHORT (1-2 sentences max) — just ask the next question or give a brief acknowledgment
- Do NOT evaluate during the conversation
- When the part is naturally complete, end your message with exactly: [PART_COMPLETE]
- Ask only one question at a time
- Be encouraging but professional`;

  const aiMessages = [{ role: "system", content: systemPrompt }];
  for (const m of messages) {
    aiMessages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: aiMessages,
      max_tokens: 200,
      temperature: 0.6,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const rawReply = response.data.choices[0].message.content.trim();
  const usage = response.data.usage;
  const is_finished = rawReply.includes("[PART_COMPLETE]");
  const reply = rawReply.replace("[PART_COMPLETE]", "").trim();

  return {
    reply,
    is_finished,
    usage: {
      prompt_tokens: usage?.prompt_tokens || 0,
      completion_tokens: usage?.completion_tokens || 0,
      total_tokens: usage?.total_tokens || 0,
    },
  };
};

/**
 * Đánh giá bài thi Speaking IELTS từ transcript
 * @param {string} transcript - Toàn bộ transcript (Q&A)
 * @param {string} part_context - Context của part
 * @returns {Promise<{overall_band, criteria_scores, feedback, usage}>}
 */
export const evaluateIeltsSpeaking = async ({ transcript, part_context }) => {
  const systemPrompt = `You are an expert IELTS examiner grading a Speaking test.
Evaluate the CANDIDATE's responses only (not the examiner's questions).
Use official IELTS Speaking band descriptors.

Respond ONLY with valid JSON:
{
  "overall_band": <number 0-9, step 0.5>,
  "criteria_scores": {
    "fluency_coherence": <0-9>,
    "lexical_resource": <0-9>,
    "grammatical_range_accuracy": <0-9>,
    "pronunciation": <0-9>
  },
  "feedback": {
    "strengths": ["..."],
    "improvements": ["..."],
    "overall_comment": "..."
  }
}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `PART CONTEXT: ${part_context}\n\nTRANSCRIPT:\n${transcript}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const raw = response.data.choices[0].message.content.trim();
  const usage = response.data.usage;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      overall_band: null,
      criteria_scores: {},
      feedback: { overall_comment: raw },
    };
  }

  return {
    ...parsed,
    usage: {
      prompt_tokens: usage?.prompt_tokens || 0,
      completion_tokens: usage?.completion_tokens || 0,
      total_tokens: usage?.total_tokens || 0,
    },
  };
};

# AI Integration Guide

Hướng dẫn tích hợp hệ thống AI vào E-Learning Platform.

## 📚 Tổng quan

Hệ thống AI được chia thành 3 loại chính:

### 1️⃣ Context Assistant

AI hỗ trợ với ngữ cảnh cụ thể (exam, question, flashcard).

**Vị trí sử dụng:**

- Trang làm bài thi (ExamTaking)
- Trang xem kết quả bài thi (ExamResult)
- Trang học flashcard (FlashcardLearning)
- Trang review câu hỏi

**Component:** `ContextAssistant`

**Cách dùng:**

```tsx
import ContextAssistant from "@/shared/components/ContextAssistant";

<ContextAssistant
  type="exam"
  examId={examId}
  questionId={currentQuestionId}
  questionText={question.text}
  userHistory={userExamHistory}
  position="inline"
/>;
```

### 2️⃣ Global AI Chat

Chat bot toàn cục, xuất hiện ở góc màn hình, có thể inject context.

**Vị trí sử dụng:**

- Mọi trang trong hệ thống
- Thêm vào App.tsx hoặc Layout component

**Component:** `GlobalAIChatWidget`

**Cách dùng:**

```tsx
import GlobalAIChatWidget from "@/shared/components/GlobalAIChatWidget";

// Trong App.tsx hoặc Layout
<GlobalAIChatWidget
  context={{
    exam_id: currentExamId,
    question_id: currentQuestionId,
    current_page: window.location.pathname,
    user_score_history: userScoreHistory,
  }}
/>;
```

### 3️⃣ AI Analyzer

Phân tích dữ liệu người dùng ngầm, không có UI chat.

**Vị trí sử dụng:**

- Sau khi hoàn thành bài thi
- Trang dashboard học tập
- Background tasks

**Hook:** `useAIAnalyzer`

**Cách dùng:**

```tsx
import {
  useAIAnalyzer,
  autoAnalyzeAfterExam,
} from "@/shared/hooks/useAIAnalyzer";

const { analyzeExamPerformance, isAnalyzing } = useAIAnalyzer();

// Tự động phân tích sau khi submit exam
useEffect(() => {
  if (examCompleted) {
    autoAnalyzeAfterExam(examResult);
  }
}, [examCompleted]);

// Hoặc thủ công
const handleAnalyze = async () => {
  const analysis = await analyzeExamPerformance(examData);
  console.log(analysis);
};
```

## 🔧 Backend API Endpoints

### POST /api/user/ai/context-assist

Context assistant với exam/question context.

```json
{
  "message": "Giải thích câu hỏi này",
  "type": "exam",
  "exam_id": 123,
  "question_id": 456,
  "user_history": {...}
}
```

### POST /api/user/ai/chat

Global chat với optional context.

```json
{
  "message": "Tôi cần gợi ý học tập",
  "context": {
    "exam_id": 123,
    "current_page": "/exam/123"
  }
}
```

### POST /api/user/ai/analyze

Phân tích dữ liệu người dùng.

```json
{
  "analysis_type": "exam_performance",
  "data": {...examResult}
}
```

Analysis types:

- `exam_performance`: Phân tích kết quả thi
- `learning_path`: Đề xuất lộ trình học
- `weaknesses`: Phát hiện điểm yếu
- `practice_set`: Tạo bộ câu hỏi luyện tập

### POST /api/user/ai/generate-flashcard

Tạo flashcard từ nội dung.

```json
{
  "content": "Nội dung cần tạo flashcard",
  "topic": "Tên chủ đề"
}
```

### GET /api/user/ai/history

Lấy lịch sử tương tác AI.

```
/api/user/ai/history?limit=20&offset=0
```

## 📝 Các bước tích hợp

### Bước 1: Thêm Global AI Chat vào App

```tsx
// src/App.tsx
import GlobalAIChatWidget from "@/shared/components/GlobalAIChatWidget";

function App() {
  return (
    <>
      {/* Your routes */}
      <GlobalAIChatWidget />
    </>
  );
}
```

### Bước 2: Thêm Context Assistant vào trang Exam

```tsx
// src/user/pages/ExamTaking.tsx
import ContextAssistant from "@/shared/components/ContextAssistant";

function ExamTaking() {
  return (
    <div>
      {/* Question display */}

      <ContextAssistant
        type="exam"
        examId={examId}
        questionId={currentQuestion.id}
        questionText={currentQuestion.text}
        position="inline"
      />
    </div>
  );
}
```

### Bước 3: Thêm AI Analyzer vào ExamResult

```tsx
// src/user/pages/ExamResult.tsx
import { useEffect } from "react";
import { autoAnalyzeAfterExam } from "@/shared/hooks/useAIAnalyzer";

function ExamResult({ examResult }) {
  useEffect(() => {
    // Auto analyze khi vào trang kết quả
    autoAnalyzeAfterExam(examResult);
  }, [examResult]);

  return <div>{/* Display result */}</div>;
}
```

### Bước 4: Thêm Generate Flashcard vào Flashcard page

```tsx
// src/user/pages/FlashcardCreate.tsx
import { generateFlashcardFromContent } from "@/shared/hooks/useAIAnalyzer";

function FlashcardCreate() {
  const handleAIGenerate = async () => {
    const content = lessonContent; // Nội dung từ bài học
    const flashcards = await generateFlashcardFromContent(content, topic);
    // Xử lý flashcards được tạo
  };

  return <button onClick={handleAIGenerate}>✨ Tạo Flashcard bằng AI</button>;
}
```

## 🎨 Customization

### Custom prompt cho AI

Mở `server/src/user/services/aiService.js` và tùy chỉnh prompt:

```js
if (type === "flashcard") {
  prompt = `Tạo flashcard theo format JSON từ nội dung sau:\n${message}`;
}
```

### Custom UI cho chat widget

Mở `client/src/shared/components/GlobalAIChatWidget.tsx` và tùy chỉnh:

- Màu sắc: thay `bg-blue-600` thành màu khác
- Vị trí: thay `bottom-6 right-6` thành vị trí khác
- Kích thước: thay `w-96 h-[600px]` thành kích thước khác

## ⚠️ Lưu ý

1. **API Key**: Đảm bảo đã thêm `OPENAI_API_KEY` vào `.env` của server.
2. **Authentication**: Tất cả API đều yêu cầu authentication (Bearer token).
3. **Cost**: Theo dõi usage của OpenAI API để kiểm soát chi phí.
4. **Privacy**: Dữ liệu user history được lưu trong DB, cần tuân thủ quy định bảo mật.

## 🚀 Testing

Kiểm tra từng component:

```bash
# 1. Test Global Chat
- Mở bất kỳ trang nào
- Click vào icon chat góc dưới bên phải
- Gửi câu hỏi và kiểm tra phản hồi

# 2. Test Context Assistant
- Vào trang làm bài thi
- Click vào các nút quick action
- Kiểm tra phản hồi có context phù hợp

# 3. Test AI Analyzer
- Hoàn thành một bài thi
- Check console log xem có auto-analysis không
- Kiểm tra performance analysis trong dashboard
```

## 📊 Future Enhancements

- [ ] Voice input cho chat
- [ ] Multi-language support
- [ ] AI-powered practice question generator
- [ ] Personalized learning path recommendation
- [ ] Real-time collaborative AI tutor
- [ ] Integration với vector database cho RAG
- [ ] Fine-tuning model với dữ liệu nội bộ

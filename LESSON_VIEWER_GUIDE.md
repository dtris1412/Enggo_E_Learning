# Hướng Dẫn Xem Bài Học (Lesson Viewer)

## Tổng Quan

Đã triển khai đầy đủ tính năng xem bài học với nội dung text, media gallery và câu hỏi trắc nghiệm.

## Kiến Trúc

### Backend

#### 1. Lesson Service (`server/src/user/services/lessonService.js`)

```javascript
exports.getLessonById = async (lessonId) => {
  // Trả về lesson với:
  // - Lesson_Media[] (video, image, audio)
  // - Lesson_Question[] (câu hỏi trắc nghiệm)
  // Tất cả được sắp xếp theo order_index
};
```

**API Endpoint:**

- `GET /api/user/lessons/:id` - Lấy chi tiết bài học
- Không yêu cầu authentication
- Response: `{success: true, data: Lesson}`

#### 2. Data Structure

**Lesson_Media:**

- `media_id` - ID của media
- `order_index` - Thứ tự hiển thị
- `media_type` - "video", "image", "audio"
- `media_url` - URL của media file
- `description` - Mô tả media (optional)
- `transcript` - Văn bản transcript cho video/audio (optional)

**Lesson_Question:**

- `lesson_question_id` - ID câu hỏi
- `order_index` - Thứ tự câu hỏi
- `question_type` - Loại câu hỏi (multiple choice, true/false...)
- `content` - Nội dung câu hỏi
- `options` - Array [{value: "A", label: "Answer A"}]
- `correct_answer` - Đáp án đúng
- `explaination` - Giải thích đáp án
- `difficulty_level` - "easy", "medium", "hard"

### Frontend

#### 1. Learning Context (`client/src/user/contexts/learningContext.tsx`)

**Interfaces:**

```typescript
interface LessonMedia {
  media_id: number;
  order_index: number;
  description: string | null;
  media_type: string;
  media_url: string;
  transcript: string | null;
}

interface LessonQuestion {
  lesson_question_id: number;
  order_index: number;
  question_type: string;
  content: string;
  options: Array<{ value: string; label: string }> | null;
  correct_answer: string;
  explaination: string | null;
  difficulty_level: string;
}
```

**Methods:**

- `loadLessonDetail(lessonId)` - Tải chi tiết bài học với media và câu hỏi
- `selectLesson(moduleLessonId)` - Chọn bài học và tự động load details

#### 2. Components

##### LessonMediaGallery (`client/src/user/components/LearningSpaceComponent/LessonMediaGallery.tsx`)

**Features:**

- ✅ Hiển thị video với video player
- ✅ Hiển thị ảnh với image viewer
- ✅ Hiển thị audio với audio player
- ✅ Navigation giữa các media items
- ✅ Hiển thị description và transcript
- ✅ Pagination dots indicator

**Usage:**

```tsx
<LessonMediaGallery media={currentLesson.Lesson_Media} />
```

##### LessonQuiz (`client/src/user/components/LearningSpaceComponent/LessonQuiz.tsx`)

**Features:**

- ✅ Hiển thị danh sách câu hỏi trắc nghiệm
- ✅ Radio buttons cho multiple choice
- ✅ Difficulty level badges (easy/medium/hard)
- ✅ Submit và kiểm tra đáp án
- ✅ Hiển thị kết quả (đúng/sai)
- ✅ Hiển thị giải thích cho từng câu
- ✅ Tính điểm và hiển thị phần trăm
- ✅ Retry quiz functionality
- ✅ onComplete callback để xử lý khi hoàn thành

**Usage:**

```tsx
<LessonQuiz
  questions={currentLesson.Lesson_Questions}
  onComplete={(score, total) => {
    console.log(`Score: ${score}/${total}`);
  }}
/>
```

**Scoring System:**

- 🎉 Xuất sắc: ≥ 70%
- 👍 Tốt: 50-69%
- 💪 Cần cố gắng thêm: < 50%

#### 3. LessonContent Integration

**Layout order:**

1. Lesson markdown content (ReactMarkdown)
2. Media Gallery (nếu có `Lesson_Media`)
3. Quiz Section (nếu có `Lesson_Questions`)
4. Exam Format Note (nếu `is_exam_format = true`)

**Conditional Rendering:**

```tsx
{
  currentLesson.Lesson_Media && currentLesson.Lesson_Media.length > 0 && (
    <LessonMediaGallery media={currentLesson.Lesson_Media} />
  );
}

{
  currentLesson.Lesson_Questions &&
    currentLesson.Lesson_Questions.length > 0 && (
      <LessonQuiz questions={currentLesson.Lesson_Questions} />
    );
}
```

## Flow Người Dùng

1. **Chọn bài học** - Click vào bài học trong sidebar
2. **Load details** - `selectLesson()` tự động gọi `loadLessonDetail()`
3. **Xem nội dung** - Đọc markdown content
4. **Xem media** - Navigate qua video/ảnh/audio (nếu có)
5. **Làm quiz** - Trả lời câu hỏi và submit
6. **Xem kết quả** - Kiểm tra đúng/sai và đọc giải thích
7. **Retry** - Làm lại quiz nếu muốn
8. **Hoàn thành** - Click "Hoàn thành & Tiếp tục"

## Media Types Support

### Video

- HTML5 video player với controls
- Hỗ trợ mp4 format
- Hiển thị transcript nếu có

### Image

- Full-width display với max-height 500px
- Object-fit: contain để giữ tỷ lệ
- Rounded corners và shadow

### Audio

- HTML5 audio player với controls
- Icon 🎵 để biểu thị audio
- Centered layout với gray background

## Quiz Features

### Question Display

- Numbered questions (Câu 1, Câu 2...)
- Difficulty badge (color-coded)
- Radio buttons cho single choice
- Clear option labels

### Answer Validation

- Green border + checkmark cho đúng
- Red border + X mark cho sai
- Show correct answer sau khi submit
- Prevent changes sau khi submit

### Explanation Display

- Blue info box với icon 💡
- Hiển thị sau khi submit
- Giải thích tại sao đáp án đúng/sai

### Results Summary

- Color-coded based on score
- Percentage display
- Encouraging messages
- Score breakdown (X/Y câu đúng)

## API Response Format

```json
{
  "success": true,
  "data": {
    "lesson_id": 1,
    "lesson_title": "Introduction to JavaScript",
    "lesson_content": "# JavaScript Basics\\n\\nJavaScript is...",
    "lesson_type": "video",
    "estimated_time": 30,
    "difficulty_level": "beginner",
    "is_exam_format": false,
    "Lesson_Media": [
      {
        "media_id": 1,
        "order_index": 1,
        "media_type": "video",
        "media_url": "https://example.com/video.mp4",
        "description": "Introduction video",
        "transcript": "Hello, welcome to JavaScript..."
      }
    ],
    "Lesson_Questions": [
      {
        "lesson_question_id": 1,
        "order_index": 1,
        "question_type": "multiple_choice",
        "content": "What is JavaScript?",
        "options": [
          { "value": "A", "label": "A programming language" },
          { "value": "B", "label": "A database" },
          { "value": "C", "label": "A framework" }
        ],
        "correct_answer": "A",
        "explaination": "JavaScript is a programming language...",
        "difficulty_level": "easy"
      }
    ]
  }
}
```

## Styling & UI

### Theme Colors

- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Components Classes

- Media gallery: Rounded borders, shadow-lg
- Quiz container: Border transitions on answer
- Buttons: Hover effects, disabled states
- Progress indicators: Animated width transitions

## Future Enhancements

Có thể mở rộng thêm:

- [ ] Video playback tracking (thời gian xem)
- [ ] Quiz timer (giới hạn thời gian làm bài)
- [ ] Quiz scoring thresholds (yêu cầu đạt X% mới hoàn thành)
- [ ] Multiple attempt tracking
- [ ] Export quiz results
- [ ] Video notes/annotations
- [ ] Download media attachments
- [ ] Code playground cho coding questions
- [ ] Drag-and-drop questions
- [ ] Fill-in-the-blank questions

## Testing

### Test Cases

1. **Basic Lesson** - Chỉ có content, không media/quiz
2. **Video Lesson** - Có 1 video
3. **Multi-Media** - Có nhiều videos/images/audio
4. **Quiz Only** - Chỉ có quiz, không media
5. **Full Lesson** - Có cả content, media và quiz
6. **Empty States** - Lesson không có gì

### Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (not tested, may need polyfills)

## Troubleshooting

### Media không load

- Kiểm tra URL trong database có đúng không
- Kiểm tra CORS nếu media từ domain khác
- Kiểm tra format file (mp4 cho video, mp3 cho audio)

### Quiz không hiển thị

- Kiểm tra `Lesson_Questions` có trong response không
- Kiểm tra `status: true` trong database
- Kiểm tra format của `options` field (phải là JSON array)

### TypeScript errors

- Kiểm tra interfaces match với API response
- Kiểm tra optional chaining cho nullable fields
- Run `npm run build` để check compile errors

## Summary

✅ **Completed:**

- Backend API endpoint `/api/user/lessons/:id`
- Lesson service với includes cho Media và Questions
- Frontend context với loadLessonDetail
- LessonMediaGallery component (video/image/audio)
- LessonQuiz component (full quiz functionality)
- Integration vào LessonContent
- Error handling và loading states
- Responsive layout
- Vietnamese UI text

🎯 **Ready to Use:**
Bây giờ khi user click vào bài học trong Learning Space, họ sẽ thấy:

1. Markdown content với syntax highlighting
2. Media gallery để xem video/ảnh/audio
3. Quiz section để kiểm tra kiến thức
4. Kết quả quiz với giải thích chi tiết

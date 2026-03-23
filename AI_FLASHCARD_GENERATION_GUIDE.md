# AI Flashcard Generation Guide

## 🎯 Tổng quan

Tính năng AI Flashcard Generation cho phép người dùng tạo bộ flashcard hoàn chỉnh chỉ bằng cách nhập chủ đề. AI sẽ tự động:

- Tuyển tập dữ liệu liên quan
- Tạo tiêu đề và mô tả cho bộ flashcard
- Tạo nhiều flashcards với format chuẩn của hệ thống
- Cho phép preview và chỉnh sửa trước khi lưu

## 🏗️ Kiến trúc

### Backend

#### 1. AI Service (`server/src/user/services/aiService.js`)

**Function: `generateFlashcardSet`**

```javascript
generateFlashcardSet({
  topic,              // Chủ đề flashcard (bắt buộc)
  cardCount = 10,     // Số lượng flashcards (mặc định: 10)
  difficulty = "medium", // Độ khó: easy, medium, hard
  additionalContext   // Yêu cầu bổ sung (tùy chọn)
})
```

**Output:**

```json
{
  "set_info": {
    "title": "Từ vựng tiếng Anh về Du lịch",
    "description": "Bộ từ vựng cơ bản cho..."
  },
  "flashcards": [
    {
      "front_content": "Hotel",
      "back_content": "Khách sạn",
      "example": "I booked a hotel for my vacation",
      "difficulty_level": "easy",
      "pronunciation": "/həʊˈtel/"
    }
  ]
}
```

**Đặc điểm:**

- Sử dụng OpenAI GPT-4 với prompt engineering chi tiết
- Tự động parse JSON response và xử lý markdown
- Validation dữ liệu trả về
- Error handling robust

#### 2. Controller (`server/src/user/controllers/aiController.js`)

**Endpoint:** `POST /api/user/ai/generate-flashcard-set`

**Request Body:**

```json
{
  "topic": "Từ vựng IELTS band 7+",
  "cardCount": 15,
  "difficulty": "hard",
  "additionalContext": "Tập trung vào Academic words",
  "saveToDatabase": false, // false = preview, true = save
  "generatedData": null // Gửi khi save flashcards đã edit
}
```

**Response (Preview mode - saveToDatabase: false):**

```json
{
  "success": true,
  "saved": false,
  "set_info": { ... },
  "flashcards": [ ... ]
}
```

**Response (Save mode - saveToDatabase: true):**

```json
{
  "success": true,
  "saved": true,
  "flashcard_set_id": 123,
  "set_info": { ... },
  "flashcards": [ ... ]
}
```

**Logic Flow:**

1. Nếu `generatedData` được gửi kèm (user đã edit) → Lưu trực tiếp data đó
2. Nếu không có `generatedData` → Gọi AI để generate mới
3. Nếu `saveToDatabase = true` → Lưu vào database với `created_by_type = 'AI'`
4. Log interaction vào bảng `AI_Interaction`

#### 3. Route (`server/src/user/routes/userRoutes.js`)

```javascript
router.post(
  "/api/user/ai/generate-flashcard-set",
  verifyToken, // Kiểm tra JWT token
  requireUser, // Kiểm tra user role
  generateFlashcardSetController,
);
```

### Frontend

#### 1. Component (`client/src/user/components/FlashcardComponent/AIFlashcardGenerator.tsx`)

**Features:**

- ✅ Input form cho topic, số lượng, độ khó, yêu cầu bổ sung
- ✅ Generate flashcard với loading state
- ✅ Preview toàn bộ flashcard set
- ✅ Edit set info (title, description)
- ✅ Edit từng flashcard (front, back, example)
- ✅ Regenerate nếu không hài lòng
- ✅ Save to database với edited data
- ✅ Token validation và error handling

**Component Structure:**

```tsx
<AIFlashcardGenerator>
  {/* Input Form */}
  <input topic />
  <input cardCount />
  <select difficulty />
  <textarea additionalContext />
  <button Generate />

  {/* Preview Section (conditionally rendered) */}
  <SetInfoPreview
    editable={true}
    onEdit={...}
  />

  <FlashcardsList
    cards={flashcards}
    editable={true}
    onEditCard={...}
  />

  {/* Action Buttons */}
  <button Regenerate />
  <button Save />
</AIFlashcardGenerator>
```

**State Management:**

```typescript
const [topic, setTopic] = useState("");
const [cardCount, setCardCount] = useState(10);
const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
  "medium",
);
const [additionalContext, setAdditionalContext] = useState("");
const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [editedCard, setEditedCard] = useState<Flashcard | null>(null);
```

#### 2. Routing (`client/src/App.tsx`)

```tsx
<Route path="/flashcards/ai-generate" element={<AIFlashcardGenerator />} />
```

#### 3. Navigation Button (`client/src/user/pages/Flashcard.tsx`)

Thêm button "Tạo bằng AI" bên cạnh button "Tạo mới":

```tsx
<button onClick={handleCreateWithAI}>
  <Sparkles className="w-5 h-5" />
  Tạo bằng AI
</button>
```

## 🔄 User Flow

```
1. User click "Tạo bằng AI" trên trang /flashcards
   ↓
2. Navigate to /flashcards/ai-generate
   ↓
3. User nhập:
   - Chủ đề (required)
   - Số lượng flashcards (5-50)
   - Độ khó (easy/medium/hard)
   - Yêu cầu bổ sung (optional)
   ↓
4. Click "Tạo Flashcard"
   ↓
5. Frontend gọi API với saveToDatabase=false
   ↓
6. Backend gọi OpenAI GPT-4
   ↓
7. AI generate flashcard set theo format
   ↓
8. Backend parse và validate JSON
   ↓
9. Return preview data to frontend
   ↓
10. User xem preview:
    - See set title, description, total cards
    - See all flashcards
    - Can edit set info (title, description)
    - Can edit individual cards (front, back, example)
   ↓
11. User có 2 lựa chọn:
    a) "Tạo lại" → Generate new set (back to step 5)
    b) "Lưu Flashcard Set" → Continue to step 12
   ↓
12. Frontend gửi API với:
    - saveToDatabase=true
    - generatedData=(current edited data)
   ↓
13. Backend lưu vào database:
    - Tạo record Flashcard_Set (created_by_type='AI')
    - Tạo records Flashcard
    - Log AI_Interaction
   ↓
14. Navigate to /flashcards/:flashcard_set_id
    (User có thể xem, học, hoặc tiếp tục edit)
```

## 📊 Database Schema

### Flashcard_Set

```sql
flashcard_set_id (PK)
user_id (FK)
title
description
visibility ('public' | 'private')
created_by_type ENUM('admin', 'user', 'AI')  -- Set to 'AI'
total_cards
created_at
updated_at
```

### Flashcard

```sql
flashcard_id (PK)
flashcard_set_id (FK)
front_content
back_content
example
difficulty_level ('easy' | 'medium' | 'hard')
pronunciation
order_index
created_at
updated_at
```

### AI_Interaction

```sql
ai_interaction_id (PK)
user_id (FK)
interaction_type ('flashcard_generation')
user_message ("Generate 10 flashcards about: ...")
ai_response ("Created flashcard set: ...")
context_data (JSON: {topic, cardCount, difficulty})
created_at
```

## 🔐 Authentication & Security

### Token Validation

```javascript
// Frontend check before API call
const token = localStorage.getItem("token");
if (!token) {
  showToast("error", "Vui lòng đăng nhập");
  return;
}

// Handle 401 response
if (response.status === 401) {
  localStorage.removeItem("token");
  showToast("error", "Phiên đăng nhập hết hạn");
  return;
}
```

### Backend Middleware

```javascript
router.post(
  "/api/user/ai/generate-flashcard-set",
  verifyToken, // Verify JWT validity
  requireUser, // Ensure user role
  generateFlashcardSetController,
);
```

## 🎨 UI/UX Features

### Visual Elements

- **Gradient Button:** Purple-to-pink gradient cho AI features
- **Loading States:** Spinner animation khi generating/saving
- **Edit Mode:** Inline editing với Save/Cancel buttons
- **Preview Cards:** Card layout với difficulty badges
- **Responsive Design:** Mobile-friendly layout

### User Feedback

- **Toast Notifications:** Success/error messages
- **Disabled States:** Prevent multiple submissions
- **Validation Messages:** Required field warnings
- **Progress Indicators:** Generating/Saving status

## 🧪 Testing

### Manual Testing Checklist

**Backend:**

- [ ] API generates valid flashcard set with correct format
- [ ] Preview mode returns data without saving
- [ ] Save mode creates database records correctly
- [ ] Edited data is saved properly (not regenerated)
- [ ] AI_Interaction logs are created
- [ ] Token validation works
- [ ] Error handling for invalid topics
- [ ] Error handling for OpenAI API failures

**Frontend:**

- [ ] Form validation works (topic required)
- [ ] Generate button disabled without topic
- [ ] Loading states display correctly
- [ ] Preview renders all flashcards
- [ ] Edit mode works for set info
- [ ] Edit mode works for individual cards
- [ ] Cancel editing restores original data
- [ ] Regenerate creates new flashcard set
- [ ] Save navigates to flashcard detail page
- [ ] Token expiry handling works
- [ ] Error messages display properly

### Test Cases

**Test 1: Basic Generation**

```
Input:
- Topic: "Từ vựng tiếng Anh cơ bản"
- Cards: 10
- Difficulty: medium

Expected:
- Set info has Vietnamese title and description
- 10 flashcards generated
- Each has front_content, back_content, example, difficulty_level
```

**Test 2: Edit and Save**

```
Flow:
1. Generate flashcard set
2. Edit title to "My Custom Title"
3. Edit card #1 front_content to "Custom Front"
4. Click Save

Expected:
- Saved set has title "My Custom Title"
- Card #1 has front_content "Custom Front"
- Not regenerated with AI
```

**Test 3: Regenerate**

```
Flow:
1. Generate flashcard set
2. Click "Tạo lại"
3. New flashcard set generated

Expected:
- Different flashcards than first generation
- Previous edits are lost
```

## ⚙️ Configuration

### Environment Variables

```env
OPENAI_API_KEY=sk-...
```

### Prompt Engineering

Prompt được cấu hình trong `aiService.js`:

```javascript
const prompt = `Bạn là một chuyên gia tạo flashcard...
Topic: ${topic}
Số lượng: ${cardCount}
Độ khó: ${difficulty}
${additionalContext ? `Yêu cầu bổ sung: ${additionalContext}` : ""}

Trả về JSON format: {...}`;
```

## 🚀 Performance Optimization

### Current Implementation

- Single API call for generation
- All flashcards generated in one request
- Client-side state management for edits

### Future Improvements

- [ ] Caching generated results (avoid regeneration)
- [ ] Batch saving for large flashcard sets
- [ ] Background generation for large quantities
- [ ] Save draft flashcard sets (not fully committed)
- [ ] AI quality scoring và suggestions

## 🐛 Known Issues & Limitations

### Current Limitations

1. **API Cost:** Mỗi generation gọi OpenAI API (tốn tiền)
2. **No Draft Mode:** Không lưu draft, phải save hoặc mất
3. **No Undo:** Không có undo sau khi regenerate
4. **Token Length:** GPT-4 có giới hạn token cho response dài

### Error Scenarios

1. **OpenAI API Down:** User sẽ thấy error message "Failed to generate"
2. **Invalid JSON from AI:** Parser sẽ retry hoặc throw error
3. **Token Expired:** Redirect to login
4. **Network Error:** Toast error message

## 📝 Future Enhancements

### Phase 1 (Current)

- ✅ Basic AI generation from topic
- ✅ Preview và edit
- ✅ Save to database

### Phase 2 (Planned)

- [ ] Draft/auto-save functionality
- [ ] Bulk import từ file (CSV/Excel)
- [ ] AI suggestions while editing
- [ ] Multiple templates (vocabulary, Q&A, definition, etc.)
- [ ] AI image generation cho flashcards
- [ ] Speech synthesis cho pronunciation

### Phase 3 (Future)

- [ ] Community sharing của AI-generated sets
- [ ] Rating system cho quality
- [ ] Fine-tuned model cho educational content
- [ ] Multi-language support
- [ ] Integration với spaced repetition algorithm

## 🔗 Related Documentation

- [FLASHCARD_API_GUIDE.md](./FLASHCARD_API_GUIDE.md) - Flashcard API endpoints
- [FLASHCARD_BUSINESS_LOGIC.md](./FLASHCARD_BUSINESS_LOGIC.md) - Business logic
- [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md) - AI Assistant overview

## 💡 Examples

### Example 1: English Vocabulary

```
Topic: "100 từ vựng IELTS band 7+"
Cards: 20
Difficulty: hard
Additional: "Tập trung vào Academic words, có phiên âm IPA"

→ AI sẽ tạo 20 flashcards với từ vựng IELTS, phiên âm, nghĩa, ví dụ
```

### Example 2: Programming Concepts

```
Topic: "JavaScript Array Methods"
Cards: 15
Difficulty: medium
Additional: "Include code examples and use cases"

→ AI tạo flashcards về map, filter, reduce, forEach, etc.
```

### Example 3: History Facts

```
Topic: "Lịch sử Việt Nam thời kỳ phong kiến"
Cards: 25
Difficulty: easy
Additional: "Dành cho học sinh lớp 10"

→ AI tạo flashcards về các sự kiện, nhân vật lịch sử
```

## 📞 Support

Nếu gặp vấn đề:

1. Check logs trong browser console (F12)
2. Check server logs cho OpenAI API errors
3. Verify token validity
4. Check OPENAI_API_KEY environment variable
5. Review AI_Interaction table for error logs

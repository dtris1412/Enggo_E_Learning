# 🎯 AI Flashcard - Hướng dẫn tạo Flashcard Tiếng Anh

## 📚 Tổng quan

Hệ thống AI flashcard đã được **tối ưu hóa đặc biệt cho học tiếng Anh**. AI hiểu rõ bạn đang xây dựng nền tảng luyện thi tiếng Anh và sẽ tạo flashcard phù hợp với:

- ✅ Vocabulary (từ vựng)
- ✅ Phrases & Collocations (cụm từ)
- ✅ Idioms & Expressions (thành ngữ, cách diễn đạt)
- ✅ Grammar points (ngữ pháp)
- ✅ Common exam topics (chủ đề luyện thi IELTS/TOEIC)

## 🎨 Cấu trúc Flashcard Tiếng Anh

### Format chuẩn:

```json
{
  "front_content": "English word/phrase/expression",
  "back_content": "Nghĩa tiếng Việt + giải thích (word type)",
  "example": "Real English sentence example (REQUIRED)",
  "pronunciation": "/IPA phonetic/ or null",
  "difficulty_level": "easy|medium|hard"
}
```

### Ví dụ thực tế:

**1. Từ vựng đơn:**

```
Front: "enthusiastic"
Back: "nhiệt tình, hào hứng (adjective)"
Example: "She's very enthusiastic about her new job."
Pronunciation: "/ɪnˌθjuːziˈæstɪk/"
```

**2. Idiom:**

```
Front: "break the ice"
Back: "phá vỡ sự im lặng, làm tan băng (idiom)"
Example: "He told a joke to break the ice at the meeting."
Pronunciation: null
```

**3. Phrasal verb:**

```
Front: "put off"
Back: "hoãn lại, trì hoãn (phrasal verb)"
Example: "Don't put off until tomorrow what you can do today."
Pronunciation: null
```

**4. Collocation:**

```
Front: "make a decision"
Back: "đưa ra quyết định (collocation)"
Example: "I need to make a decision about my future career."
Pronunciation: null
```

## 💡 Cách sử dụng hiệu quả

### 1. Topic Ideas - Gợi ý chủ đề

#### 📖 Vocabulary Topics (Từ vựng theo chủ đề)

**Beginner (Cơ bản):**

- "Từ vựng về gia đình và người thân"
- "Từ vựng về đồ ăn và thức uống"
- "Từ vựng về màu sắc và số đếm"
- "Từ vựng miêu tả người"
- "Từ vựng về thời tiết"

**Intermediate (Trung cấp):**

- "Từ vựng về công việc và nghề nghiệp"
- "Từ vựng về du lịch và khách sạn"
- "Từ vựng về thể thao và sở thích"
- "Từ vựng về giáo dục và học tập"
- "Từ vựng về công nghệ hiện đại"

**Advanced (Nâng cao):**

- "Từ vựng học thuật IELTS band 7+"
- "Từ vựng về kinh tế và thương mại"
- "Từ vựng về môi trường và biến đổi khí hậu"
- "Từ vựng về y học và sức khỏe"
- "Từ vựng về chính trị và xã hội"

#### 🎭 Idioms & Expressions

- "Idioms về thời tiết phổ biến"
- "Idioms về cảm xúc và tâm trạng"
- "Idioms về tiền bạc và thành công"
- "Expressions trong giao tiếp hàng ngày"
- "Business idioms thường gặp"

#### 🔤 Phrasal Verbs

- "Phrasal verbs về giao tiếp"
- "Phrasal verbs trong công việc"
- "Phrasal verbs về di chuyển"
- "Phrasal verbs về quan hệ xã hội"
- "Phrasal verbs thường gặp trong IELTS"

#### 📝 Grammar Focused

- "Cách dùng thì hiện tại hoàn thành"
- "So sánh hơn và so sánh nhất"
- "Câu điều kiện loại 2 và 3"
- "Modal verbs (can, could, should, must)"
- "Passive voice trong các thì"

#### 🎯 Exam Preparation

**IELTS:**

- "IELTS Writing Task 2 vocabulary - Environment"
- "IELTS Speaking Part 2 - Describe a person"
- "IELTS Reading vocabulary - Education"
- "Từ vựng IELTS band 7-8 về công nghệ"

**TOEIC:**

- "TOEIC Part 3 - Office vocabulary"
- "TOEIC business emails collocations"
- "TOEIC travel and hotel vocabulary"
- "TOEIC financial terms"

### 2. Additional Context - Yêu cầu bổ sung

Thêm thông tin để AI tạo flashcard chính xác hơn:

**Ví dụ tốt:**

```
Topic: "Từ vựng về sức khỏe"
Additional Context: "Tập trung vào từ vựng IELTS Speaking, bao gồm cả phrasal verbs và collocations"
```

```
Topic: "Idioms về thời gian"
Additional Context: "Bao gồm nguồn gốc của idiom, ví dụ trong văn cảnh công việc"
```

```
Topic: "Business vocabulary"
Additional Context: "Level B2, phù hợp cho người đi làm, tập trung vào meetings và presentations"
```

### 3. Card Count - Số lượng flashcard

| Cards | Use case                    | Estimated time |
| ----- | --------------------------- | -------------- |
| 5-10  | Quick review một chủ đề nhỏ | 5-10 phút      |
| 10-20 | Standard set cho một topic  | 15-30 phút     |
| 20-30 | In-depth study              | 30-45 phút     |
| 30-50 | Comprehensive preparation   | 1+ giờ         |

### 4. Difficulty Level

| Level      | Vocabulary                    | Example                                               |
| ---------- | ----------------------------- | ----------------------------------------------------- |
| **Easy**   | Common words, basic phrases   | "happy", "go to school", "thank you"                  |
| **Medium** | Academic, business vocabulary | "enthusiastic", "make a decision", "break the ice"    |
| **Hard**   | Advanced, less common, idioms | "procrastinate", "cut corners", "once in a blue moon" |

## 🎬 Demo Examples

### Example 1: Tạo vocabulary set cơ bản

**Input:**

```
Topic: "Từ vựng về du lịch"
Card count: 15
Difficulty: medium
Additional context: "Tập trung vào các tình huống thực tế tại sân bay, khách sạn, nhà hàng"
```

**Expected output:**

```json
{
  "set_info": {
    "title": "[Tiếng Anh] Từ vựng du lịch thực tế",
    "description": "Bộ flashcard chứa 15 từ vựng thiết yếu cho chuyến du lịch..."
  },
  "flashcards": [
    {
      "front_content": "boarding pass",
      "back_content": "thẻ lên máy bay (noun)",
      "example": "Please show your boarding pass at the gate.",
      "pronunciation": "/ˈbɔːrdɪŋ pæs/",
      "difficulty_level": "medium"
    },
    {
      "front_content": "check in",
      "back_content": "làm thủ tục nhận phòng/check-in (phrasal verb)",
      "example": "We need to check in before 2 PM.",
      "pronunciation": null,
      "difficulty_level": "medium"
    }
    // ... 13 more cards
  ]
}
```

### Example 2: Tạo idioms set nâng cao

**Input:**

```
Topic: "Idioms về thành công"
Card count: 10
Difficulty: hard
Additional context: "Idioms thường dùng trong business English"
```

**Expected output:**

```json
{
  "flashcards": [
    {
      "front_content": "the ball is in your court",
      "back_content": "quyền quyết định thuộc về bạn, đến lượt bạn hành động (idiom)",
      "example": "I've given you all the information, now the ball is in your court.",
      "pronunciation": null,
      "difficulty_level": "hard"
    }
  ]
}
```

### Example 3: IELTS preparation

**Input:**

```
Topic: "IELTS Writing Task 2 - Environment topic"
Card count: 20
Difficulty: hard
Additional context: "Academic vocabulary, collocations, và linking words cho band 7+"
```

**Expected output includes:**

- Academic words: "sustainable", "detrimental", "mitigate"
- Collocations: "environmental degradation", "carbon footprint", "renewable energy"
- Linking phrases: "moreover", "consequently", "in light of"

## 📱 Workflow trong UI

### Bước 1: Nhập thông tin

1. Vào trang Flashcards
2. Click **"Tạo bằng AI"** (nút tím-hồng với icon ✨)
3. Điền form:
   - **Chủ đề**: Nhập topic (xem gợi ý trên)
   - **Số lượng**: 5-50 flashcards
   - **Độ khó**: Easy/Medium/Hard
   - **Yêu cầu thêm**: Context/specific requirements

### Bước 2: Preview & Edit

- Xem flashcard set được tạo
- Edit set info (title, description)
- Edit từng flashcard:
  - Front content
  - Back content
  - Example
  - Pronunciation
- Hoặc click **"Tạo lại"** nếu không hài lòng

### Bước 3: Save

- Click **"Lưu Flashcard Set"**
- Redirect đến flashcard set detail
- Bắt đầu học ngay!

## 🎯 Tips để có flashcard chất lượng cao

### ✅ DO (Nên làm):

1. **Specific topics**
   - ✅ "Từ vựng về khách sạn và booking phòng"
   - ❌ "Từ vựng tiếng Anh" (quá chung chung)

2. **Include context**
   - ✅ "Business idioms cho presentations và meetings"
   - ❌ "Idioms" (thiếu context)

3. **Target your level**
   - Easy: Beginners, elementary learners
   - Medium: Intermediate, preparing for B1-B2 exams
   - Hard: Advanced learners, IELTS 7+, academic English

4. **Combine categories**
   - "Phrasal verbs về công việc (medium difficulty)"
   - "Idioms về cảm xúc + example sentences"
   - "Academic vocabulary IELTS Writing với collocations"

### ❌ DON'T (Không nên):

1. **Quá chung chung**
   - ❌ "Học tiếng Anh"
   - ❌ "Vocabulary"

2. **Không phù hợp với tiếng Anh**
   - ❌ "Lịch sử Việt Nam" (AI sẽ cố tạo nhưng không phù hợp)
   - ❌ "Công thức toán học" (không phải English learning)

3. **Yêu cầu không rõ ràng**
   - ❌ "Nhiều từ vựng"
   - ❌ "Từ khó"

## 🌟 Advanced Features

### Feature 1: Smart Pronunciation

- AI tự động thêm IPA pronunciation cho:
  - Từ vựng khó phát âm
  - Từ không phonetic (không đọc như cách viết)
  - Words có nhiều cách phát âm
- Các idioms, phrases thường không cần pronunciation

### Feature 2: Real Context Examples

- Mỗi flashcard BẮT BUỘC có example sentence
- Examples thực tế, tự nhiên (không formal quá)
- Phù hợp với difficulty level

### Feature 3: Vietnamese Explanations

- Back content luôn có nghĩa tiếng Việt
- Kèm word type: (noun), (verb), (adjective), (idiom), etc.
- Giải thích cách dùng nếu cần

### Feature 4: Exam-focused

- System prompt đã được train với IELTS/TOEIC context
- AI biết vocabulary, phrases thường gặp trong thi
- Collocations phù hợp với academic writing

## 🚀 Next Steps

Sau khi tạo flashcard:

1. **Review & Study**: Sử dụng flashcard set để học
2. **Track Progress**: Theo dõi tiến độ học tập
3. **Share**: Chia sẻ flashcard set tốt (nếu set to public)
4. **Iterate**: Tạo thêm sets cho các topic khác
5. **Mix & Match**: Kết hợp nhiều sets để comprehensive learning

## 💰 Cost Optimization

Với $7 và optimization hiện tại:

- **10 cards**: ~$0.0007/set → ~10,000 sets
- **20 cards**: ~$0.0013/set → ~5,400 sets
- **30 cards**: ~$0.0019/set → ~3,700 sets

**Recommendation**:

- Practice sets: 10-15 cards (nhanh, focused)
- Study sets: 20-30 cards (comprehensive)
- Exam prep: 30-50 cards (in-depth)

## 📞 Support & Feedback

Nếu flashcard không đúng yêu cầu:

1. Click "Tạo lại" để AI generate mới
2. Edit flashcards trong preview mode
3. Thử điều chỉnh Additional Context
4. Thử difficulty level khác

---

**Happy Learning! 🎉**

_"The best flashcards are the ones you actually review. AI helps you create them faster, so you can focus on learning."_

# 🎓 AI Flashcard - Optimization cho Web Luyện Thi Tiếng Anh

## Thay đổi chính

### 1. System Message - Chuyên gia giáo dục tiếng Anh

**Trước:**

```
"Expert educational content creator. Return JSON only."
```

**Sau:**

```
"You are an expert English language educator and IELTS/TOEIC instructor.
Create high-quality flashcards for Vietnamese learners studying English.
Focus on practical vocabulary, phrases, idioms, and expressions commonly
used in exams and real communication. Always provide Vietnamese explanations
and natural English example sentences. Return only valid JSON format."
```

### 2. Prompt Engineering - Tối ưu cho tiếng Anh

**Cải tiến:**

- ✅ Nhấn mạnh đây là nền tảng HỌC TIẾNG ANH
- ✅ Hướng dẫn rõ loại nội dung: vocabulary, phrases, idioms, collocations, grammar, expressions
- ✅ Format chuẩn: Front (English) → Back (Vietnamese + explanation)
- ✅ Example sentence BẮT BUỘC (real English usage)
- ✅ IPA pronunciation cho từ vựng
- ✅ Đưa ra 2 ví dụ flashcard mẫu (vocabulary + idiom)

**Structure mới:**

```
🎯 TẠO FLASHCARD HỌC TIẾNG ANH
📚 Chủ đề: ...
📊 Số lượng: ...
🎚️ Độ khó: ...

📋 HƯỚNG DẪN + ✨ VÍ DỤ + 📤 OUTPUT FORMAT + ⚠️ LƯU Ý
```

## Demo Test Cases

### Test 1: Vocabulary Topic

```
Topic: "Từ vựng về du lịch"
Count: 15
Difficulty: medium
Context: "Tập trung vào sân bay, khách sạn, nhà hàng"
```

**Expected AI Output:**

- Front: "boarding pass", "check in", "room service"...
- Back: Nghĩa tiếng Việt + (noun/verb/phrase)
- Example: Natural English sentences
- Pronunciation: IPA for vocabulary

### Test 2: Idioms

```
Topic: "Idioms về thời gian"
Count: 10
Difficulty: hard
Context: "Business context"
```

**Expected:**

- "once in a blue moon", "in the nick of time", "better late than never"
- Vietnamese meanings + (idiom)
- Business-related examples

### Test 3: IELTS Prep

```
Topic: "IELTS Writing Task 2 - Environment"
Count: 20
Difficulty: hard
Context: "Academic vocabulary band 7+, collocations"
```

**Expected:**

- Academic words: "mitigate", "sustainable", "detrimental"
- Collocations: "carbon footprint", "renewable energy"
- Academic example sentences

## Kết quả mong đợi

### Flashcard structure:

```json
{
  "front_content": "procrastinate",
  "back_content": "trì hoãn, trì trệ (verb)",
  "example": "I tend to procrastinate when I have too much work to do.",
  "pronunciation": "/prəˈkræstɪneɪt/",
  "difficulty_level": "medium"
}

{
  "front_content": "break the ice",
  "back_content": "phá vỡ sự im lặng, làm tan băng (idiom)",
  "example": "He told a joke to break the ice at the meeting.",
  "pronunciation": null,
  "difficulty_level": "medium"
}
```

### Set info:

```json
{
  "title": "[Tiếng Anh] Từ vựng du lịch thực tế",
  "description": "Bộ flashcard chứa 15 từ vựng thiết yếu cho chuyến du lịch, bao gồm các tình huống tại sân bay, khách sạn, và nhà hàng. Phù hợp cho người học trình độ trung cấp chuẩn bị cho chuyến đi hoặc luyện thi TOEIC."
}
```

## 📖 Full Guide

Chi tiết đầy đủ (100+ topic ideas, best practices, examples):

- [AI_FLASHCARD_ENGLISH_LEARNING_GUIDE.md](./AI_FLASHCARD_ENGLISH_LEARNING_GUIDE.md)

## Next Steps

1. **Restart server**:

   ```bash
   cd server
   npm start
   ```

2. **Test với topic tiếng Anh**:
   - "Phrasal verbs về công việc"
   - "Idioms về cảm xúc"
   - "IELTS vocabulary - Education"
   - "Business email expressions"

3. **Verify output**:
   - Front = English content
   - Back = Vietnamese meaning + word type
   - Example = Real English sentence
   - Pronunciation = IPA (cho từ vựng)

4. **Share với học viên**:
   - Hướng dẫn sử dụng topic suggestions
   - Best practices cho flashcard quality
   - Exam preparation tips

---

**Impact**: AI giờ hiểu rõ đây là nền tảng học tiếng Anh cho người Việt, tạo flashcard chuyên nghiệp phù hợp với IELTS/TOEIC preparation! 🎉

# Hướng dẫn tổ chức câu hỏi theo nhóm (Part 3, 4, 6, 7)

## 📋 Tổng quan

Trong TOEIC, một số Part có cấu trúc **gom nhiều câu hỏi vào chung 1 đoạn văn/audio**:

- **Part 3** (Conversations): 1 đoạn hội thoại → 3 câu hỏi
- **Part 4** (Talks): 1 đoạn monologue → 3 câu hỏi
- **Part 6** (Text Completion): 1 đoạn văn → 4 câu hỏi
- **Part 7** (Reading Comprehension): 1 passage → 2-5 câu hỏi

---

## 🏗️ Cấu trúc Database

Hệ thống sử dụng **Container** để nhóm câu hỏi:

```
Exam
  └── Exam_Container (1 passage/conversation)
        ├── content: Nội dung passage/conversation
        ├── instruction: "Questions 32-34"
        ├── audio_url: File audio (nếu listening)
        ├── type: "toeic_group" (nhiều câu chung passage)
        └── Container_Question[] (2-3 câu hỏi)
              ├── Question 1 + 4 Options
              ├── Question 2 + 4 Options
              └── Question 3 + 4 Options
```

**1 Container = 1 Passage = Nhiều Questions**

---

## 🎯 Workflow tạo Part có nhóm câu hỏi

### Ví dụ: Tạo Part 3 - Conversation 1 (Questions 32-34)

#### **Bước 1: Tạo Container cho Conversation**

Vào trang **Exam Detail** → Click **"Add Container"**:

```json
{
  "skill": "listening",
  "type": "toeic_group",
  "order": 3,
  "content": "Questions 32-34 refer to the following conversation.\n\nM: Hi, Sarah. Did you get my email about the marketing budget?\nW: Yes, I did. I think we should increase spending on social media ads.\nM: I agree. Let's schedule a meeting to discuss the details.\nW: How about Thursday at 2 PM?\nM: Perfect. I'll send a calendar invite.",
  "instruction": "Questions 32-34 refer to the following conversation.",
  "audio_url": "https://cloudinary.../part3_conv1.mp3",
  "time_limit": 180
}
```

**Kết quả**: Container ID = 10 (ví dụ)

---

#### **Bước 2: Thêm câu hỏi vào Container**

##### **Cách 1: Thêm từng câu (UI thông thường)**

Click **"Add Question"** trên Container #10:

**Question 32**:

- Question Content: "What are the speakers mainly discussing?"
- Order: 1
- Options:
  - A: Marketing strategies ✅
  - B: Budget cuts
  - C: Office renovations
  - D: Team schedules

**Question 33**:

- Question Content: "What does the woman suggest?"
- Order: 2
- Options: ...

**Question 34**:

- Question Content: "When will the speakers meet?"
- Order: 3
- Options: ...

---

##### **Cách 2: Bulk Import (Nhanh hơn)**

Click **"Bulk"** trên Container #10 → Modal hiện ra:

**Paste data từ Excel/CSV:**

| Question Content                         | Explanation                                       | Order | Image URL | Score | Option A             | Option B                    | Option C           | Option D           | Correct Answer |
| ---------------------------------------- | ------------------------------------------------- | ----- | --------- | ----- | -------------------- | --------------------------- | ------------------ | ------------------ | -------------- |
| What are the speakers mainly discussing? | The conversation focuses on marketing budget.     | 1     |           | 1.0   | Marketing strategies | Budget cuts                 | Office renovations | Team schedules     | A              |
| What does the woman suggest?             | She suggests increasing social media ad spending. | 2     |           | 1.0   | Hiring more staff    | Increasing social media ads | Cutting costs      | Changing suppliers | B              |
| When will the speakers meet?             | They agree on Thursday at 2 PM.                   | 3     |           | 1.0   | Monday morning       | Tuesday afternoon           | Thursday at 2 PM   | Friday evening     | C              |

→ Click **"Import 3 câu hỏi"**

**Kết quả**: 3 câu hỏi được thêm vào Container #10

---

#### **Bước 3: Lặp lại cho các Conversations khác**

**Part 3** có 13 conversations (Questions 32-70):

- Tạo 13 Containers (type: "toeic_group")
- Mỗi Container nhập content (transcript conversation)
- Mỗi Container upload audio riêng
- Mỗi Container bulk import 3 câu hỏi

---

## 📝 Ví dụ khác

### Part 6 - Text Completion

**Container 1: Passage about Email (Questions 131-134)**

```json
{
  "skill": "reading",
  "type": "toeic_group",
  "content": "To: All Staff\nFrom: HR Department\nDate: March 15\nSubject: New Office Policy\n\nDear Colleagues,\n\n---[131]--- to inform you that starting next month, all employees must use the new digital timesheet system. The old paper forms will no longer be accepted.\n\nTraining sessions will be held ---[132]--- the first week of April. Please sign up for a session that fits your schedule.\n\nIf you have any questions, ---[133]--- contact the IT department.\n\nThank you for your ---[134]---.\n\nBest regards,\nHR Team",
  "instruction": "Questions 131-134 refer to the following email.",
  "order": 6
}
```

**4 câu hỏi (131-134)** được bulk import với options để điền vào chỗ trống.

---

### Part 7 - Single Passage

**Container 1: Article about New Product (Questions 147-149)**

```json
{
  "skill": "reading",
  "type": "toeic_group",
  "content": "TechCorp Announces Revolutionary New Smartphone\n\nSan Francisco, March 20 - TechCorp unveiled its latest smartphone model yesterday at a press conference...\n\n(Full article 300-400 words)",
  "instruction": "Questions 147-149 refer to the following article.",
  "order": 7
}
```

**3 câu hỏi (147-149)** về nội dung bài báo.

---

## ✅ Checklist tạo Part có nhóm câu hỏi

### Listening (Part 3, 4)

- [ ] Upload audio cho mỗi conversation/talk
- [ ] Tạo Container với `type: "toeic_group"`
- [ ] Nhập transcript vào `content`
- [ ] Nhập instruction "Questions X-Y refer to..."
- [ ] Gắn `audio_url`
- [ ] Bulk import 3 câu hỏi vào container

### Reading (Part 6, 7)

- [ ] Tạo Container với `type: "toeic_group"`
- [ ] Nhập toàn bộ passage vào `content`
- [ ] Nhập instruction "Questions X-Y refer to the following..."
- [ ] Upload ảnh (nếu có) vào `image_url`
- [ ] Bulk import 2-5 câu hỏi vào container

---

## 🚨 Lưu ý quan trọng

### ❌ SAI:

Tạo 1 Container chung cho cả Part → Import 39 câu hỏi vào (Part 3 có 39 câu)

**Vấn đề**: Tất cả câu hỏi sẽ KHÔNG có passage/audio riêng!

### ✅ ĐÚNG:

Tạo 13 Containers riêng → Mỗi Container có content + audio riêng → Mỗi Container import 3 câu hỏi

**Kết quả**: Mỗi nhóm 3 câu có passage/audio riêng như cấu trúc TOEIC thật

---

## 📊 So sánh 2 loại Container

| Thuộc tính           | `toeic_single`     | `toeic_group`                 |
| -------------------- | ------------------ | ----------------------------- |
| **Ví dụ Part**       | Part 1, 2, 5       | Part 3, 4, 6, 7               |
| **Số câu/Container** | Nhiều câu độc lập  | 2-5 câu chung passage         |
| **Content**          | Hướng dẫn chung    | Full passage/conversation     |
| **Instruction**      | "Questions 7-31"   | "Questions 32-34 refer to..." |
| **Audio**            | 1 file cho cả Part | 1 file cho mỗi conversation   |

---

## 🎓 Best Practices

### 1. Đặt tên Container rõ ràng

- ✅ "Part 3 - Conversation 1 (Q32-34)"
- ✅ "Part 7 - Passage 1 - Email (Q147-149)"
- ❌ "Container 1"

### 2. Nhập đầy đủ content

- Part 3, 4: Nhập transcript đầy đủ
- Part 6, 7: Nhập toàn bộ passage (không tách rời)

### 3. Kiểm tra audio

- Mỗi Container có audio riêng
- Không dùng chung 1 file audio cho nhiều Containers

### 4. Bulk Import hiệu quả

- Chuẩn bị Excel với 3 câu hỏi
- Copy → Paste vào Bulk Import Modal
- Nhanh hơn gõ từng câu

---

## 📞 Hỗ trợ

Nếu cần hỗ trợ thêm về cách tổ chức câu hỏi, vui lòng xem:

- [EXAM_API_EXAMPLES.md](./EXAM_API_EXAMPLES.md) - Ví dụ API đầy đủ
- [EXAM_CREATION_GUIDE.md](./EXAM_CREATION_GUIDE.md) - Hướng dẫn tạo đề thi
- [EXAM_BULK_QUESTION_IMPORT_GUIDE.md](./EXAM_BULK_QUESTION_IMPORT_GUIDE.md) - Chi tiết Bulk Import

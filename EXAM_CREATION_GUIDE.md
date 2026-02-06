# Hướng dẫn tạo đề thi TOEIC và IELTS

## 📋 Tổng quan

Hệ thống hỗ trợ 2 loại đề thi chuẩn quốc tế:

- **TOEIC**: 200 câu hỏi, 7 Parts (Listening + Reading)
- **IELTS**: 40 câu hỏi (Listening + Reading + Writing + Speaking)

---

## 🎯 Flow tạo đề thi TOEIC

### Bước 1: Tạo đề thi cơ bản

**Giao diện**: Exam Management → Thêm đề thi

**Dữ liệu nhập**:

```json
{
  "exam_title": "TOEIC Practice Test #1",
  "exam_type": "TOEIC",
  "exam_duration": 120,
  "certificate_id": 1,
  "source": "ETS Official"
}
```

**Kết quả tự động**:

- `exam_code`: TC123456 (auto-generated)
- `year`: 2026 (current year)
- `total_questions`: 200 (auto-set for TOEIC)

---

### Bước 2: Thêm audio tổng (Listening)

**Giao diện**: Exam Detail → Media đề thi → Thêm media

**Dữ liệu**:

```json
{
  "audio_url": "https://cloudinary.com/.../toeic_listening_full.mp3",
  "duration": 2700
}
```

**Lưu ý**: Audio này là file gộp toàn bộ Listening section (45 phút)

---

### Bước 3: Tạo các Parts

#### **Part 1 - Photographs** (6 câu)

**Container Data**:

```json
{
  "skill": "listening",
  "type": "toeic_single",
  "order": 1,
  "content": "Directions: For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture.",
  "instruction": "Questions 1-6",
  "audio_url": "https://cloudinary.com/.../part1.mp3",
  "time_limit": 5
}
```

**Thêm câu hỏi** (6 câu):

Câu 1:

```json
{
  "question_content": "Look at the picture marked number 1 in your test book.",
  "explanation": "The correct answer describes people in a meeting room.",
  "order": 1,
  "score": 1.0,
  "image_url": "https://cloudinary.com/.../part1_q1.jpg"
}
```

**Thêm đáp án** (4 options cho mỗi câu):

```json
[
  {
    "label": "A",
    "content": "They're sitting at a table.",
    "is_correct": true,
    "order_index": 1
  },
  {
    "label": "B",
    "content": "They're standing in line.",
    "is_correct": false,
    "order_index": 2
  },
  {
    "label": "C",
    "content": "They're leaving the room.",
    "is_correct": false,
    "order_index": 3
  },
  {
    "label": "D",
    "content": "They're entering the building.",
    "is_correct": false,
    "order_index": 4
  }
]
```

Lặp lại cho câu 2-6...

---

#### **Part 2 - Question-Response** (25 câu)

**Container Data**:

```json
{
  "skill": "listening",
  "type": "toeic_single",
  "order": 2,
  "content": "Directions: You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement.",
  "instruction": "Questions 7-31",
  "audio_url": "https://cloudinary.com/.../part2.mp3",
  "time_limit": 10
}
```

**Thêm câu hỏi** (25 câu):

Câu 7:

```json
{
  "question_content": "When is the project deadline?",
  "order": 1,
  "score": 1.0
}
```

**Đáp án**:

```json
[
  {
    "label": "A",
    "content": "Next Friday.",
    "is_correct": true,
    "order_index": 1
  },
  {
    "label": "B",
    "content": "In the conference room.",
    "is_correct": false,
    "order_index": 2
  },
  {
    "label": "C",
    "content": "Yes, it's important.",
    "is_correct": false,
    "order_index": 3
  }
]
```

Lặp lại cho câu 8-31...

---

#### **Part 3 - Conversations** (39 câu, 13 conversations)

**Container 1** (Conversation 1 - Questions 32-34):

```json
{
  "skill": "listening",
  "type": "toeic_group",
  "order": 3,
  "content": "Questions 32-34 refer to the following conversation.\n\nM: Hi, Sarah. Did you get my email about the marketing budget?\nW: Yes, I did. I think we should increase spending on social media ads.\nM: I agree. Let's schedule a meeting to discuss the details.\nW: How about Thursday at 2 PM?\nM: Perfect. I'll send a calendar invite.",
  "instruction": "Questions 32-34",
  "audio_url": "https://cloudinary.com/.../part3_conv1.mp3",
  "time_limit": 2
}
```

**3 câu hỏi cho conversation này**:

Câu 32:

```json
{
  "question_content": "What are the speakers mainly discussing?",
  "order": 1,
  "score": 1.0
}
```

Đáp án:

```json
[
  {
    "label": "A",
    "content": "A marketing budget",
    "is_correct": true,
    "order_index": 1
  },
  {
    "label": "B",
    "content": "A social media platform",
    "is_correct": false,
    "order_index": 2
  },
  {
    "label": "C",
    "content": "An email system",
    "is_correct": false,
    "order_index": 3
  },
  {
    "label": "D",
    "content": "A calendar application",
    "is_correct": false,
    "order_index": 4
  }
]
```

Câu 33:

```json
{
  "question_content": "What does the woman suggest?",
  "order": 2,
  "score": 1.0
}
```

Câu 34:

```json
{
  "question_content": "When will the speakers meet?",
  "order": 3,
  "score": 1.0
}
```

Lặp lại tạo 12 containers nữa cho 12 conversations còn lại (35-70)...

---

#### **Part 4 - Talks** (30 câu, 10 talks)

**Container 1** (Talk 1 - Questions 71-73):

```json
{
  "skill": "listening",
  "type": "toeic_group",
  "order": 4,
  "content": "Questions 71-73 refer to the following announcement.\n\nAttention shoppers. We're pleased to announce a special promotion today only. All electronic items are 30% off the regular price. This includes laptops, tablets, and smartphones. The sale ends at 9 PM tonight. Don't miss this opportunity!",
  "instruction": "Questions 71-73",
  "audio_url": "https://cloudinary.com/.../part4_talk1.mp3",
  "time_limit": 2
}
```

Lặp lại cho 9 talks còn lại (74-100)...

---

#### **Part 5 - Incomplete Sentences** (30 câu)

**Container Data**:

```json
{
  "skill": "reading",
  "type": "toeic_single",
  "order": 5,
  "content": "Directions: A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
  "instruction": "Questions 101-130",
  "time_limit": 15
}
```

**Câu hỏi**:

Câu 101:

```json
{
  "question_content": "The quarterly report ------- submitted by the end of the week.",
  "order": 1,
  "score": 1.0
}
```

Đáp án:

```json
[
  { "label": "A", "content": "must be", "is_correct": true, "order_index": 1 },
  { "label": "B", "content": "must", "is_correct": false, "order_index": 2 },
  {
    "label": "C",
    "content": "must being",
    "is_correct": false,
    "order_index": 3
  },
  {
    "label": "D",
    "content": "must been",
    "is_correct": false,
    "order_index": 4
  }
]
```

Lặp lại cho câu 102-130...

---

#### **Part 6 - Text Completion** (16 câu, 4 passages)

**Container 1** (Passage 1 - Questions 131-134):

```json
{
  "skill": "reading",
  "type": "toeic_group",
  "order": 6,
  "content": "Questions 131-134 refer to the following email.\n\nTo: All Staff\nFrom: Human Resources\nSubject: New Health Insurance Policy\n\nDear Employees,\n\nWe are pleased to ---131--- that our company will be offering a new health insurance plan starting next month. The new plan provides ---132--- coverage at a lower cost. ---133---, all employees will automatically be enrolled unless they choose to opt out. For more information, please ---134--- the HR department.\n\nBest regards,\nHR Team",
  "instruction": "Questions 131-134",
  "time_limit": 5
}
```

**4 câu hỏi**:

Câu 131:

```json
{
  "question_content": "Question 131",
  "order": 1,
  "score": 1.0
}
```

Đáp án:

```json
[
  { "label": "A", "content": "announce", "is_correct": true, "order_index": 1 },
  {
    "label": "B",
    "content": "announces",
    "is_correct": false,
    "order_index": 2
  },
  {
    "label": "C",
    "content": "announced",
    "is_correct": false,
    "order_index": 3
  },
  {
    "label": "D",
    "content": "announcing",
    "is_correct": false,
    "order_index": 4
  }
]
```

Lặp lại cho 3 passages còn lại (135-146)...

---

#### **Part 7 - Reading Comprehension** (54 câu)

**Single Passages** (29 câu):

Container 1 (Questions 147-149):

```json
{
  "skill": "reading",
  "type": "toeic_group",
  "order": 7,
  "content": "Questions 147-149 refer to the following advertisement.\n\nGREEN VALLEY SPA\nRelax and Rejuvenate\n\nEscape to our luxury spa for a day of pampering. We offer:\n• Full body massages\n• Facial treatments\n• Aromatherapy sessions\n• Yoga classes\n\nBook now and receive 20% off your first visit!\nCall 555-0123 or visit www.greenvalleyspa.com\n\nOpen Monday-Saturday: 9 AM - 8 PM\nSunday: 10 AM - 6 PM",
  "instruction": "Questions 147-149",
  "time_limit": 5
}
```

**Double Passages** (20 câu):

Container (Questions 176-180):

```json
{
  "skill": "reading",
  "type": "toeic_group",
  "order": 8,
  "content": "Questions 176-180 refer to the following email and schedule.\n\n[Email]\nFrom: John Smith\nTo: Marketing Team\nSubject: Product Launch Event\n\nTeam,\n\nPlease review the attached schedule for our product launch event next Friday. Make sure to arrive 30 minutes early for setup. Contact me if you have any questions.\n\nJohn\n\n[Schedule]\nProduct Launch Event - Friday, March 15\n8:30 AM - Setup\n9:00 AM - Welcome speech\n9:30 AM - Product demonstration\n10:30 AM - Q&A session\n11:00 AM - Networking lunch",
  "instruction": "Questions 176-180",
  "time_limit": 8
}
```

**Triple Passages** (5 câu):

Container (Questions 196-200):

```json
{
  "skill": "reading",
  "type": "toeic_group",
  "order": 9,
  "content": "Questions 196-200 refer to the following article, email, and invoice.\n\n[Article excerpt]\n[Email]\n[Invoice]\n\n(Content would be 3 related documents)",
  "instruction": "Questions 196-200",
  "time_limit": 10
}
```

---

## 🎯 Flow tạo đề thi IELTS

### Bước 1: Tạo đề thi cơ bản

```json
{
  "exam_title": "IELTS Academic Practice Test #1",
  "exam_type": "IELTS",
  "exam_duration": 180,
  "certificate_id": 2,
  "source": "Cambridge IELTS"
}
```

**Kết quả tự động**:

- `exam_code`: IE123456
- `year`: 2026
- `total_questions`: 40

---

### Bước 2: Listening (40 phút, 40 câu)

#### **Section 1 - Social Context** (10 câu)

```json
{
  "skill": "listening",
  "type": "ielts_passage",
  "order": 1,
  "content": "You will hear a conversation between a student and an accommodation officer about renting an apartment.\n\nOfficer: Good morning. How can I help you?\nStudent: Hi, I'm looking for an apartment near the university...\n\n(Full transcript)",
  "instruction": "Questions 1-10",
  "audio_url": "https://cloudinary.com/.../ielts_listening_section1.mp3",
  "time_limit": 10
}
```

**Câu hỏi** (dạng form completion):

Câu 1:

```json
{
  "question_content": "Name: Sarah ______",
  "order": 1,
  "score": 1.0
}
```

Đáp án:

```json
[{ "label": "A", "content": "Johnson", "is_correct": true, "order_index": 1 }]
```

#### **Section 2 - Social Context** (10 câu)

```json
{
  "skill": "listening",
  "type": "ielts_passage",
  "order": 2,
  "content": "You will hear a tour guide talking about a museum.\n\n(Monologue transcript)",
  "instruction": "Questions 11-20",
  "audio_url": "https://cloudinary.com/.../ielts_listening_section2.mp3",
  "time_limit": 10
}
```

#### **Section 3 - Educational Context** (10 câu)

```json
{
  "skill": "listening",
  "type": "ielts_passage",
  "order": 3,
  "content": "You will hear a conversation between two students discussing their research project.\n\n(Conversation transcript)",
  "instruction": "Questions 21-30",
  "audio_url": "https://cloudinary.com/.../ielts_listening_section3.mp3",
  "time_limit": 10
}
```

#### **Section 4 - Academic Lecture** (10 câu)

```json
{
  "skill": "listening",
  "type": "ielts_passage",
  "order": 4,
  "content": "You will hear a lecture about climate change.\n\n(Lecture transcript)",
  "instruction": "Questions 31-40",
  "audio_url": "https://cloudinary.com/.../ielts_listening_section4.mp3",
  "time_limit": 10
}
```

---

### Bước 3: Reading (60 phút, 40 câu)

#### **Passage 1** (13 câu)

```json
{
  "skill": "reading",
  "type": "ielts_passage",
  "order": 5,
  "content": "THE HISTORY OF CHOCOLATE\n\nChocolate has a long and fascinating history dating back over 3,000 years. The ancient Mayans and Aztecs were among the first to cultivate cacao beans...\n\n(Full passage ~900 words)",
  "instruction": "Questions 1-13",
  "time_limit": 20
}
```

**Dạng câu hỏi**: True/False/Not Given, Multiple Choice, Matching headings

#### **Passage 2** (13 câu)

```json
{
  "skill": "reading",
  "type": "ielts_passage",
  "order": 6,
  "content": "SUSTAINABLE ARCHITECTURE\n\n(Full passage ~900 words)",
  "instruction": "Questions 14-26",
  "time_limit": 20
}
```

#### **Passage 3** (14 câu)

```json
{
  "skill": "reading",
  "type": "ielts_passage",
  "order": 7,
  "content": "THE SCIENCE OF MEMORY\n\n(Full passage ~1000 words)",
  "instruction": "Questions 27-40",
  "time_limit": 20
}
```

---

### Bước 4: Writing (60 phút)

#### **Task 1 - Academic Writing**

```json
{
  "skill": "writing",
  "type": "writing_task",
  "order": 8,
  "content": "The graph below shows the consumption of three different types of energy in the USA from 1980 to 2020.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
  "instruction": "Task 1",
  "image_url": "https://cloudinary.com/.../ielts_writing_task1_graph.jpg",
  "time_limit": 20
}
```

**Lưu ý**: Task 1 không có câu hỏi trắc nghiệm, chỉ cần tạo container để hiển thị đề bài.

#### **Task 2 - Essay Writing**

```json
{
  "skill": "writing",
  "type": "writing_task",
  "order": 9,
  "content": "Some people believe that university students should be required to attend classes. Others believe that going to classes should be optional for students.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
  "instruction": "Task 2",
  "time_limit": 40
}
```

---

### Bước 5: Speaking (11-14 phút)

#### **Part 1 - Introduction**

```json
{
  "skill": "speaking",
  "type": "speaking_part",
  "order": 10,
  "content": "Part 1: Introduction and Interview (4-5 minutes)\n\nThe examiner will ask you general questions about yourself and topics like:\n- Your home\n- Your family\n- Your work/studies\n- Your interests\n\nExample questions:\n1. What do you like about the area where you live?\n2. Do you work or are you a student?\n3. What do you enjoy doing in your free time?",
  "instruction": "Part 1",
  "time_limit": 5
}
```

#### **Part 2 - Individual Long Turn**

```json
{
  "skill": "speaking",
  "type": "speaking_part",
  "order": 11,
  "content": "Part 2: Individual Long Turn (3-4 minutes)\n\nDescribe a memorable trip you have taken.\n\nYou should say:\n- Where you went\n- When you went there\n- What you did during the trip\n- And explain why this trip was memorable\n\nYou will have 1 minute to prepare. You should speak for 1-2 minutes.",
  "instruction": "Part 2",
  "time_limit": 4
}
```

#### **Part 3 - Two-way Discussion**

```json
{
  "skill": "speaking",
  "type": "speaking_part",
  "order": 12,
  "content": "Part 3: Two-way Discussion (4-5 minutes)\n\nThe examiner will ask you abstract questions related to the topic in Part 2.\n\nExample questions:\n1. How has tourism changed in your country in recent years?\n2. What are the benefits and drawbacks of international tourism?\n3. How do you think tourism will develop in the future?",
  "instruction": "Part 3",
  "time_limit": 5
}
```

---

## 📊 Tổng kết số lượng

### TOEIC:

- **Total**: 200 câu hỏi
- **Listening**: 100 câu (4 Parts)
  - Part 1: 6 câu (6 containers đơn)
  - Part 2: 25 câu (1 container)
  - Part 3: 39 câu (13 containers nhóm)
  - Part 4: 30 câu (10 containers nhóm)
- **Reading**: 100 câu (3 Parts)
  - Part 5: 30 câu (1 container)
  - Part 6: 16 câu (4 containers nhóm)
  - Part 7: 54 câu (nhiều containers nhóm)

### IELTS:

- **Total**: 40 câu hỏi trắc nghiệm (Listening + Reading)
- **Listening**: 40 câu (4 sections)
- **Reading**: 40 câu (3 passages)
- **Writing**: 2 tasks (không có câu trắc nghiệm)
- **Speaking**: 3 parts (không có câu trắc nghiệm)

---

## 💡 Lưu ý quan trọng

1. **TOEIC**: Mỗi câu hỏi luôn có 4 đáp án (A, B, C, D)
2. **IELTS**:
   - Listening/Reading có nhiều dạng câu hỏi (Multiple choice, True/False/Not Given, Fill in blanks, Matching)
   - Writing/Speaking chỉ cần tạo container chứa đề bài, không cần câu hỏi trắc nghiệm

3. **Audio URLs**: Cần upload trước lên Cloudinary hoặc server
4. **Image URLs**: Chỉ cần cho TOEIC Part 1 và IELTS Writing Task 1/Reading diagrams
5. **Score**: Mặc định 1.0 cho mỗi câu, có thể điều chỉnh nếu cần
6. **Order**: Phải đánh số liên tục từ 1 để đảm bảo thứ tự hiển thị đúng

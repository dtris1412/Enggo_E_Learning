# API Examples - Tạo đề thi TOEIC và IELTS

## 🔑 Authentication

Tất cả requests cần header:

```
Authorization: Bearer <access_token>
```

---

## 📝 Example 1: Tạo đề thi TOEIC hoàn chỉnh

### Bước 1: Tạo exam

**POST** `/api/admin/exams`

```json
{
  "exam_title": "TOEIC Practice Test #1",
  "exam_type": "TOEIC",
  "exam_duration": 120,
  "certificate_id": 1,
  "source": "ETS Official"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Exam created successfully",
  "data": {
    "exam_id": 1,
    "exam_code": "TC7A8B9C",
    "year": 2026,
    "total_questions": 200,
    ...
  }
}
```

---

### Bước 2: Upload audio tổng cho Listening

**POST** `/api/upload/exam/audio`

```
Content-Type: multipart/form-data

audio: <file: toeic_listening_full.mp3>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../toeic_listening_full.mp3"
  }
}
```

Sau đó tạo exam media:

**POST** `/api/admin/exam-media`

```json
{
  "exam_id": 1,
  "audio_url": "https://res.cloudinary.com/.../toeic_listening_full.mp3",
  "duration": 2700
}
```

---

### Bước 3: Tạo Part 1 - Photographs

#### 3.1. Upload audio cho Part 1

**POST** `/api/upload/exam/audio`

```
audio: <file: part1.mp3>
```

#### 3.2. Tạo container cho Part 1

**POST** `/api/admin/exam-containers`

```json
{
  "exam_id": 1,
  "skill": "listening",
  "type": "toeic_single",
  "order": 1,
  "content": "Directions: For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture.",
  "instruction": "Questions 1-6",
  "audio_url": "https://res.cloudinary.com/.../part1.mp3",
  "time_limit": 5
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "container_id": 1,
    ...
  }
}
```

#### 3.3. Upload hình ảnh cho câu hỏi 1

**POST** `/api/upload/exam/images`

```
Content-Type: multipart/form-data

images: <file: part1_q1.jpg>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "urls": ["https://res.cloudinary.com/.../part1_q1.jpg"]
  }
}
```

#### 3.4. Tạo question

**POST** `/api/admin/questions`

```json
{
  "question_content": "Look at the picture marked number 1 in your test book.",
  "explanation": "The correct answer describes people sitting at a table in a meeting room."
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "question_id": 1
  }
}
```

#### 3.5. Thêm question vào container

**POST** `/api/admin/container-questions`

```json
{
  "container_id": 1,
  "question_id": 1,
  "order": 1,
  "image_url": "https://res.cloudinary.com/.../part1_q1.jpg",
  "score": 1.0
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "container_question_id": 1
  }
}
```

#### 3.6. Thêm 4 đáp án

**POST** `/api/admin/question-options` (4 lần)

Đáp án A:

```json
{
  "container_question_id": 1,
  "label": "A",
  "content": "They're sitting at a table.",
  "is_correct": true,
  "order_index": 1
}
```

Đáp án B:

```json
{
  "container_question_id": 1,
  "label": "B",
  "content": "They're standing in line.",
  "is_correct": false,
  "order_index": 2
}
```

Đáp án C:

```json
{
  "container_question_id": 1,
  "label": "C",
  "content": "They're leaving the room.",
  "is_correct": false,
  "order_index": 3
}
```

Đáp án D:

```json
{
  "container_question_id": 1,
  "label": "D",
  "content": "They're entering the building.",
  "is_correct": false,
  "order_index": 4
}
```

**Lặp lại bước 3.3 - 3.6 cho 5 câu còn lại của Part 1**

---

### Bước 4: Tạo Part 2 - Question-Response

#### 4.1. Upload audio Part 2

**POST** `/api/upload/exam/audio`

#### 4.2. Tạo container

**POST** `/api/admin/exam-containers`

```json
{
  "exam_id": 1,
  "skill": "listening",
  "type": "toeic_single",
  "order": 2,
  "content": "Directions: You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement.",
  "instruction": "Questions 7-31",
  "audio_url": "https://res.cloudinary.com/.../part2.mp3",
  "time_limit": 10
}
```

#### 4.3. Tạo 25 câu hỏi

Mỗi câu hỏi Part 2 chỉ có 3 đáp án (A, B, C):

**Câu 7**:

Question:

```json
{
  "question_content": "When is the project deadline?"
}
```

Add to container:

```json
{
  "container_id": 2,
  "question_id": 7,
  "order": 1,
  "score": 1.0
}
```

Options (3 đáp án):

```json
[
  {
    "container_question_id": 7,
    "label": "A",
    "content": "Next Friday.",
    "is_correct": true,
    "order_index": 1
  },
  {
    "container_question_id": 7,
    "label": "B",
    "content": "In the conference room.",
    "is_correct": false,
    "order_index": 2
  },
  {
    "container_question_id": 7,
    "label": "C",
    "content": "Yes, it's important.",
    "is_correct": false,
    "order_index": 3
  }
]
```

---

### Bước 5: Tạo Part 3 - Conversations

#### 5.1. Tạo container cho conversation 1 (Questions 32-34)

**POST** `/api/admin/exam-containers`

```json
{
  "exam_id": 1,
  "skill": "listening",
  "type": "toeic_group",
  "order": 3,
  "content": "Questions 32-34 refer to the following conversation.\n\nM: Hi, Sarah. Did you get my email about the marketing budget?\nW: Yes, I did. I think we should increase spending on social media ads.\nM: I agree. Let's schedule a meeting to discuss the details.\nW: How about Thursday at 2 PM?\nM: Perfect. I'll send a calendar invite.",
  "instruction": "Questions 32-34",
  "audio_url": "https://res.cloudinary.com/.../part3_conv1.mp3",
  "time_limit": 2
}
```

#### 5.2. Tạo 3 câu hỏi cho conversation này

**Question 32**:

```json
{
  "question_content": "What are the speakers mainly discussing?"
}
```

Add to container + 4 options với label A, B, C, D

**Question 33**:

```json
{
  "question_content": "What does the woman suggest?"
}
```

**Question 34**:

```json
{
  "question_content": "When will the speakers meet?"
}
```

**Lặp lại cho 12 conversations còn lại (Questions 35-70)**

---

### Bước 6: Tạo Part 4 - Talks

Tương tự Part 3, nhưng content là monologue thay vì conversation.

10 containers, mỗi container 3 câu hỏi (Questions 71-100)

---

### Bước 7: Tạo Part 5 - Incomplete Sentences

**POST** `/api/admin/exam-containers`

```json
{
  "exam_id": 1,
  "skill": "reading",
  "type": "toeic_single",
  "order": 5,
  "content": "Directions: A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
  "instruction": "Questions 101-130",
  "time_limit": 15
}
```

Tạo 30 câu hỏi, mỗi câu 4 đáp án.

**Question 101**:

```json
{
  "question_content": "The quarterly report ------- submitted by the end of the week."
}
```

Options:

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

---

### Bước 8: Tạo Part 6 - Text Completion

4 containers (4 passages), mỗi container 4 câu hỏi (Questions 131-146)

**Container 1 (Questions 131-134)**:

```json
{
  "exam_id": 1,
  "skill": "reading",
  "type": "toeic_group",
  "order": 6,
  "content": "Questions 131-134 refer to the following email.\n\nTo: All Staff\nFrom: Human Resources\nSubject: New Health Insurance Policy\n\nDear Employees,\n\nWe are pleased to ---131--- that our company will be offering a new health insurance plan starting next month. The new plan provides ---132--- coverage at a lower cost. ---133---, all employees will automatically be enrolled unless they choose to opt out. For more information, please ---134--- the HR department.\n\nBest regards,\nHR Team",
  "instruction": "Questions 131-134",
  "time_limit": 5
}
```

---

### Bước 9: Tạo Part 7 - Reading Comprehension

Multiple containers cho single passages, double passages, triple passages.

**Single Passage Example (Questions 147-149)**:

```json
{
  "exam_id": 1,
  "skill": "reading",
  "type": "toeic_group",
  "order": 7,
  "content": "Questions 147-149 refer to the following advertisement.\n\nGREEN VALLEY SPA\nRelax and Rejuvenate\n\nEscape to our luxury spa for a day of pampering. We offer:\n• Full body massages\n• Facial treatments\n• Aromatherapy sessions\n• Yoga classes\n\nBook now and receive 20% off your first visit!\nCall 555-0123 or visit www.greenvalleyspa.com\n\nOpen Monday-Saturday: 9 AM - 8 PM\nSunday: 10 AM - 6 PM",
  "instruction": "Questions 147-149",
  "time_limit": 5
}
```

3 câu hỏi cho passage này, mỗi câu 4 đáp án.

---

## 📝 Example 2: Tạo đề thi IELTS

### Bước 1: Tạo exam

**POST** `/api/admin/exams`

```json
{
  "exam_title": "IELTS Academic Practice Test #1",
  "exam_type": "IELTS",
  "exam_duration": 180,
  "certificate_id": 2,
  "source": "Cambridge IELTS"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "exam_id": 2,
    "exam_code": "IE1A2B3C",
    "year": 2026,
    "total_questions": 40
  }
}
```

---

### Bước 2: Listening Section 1

**POST** `/api/admin/exam-containers`

```json
{
  "exam_id": 2,
  "skill": "listening",
  "type": "ielts_passage",
  "order": 1,
  "content": "Section 1\n\nYou will hear a conversation between a student and an accommodation officer about renting an apartment.\n\nQuestions 1-5: Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.\n\nAPARTMENT RENTAL FORM\n\nName: Sarah (1) _______\nCurrent Address: (2) _______ Street\nPhone Number: (3) _______\nPreferred Location: Near the (4) _______\nMaximum Rent: £(5) _______ per month\n\nQuestions 6-10: Choose the correct letter A, B, or C.",
  "instruction": "Questions 1-10",
  "audio_url": "https://res.cloudinary.com/.../ielts_listening_s1.mp3",
  "time_limit": 10
}
```

#### Tạo 10 câu hỏi

**Question 1** (Fill in the blank):

```json
{
  "question_content": "Name: Sarah _______"
}
```

Add to container:

```json
{
  "container_id": 1,
  "question_id": 1,
  "order": 1,
  "score": 1.0
}
```

Option (chỉ 1 đáp án đúng):

```json
{
  "container_question_id": 1,
  "label": "A",
  "content": "Johnson",
  "is_correct": true,
  "order_index": 1
}
```

**Question 6** (Multiple choice):

```json
{
  "question_content": "What type of accommodation does Sarah prefer?"
}
```

Options (3 đáp án):

```json
[
  {
    "label": "A",
    "content": "Studio apartment",
    "is_correct": true,
    "order_index": 1
  },
  {
    "label": "B",
    "content": "Shared house",
    "is_correct": false,
    "order_index": 2
  },
  {
    "label": "C",
    "content": "Dormitory",
    "is_correct": false,
    "order_index": 3
  }
]
```

---

### Bước 3: Reading Passage 1

**POST** `/api/admin/exam-containers`

```json
{
  "exam_id": 2,
  "skill": "reading",
  "type": "ielts_passage",
  "order": 5,
  "content": "THE HISTORY OF CHOCOLATE\n\nA. Chocolate has a long and fascinating history dating back over 3,000 years. The ancient Mayans and Aztecs were among the first to cultivate cacao beans, which they used to make a bitter drink called 'xocolatl'. This beverage was considered sacred and was often used in religious ceremonies.\n\nB. When Spanish conquistadors arrived in the Americas in the 16th century, they brought cacao beans back to Europe. The drink was initially enjoyed only by the wealthy, but over time, sugar was added to make it more palatable to European tastes.\n\nC. The Industrial Revolution brought significant changes to chocolate production. In 1828, Dutch chemist Coenraad van Houten invented a machine that could extract cocoa butter from roasted cacao beans...\n\n(Full passage ~900 words with paragraphs A-H)\n\nQuestions 1-5: The passage has eight paragraphs, A-H. Which paragraph contains the following information?\n\nQuestions 6-9: Do the following statements agree with the information in the passage? Write TRUE, FALSE, or NOT GIVEN.\n\nQuestions 10-13: Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage.",
  "instruction": "Questions 1-13",
  "time_limit": 20
}
```

---

### Bước 4: Writing Tasks

**Task 1**:

```json
{
  "exam_id": 2,
  "skill": "writing",
  "type": "writing_task",
  "order": 8,
  "content": "WRITING TASK 1\n\nYou should spend about 20 minutes on this task.\n\nThe graph below shows the consumption of three different types of energy in the USA from 1980 to 2020.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
  "instruction": "Task 1",
  "image_url": "https://res.cloudinary.com/.../ielts_writing_task1_graph.jpg",
  "time_limit": 20
}
```

**Lưu ý**: Writing tasks không cần tạo questions, chỉ cần container để hiển thị đề bài.

---

### Bước 5: Speaking Parts

**Part 1**:

```json
{
  "exam_id": 2,
  "skill": "speaking",
  "type": "speaking_part",
  "order": 10,
  "content": "SPEAKING PART 1: Introduction and Interview (4-5 minutes)\n\nThe examiner will ask you general questions about yourself and a range of familiar topics, such as home, family, work, studies and interests.\n\nTopic: Your hometown\n- Where is your hometown?\n- What do you like about your hometown?\n- Has your hometown changed much in recent years?\n- Would you like to live there in the future?\n\nTopic: Free time activities\n- What do you like to do in your free time?\n- Do you prefer to spend time alone or with friends?\n- Have your leisure activities changed since you were a child?",
  "instruction": "Part 1",
  "time_limit": 5
}
```

---

## 🔍 Kiểm tra đề thi đã tạo

### Lấy thông tin chi tiết exam

**GET** `/api/admin/exams/:examId/details`

**Response** sẽ bao gồm:

- Thông tin exam
- Tất cả containers
- Tất cả questions trong mỗi container
- Tất cả options cho mỗi question

---

## 📊 API Endpoints Summary

| Method | Endpoint                         | Mục đích                   |
| ------ | -------------------------------- | -------------------------- |
| POST   | `/api/admin/exams`               | Tạo đề thi                 |
| GET    | `/api/admin/exams/:id/details`   | Lấy chi tiết đề thi        |
| POST   | `/api/admin/exam-containers`     | Tạo container/part         |
| POST   | `/api/admin/questions`           | Tạo câu hỏi                |
| POST   | `/api/admin/container-questions` | Thêm câu hỏi vào container |
| POST   | `/api/admin/question-options`    | Tạo đáp án                 |
| POST   | `/api/admin/exam-media`          | Thêm audio tổng            |
| POST   | `/api/upload/exam/audio`         | Upload file audio          |
| POST   | `/api/upload/exam/images`        | Upload hình ảnh            |

---

## 💡 Tips

1. **Thứ tự tạo**: Exam → Containers → Questions → Add to Container → Options
2. **Order field**: Luôn đánh số liên tục để đảm bảo thứ tự hiển thị
3. **Audio**: Upload trước, lưu URL, sau đó dùng URL khi tạo container hoặc media
4. **TOEIC**:
   - Part 1,2,5: type = `toeic_single`, 1 container nhiều câu
   - Part 3,4,6,7: type = `toeic_group`, 1 container cho mỗi nhóm câu
5. **IELTS**:
   - Listening/Reading: type = `ielts_passage`
   - Writing: type = `writing_task`
   - Speaking: type = `speaking_part`

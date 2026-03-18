# EXAM SYSTEM OVERVIEW

Tổng quan về hệ thống thi thử online cho E-Learning Platform.

## Kiến trúc hệ thống

### Database Schema

#### Core Tables:

1. **exams** - Đề thi
   - exam_id (PK)
   - exam_title
   - exam_duration (phút)
   - exam_code (unique)
   - year
   - certificate_id (FK)
   - exam_type (TOEIC/IELTS)
   - source
   - total_questions

2. **exam_medias** - Audio/Media của đề thi
   - media_id (PK)
   - exam_id (FK)
   - audio_url
   - duration

3. **exam_containers** - Nhóm câu hỏi/Đoạn văn/Phần thi
   - container_id (PK)
   - exam_id (FK)
   - skill (listening/reading/writing/speaking)
   - type (toeic_group/toeic_single/ielts_passage/writing_task/speaking_part)
   - order
   - content
   - instruction
   - image_url
   - audio_url
   - time_limit

4. **questions** - Câu hỏi
   - question_id (PK)
   - question_content
   - explanation

5. **container_questions** - Liên kết câu hỏi với container
   - container_question_id (PK)
   - container_id (FK)
   - question_id (FK)
   - order
   - image_url
   - score

6. **question_options** - Đáp án của câu hỏi
   - question_option_id (PK)
   - container_question_id (FK)
   - label (A/B/C/D)
   - content
   - is_correct
   - order_index

7. **user_exams** - Lần thi của user
   - user_exam_id (PK)
   - user_id (FK)
   - exam_id (FK)
   - selected_parts (JSON)
   - started_at
   - submitted_at
   - status (submitted/graded/revised)
   - total_score

8. **user_answers** - Câu trả lời của user
   - user_answer_id (PK)
   - user_exam_id (FK)
   - container_question_id (FK)
   - question_option_id (FK)
   - is_correct

## Chức năng Admin

### Services (server/src/admin/services/)

1. **examService.js** - Quản lý đề thi
   - createExam
   - getExamById
   - getExamsPaginated
   - updateExamById
   - deleteExamById
   - getExamWithDetails

2. **examMediaService.js** - Quản lý audio/media
   - createExamMedia
   - deleteExamMedia
   - getExamMediaByExamId

3. **examContainerService.js** - Quản lý containers
   - createExamContainer
   - updateExamContainer
   - deleteExamContainer
   - getContainersByExamId

4. **questionService.js** - Quản lý câu hỏi
   - createQuestion
   - updateQuestion
   - deleteQuestion

5. **containerQuestionService.js** - Liên kết câu hỏi với container
   - addQuestionToContainer
   - removeQuestionFromContainer
   - updateQuestionOrderInContainer

6. **questionOptionService.js** - Quản lý đáp án
   - createQuestionOption
   - updateQuestionOption
   - deleteQuestionOption

### Controllers (server/src/admin/controllers/)

Các controller tương ứng với từng service, xử lý HTTP requests.

### Routes (server/src/admin/routes/adminRoutes.js)

```
POST   /api/admin/exams
GET    /api/admin/exams/paginated
GET    /api/admin/exams/:exam_id
PUT    /api/admin/exams/:exam_id
DELETE /api/admin/exams/:exam_id
GET    /api/admin/exams/:exam_id/details

POST   /api/admin/exam-containers
PUT    /api/admin/exam-containers/:container_id
DELETE /api/admin/exam-containers/:container_id
GET    /api/admin/exams/:exam_id/containers

POST   /api/admin/questions
PUT    /api/admin/questions/:question_id
DELETE /api/admin/questions/:question_id

POST   /api/admin/container-questions
DELETE /api/admin/container-questions/:container_question_id
PUT    /api/admin/container-questions/:container_question_id

POST   /api/admin/question-options
PUT    /api/admin/question-options/:question_option_id
DELETE /api/admin/question-options/:question_option_id

POST   /api/admin/exam-medias
DELETE /api/admin/exam-medias/:media_id
GET    /api/admin/exams/:exam_id/medias
```

## Chức năng User

### Services (server/src/user/services/)

1. **examService.js** - Xem đề thi
   - getExamsPaginated - Danh sách đề thi
   - getExamById - Thông tin cơ bản
   - getExamForTaking - Lấy đề để làm bài (không có đáp án)
   - getUserExamHistory - Lịch sử thi

2. **userExamService.js** - Làm bài thi
   - startExam - Bắt đầu bài thi
   - saveAnswers - Lưu câu trả lời (có thể gọi nhiều lần)
   - submitExam - Submit và chấm điểm tự động
   - getExamResult - Xem kết quả (có đáp án và giải thích)
   - getExamAttemptDetail - Chi tiết lần thi
   - abandonExam - Hủy bài thi chưa hoàn thành
   - getOngoingExam - Kiểm tra bài thi đang làm

### Controllers (server/src/user/controllers/)

1. **examController.js** - Controllers cho xem đề thi
2. **userExamController.js** - Controllers cho làm bài thi

### Routes (server/src/user/routes/userRoutes.js)

```
# Xem đề thi (Public)
GET /api/user/exams
GET /api/user/exams/:exam_id

# Làm bài thi (Authenticated)
GET    /api/user/exams/:exam_id/take
GET    /api/user/exams/history
POST   /api/user/user-exams/start
POST   /api/user/user-exams/save-answers
POST   /api/user/user-exams/submit
GET    /api/user/user-exams/:user_exam_id/result
GET    /api/user/user-exams/:user_exam_id/detail
DELETE /api/user/user-exams/:user_exam_id/abandon
GET    /api/user/user-exams/ongoing
```

## Quy trình sử dụng

### Admin - Tạo đề thi

1. Tạo Exam → POST /api/admin/exams
2. Upload Audio (nếu có) → POST /api/admin/exam-medias
3. Tạo Containers (từng phần/nhóm câu hỏi) → POST /api/admin/exam-containers
4. Tạo Questions → POST /api/admin/questions
5. Liên kết Questions với Containers → POST /api/admin/container-questions
6. Tạo Options cho từng câu hỏi → POST /api/admin/question-options

### User - Làm bài thi

1. Xem danh sách đề → GET /api/user/exams
2. Xem chi tiết đề → GET /api/user/exams/:exam_id
3. Bắt đầu làm bài → POST /api/user/user-exams/start
4. Lấy đề thi → GET /api/user/exams/:exam_id/take
5. Làm bài và lưu câu trả lời → POST /api/user/user-exams/save-answers (nhiều lần)
6. Submit bài → POST /api/user/user-exams/submit
7. Xem kết quả → GET /api/user/user-exams/:user_exam_id/result

## Tính năng nổi bật

### Auto-grading System

- Tự động chấm điểm ngay sau khi submit
- So sánh câu trả lời của user với đáp án đúng
- Tính tổng điểm dựa trên score của từng câu hỏi

### Progress Saving

- User có thể lưu câu trả lời nhiều lần trong quá trình làm bài
- Nếu đã có câu trả lời cho câu hỏi thì sẽ được cập nhật
- Có thể tiếp tục làm bài nếu chưa submit

### Detailed Results

- Xem đầy đủ câu trả lời, đáp án đúng, và giải thích
- Biết được câu nào đúng, câu nào sai
- Thống kê: tổng số câu, số câu đúng, tỷ lệ đúng

### Flexible Structure

- Hỗ trợ cả TOEIC và IELTS
- Có thể tạo nhiều loại container khác nhau
- Hỗ trợ audio, hình ảnh cho từng câu hỏi
- Có thể set thời gian cho từng phần

## Models sử dụng

```javascript
// Core models
import { Exam } from "../../models/exam.js";
import { Exam_Media } from "../../models/exam_media.js";
import { Exam_Container } from "../../models/exam_container.js";
import { Container_Question } from "../../models/container_question.js";
import { Question } from "../../models/question.js";
import { Question_Option } from "../../models/question_option.js";
import { User_Exam } from "../../models/user_exam.js";
import { User_Answer } from "../../models/user_answer.js";

// Related models
import { Certificate } from "../../models/certificate.js";
import { User } from "../../models/user.js";
```

## Các file đã tạo

### Admin (đã có):

- ✅ server/src/admin/services/examService.js
- ✅ server/src/admin/services/examMediaService.js
- ✅ server/src/admin/services/examContainerService.js
- ✅ server/src/admin/services/containerQuestionService.js
- ✅ server/src/admin/services/questionService.js
- ✅ server/src/admin/services/questionOptionService.js
- ✅ server/src/admin/controllers/examController.js
- ✅ server/src/admin/controllers/examMediaController.js
- ✅ server/src/admin/controllers/examContainerController.js
- ✅ server/src/admin/controllers/containerQuestionController.js
- ✅ server/src/admin/controllers/questionController.js
- ✅ server/src/admin/controllers/questionOptionController.js
- ✅ server/src/admin/routes/adminRoutes.js (đã có routes)

### User (mới tạo):

- ✅ server/src/user/services/examService.js
- ✅ server/src/user/services/userExamService.js
- ✅ server/src/user/controllers/examController.js
- ✅ server/src/user/controllers/userExamController.js
- ✅ server/src/user/routes/userRoutes.js (đã cập nhật)

### Documentation:

- ✅ USER_EXAM_API_GUIDE.md
- ✅ EXAM_SYSTEM_OVERVIEW.md (file này)

## Các bước tiếp theo (tùy chọn)

1. **Frontend Integration**
   - Tạo UI cho admin quản lý đề thi
   - Tạo UI cho user làm bài thi online
   - Timer đếm ngược thời gian làm bài
   - Auto-save câu trả lời

2. **Enhanced Features**
   - Writing/Speaking submission (cho IELTS)
   - AI grading cho writing/speaking
   - Review mode (xem lại đáp án chi tiết)
   - Statistics và analytics
   - Export kết quả ra PDF

3. **Performance**
   - Caching cho đề thi
   - Pagination cho containers/questions
   - Optimize queries

4. **Security**
   - Rate limiting cho submit
   - Prevent cheating
   - Secure audio/image URLs

5. **Testing**
   - Unit tests cho services
   - Integration tests cho APIs
   - Load testing

## Support & Maintenance

Để bảo trì và mở rộng hệ thống:

- Tham khảo USER_EXAM_API_GUIDE.md cho API documentation
- Xem các file service để hiểu business logic
- Xem các file controller để hiểu HTTP handling
- Check routes file để biết các endpoints có sẵn

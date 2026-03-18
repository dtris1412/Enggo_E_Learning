# 🎯 Hướng Dẫn Sử Dụng Bulk Import Questions

## Tổng Quan

Tính năng Bulk Import cho phép admin thêm hàng loạt câu hỏi vào exam container chỉ bằng cách copy-paste từ Excel hoặc CSV file.

## 🚀 Cách Sử Dụng

### Bước 1: Truy cập Exam Detail

1. Đăng nhập với tài khoản admin
2. Vào **Admin Panel** → **Exam Management**
3. Click vào một đề thi để xem chi tiết
4. Tạo hoặc chọn một **Container (Part)** đã có

### Bước 2: Mở Bulk Import Modal

1. Ở mỗi container, click nút **"Bulk"** màu xanh lá
2. Modal "Bulk Import Questions" sẽ hiển thị

### Bước 3: Chọn Format

- **CSV Format**: Comma-separated values (dùng cho file .csv)
- **Excel Paste**: Tab-separated (copy trực tiếp từ Excel)

### Bước 4: Download Template

1. Click **"Download Template"** để tải file mẫu
2. Hoặc click **"Copy Template"** để copy vào clipboard
3. Mở file template trong Excel hoặc text editor

### Bước 5: Điền Dữ Liệu

#### Template Structure:

| Cột | Tên Field        | Bắt Buộc | Ví Dụ                            |
| --- | ---------------- | -------- | -------------------------------- |
| 1   | question_content | ✅       | "What is the capital of France?" |
| 2   | explanation      | ❌       | "Paris is the capital..."        |
| 3   | order            | ✅       | 1, 2, 3...                       |
| 4   | image_url        | ❌       | https://example.com/image.jpg    |
| 5   | score            | ❌       | 1.0 (default)                    |
| 6   | option_a         | ✅       | "London"                         |
| 7   | option_b         | ✅       | "Paris"                          |
| 8   | option_c         | ✅       | "Berlin"                         |
| 9   | option_d         | ✅       | "Madrid"                         |
| 10  | correct_answer   | ✅       | "B"                              |

#### Ví Dụ:

```csv
question_content,explanation,order,image_url,score,option_a,option_b,option_c,option_d,correct_answer
"What is the capital of France?","Paris is the capital and largest city of France.",1,,1.0,London,Paris,Berlin,Madrid,B
"Which planet is red?","Mars is the Red Planet.",2,,1.0,Venus,Mars,Jupiter,Saturn,B
```

### Bước 6: Copy & Paste

1. Điền dữ liệu vào template (Excel hoặc CSV)
2. **Select ALL** (bao gồm header row)
3. Copy (Ctrl+C)
4. Paste vào textarea trong modal (Ctrl+V)

### Bước 7: Validate & Preview

1. Click **"Validate & Preview"**
2. Hệ thống sẽ kiểm tra:
   - Mỗi câu hỏi có nội dung
   - Mỗi câu hỏi có ít nhất 1 đáp án
   - Mỗi câu hỏi có ít nhất 1 đáp án đúng
   - Order là số hợp lệ
3. Nếu có lỗi → sửa lại dữ liệu và validate lại
4. Nếu OK → xem preview các câu hỏi

### Bước 8: Confirm Import

1. Review preview (số câu hỏi, options, points)
2. Click **"Confirm Import"**
3. Chờ hệ thống import (loading indicator)
4. Thông báo thành công → Modal tự đóng sau 2 giây
5. Refresh trang để thấy câu hỏi mới

## 📝 Tips & Best Practices

### 1. Format CSV Đúng

- Cột có dấu phẩy → bọc trong dấu nháy kép `"..."`
- Ví dụ: `"What is 2 + 2, exactly?","It equals 4",1...`

### 2. Format Excel

- Copy trực tiếp từ Excel cells
- Dữ liệu sẽ tự động tab-separated
- Không cần bọc trong dấu nháy

### 3. Correct Answer

- Nhập chính xác: A, B, C, hoặc D (viết hoa)
- Không viết: "Answer A" hoặc "option_a"

### 4. Order Numbers

- Bắt đầu từ 1
- Tăng dần: 1, 2, 3, 4...
- Không nhảy số: 1, 3, 5

### 5. Image URL

- Để trống nếu không có hình
- Nhập full URL: `https://example.com/image.jpg`

### 6. Score

- Mặc định: 1.0
- Có thể custom: 0.5, 1.5, 2.0...

## ⚠️ Common Errors & Solutions

### Error: "Question X must have at least one correct answer"

**Nguyên nhân**: Cột `correct_answer` sai hoặc không match với option labels
**Giải pháp**: Kiểm tra cột correct_answer phải là A, B, C hoặc D (viết hoa)

### Error: "Question X: question_content is required"

**Nguyên nhân**: Nội dung câu hỏi trống
**Giải pháp**: Điền nội dung vào cột `question_content`

### Error: "Parse error"

**Nguyên nhân**: Format CSV/Excel sai
**Giải pháp**:

- Check có đủ 10 cột không
- Check có header row không
- Thử format khác (CSV ↔ Excel)

### Error: "Container not found"

**Nguyên nhân**: Container ID không tồn tại
**Giải pháp**: Refresh trang và thử lại

## 🎓 Ví Dụ Thực Tế: TOEIC Part 5

```csv
question_content,explanation,order,image_url,score,option_a,option_b,option_c,option_d,correct_answer
"The manager asked all employees _____ the meeting room by 2 PM.","'to enter' is the correct infinitive form",1,,1.0,enter,to enter,entering,entered,B
"Our company has _____ expanded to Asia.","'recently' is adverb for present perfect",2,,1.0,recent,recently,more recent,most recently,B
"Please _____ the form carefully.","'fill out' is phrasal verb for completing forms",3,,1.0,fill,fill out,fill in,filled,B
```

## 🔄 Workflow Example

### Scenario: Import 30 câu TOEIC Part 7

1. Tạo Container: "Part 7 - Reading Comprehension"
2. Download CSV template
3. Open trong Excel
4. Điền 30 rows (30 câu hỏi)
5. Select all + Copy
6. Paste vào Bulk Import modal
7. Validate → thấy "30 questions to import"
8. Preview → check random questions
9. Confirm Import
10. ✅ Done! 30 câu đã được thêm vào

**Thời gian**: ~5-10 phút cho 30 câu (vs ~1 giờ nếu thêm thủ công từng câu)

## 🎬 Video Tutorial

[Coming soon - Screen recording demo]

## 📞 Support

Nếu gặp lỗi, liên hệ:

- Admin dashboard → Support ticket
- Email: admin@example.com

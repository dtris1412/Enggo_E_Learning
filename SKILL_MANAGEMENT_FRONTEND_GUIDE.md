# 🎯 Skill Management Frontend - User Guide

## 📋 Tổng quan

Trang quản lý kỹ năng cho phép Admin:

- ✅ Tạo, sửa kỹ năng
- ✅ Liên kết kỹ năng với chứng chỉ (Certificate-Skill)
- ✅ Gán trọng số và mô tả cho từng liên kết
- ✅ Xóa liên kết kỹ năng-chứng chỉ
- ✅ Xem danh sách chứng chỉ liên quan đến mỗi kỹ năng

---

## 🚀 Truy cập

**URL:** `/admin/skills`

**Menu:** Admin Panel → Quản lý lộ trình → Quản lý kỹ năng

---

## 🎨 Giao diện

### 1. Danh sách kỹ năng (Skill List)

```
┌─────────────────────────────────────────────────┐
│ Quản lý kỹ năng              [+ Thêm kỹ năng]  │
├─────────────────────────────────────────────────┤
│ 🔍 Tìm kiếm kỹ năng...                         │
├──┬──────────┬─────────────────┬────────┬────────┤
│ID│ Tên      │ Chứng chỉ       │ Ngày   │ Thao tác│
├──┼──────────┼─────────────────┼────────┼────────┤
│1 │Listening │ IELTS (25%)     │15/1/26 │ ✏️ 🔗  │
│  │          │ TOEIC (25%)     │        │        │
├──┼──────────┼─────────────────┼────────┼────────┤
│2 │Reading   │ Chưa liên kết   │15/1/26 │ ✏️ 🔗  │
└──┴──────────┴─────────────────┴────────┴────────┘
```

**Chức năng:**

- ✏️ **Edit**: Sửa tên kỹ năng
- 🔗 **Link**: Liên kết với chứng chỉ
- 🗑️ **Delete Link**: Xóa liên kết (trong mỗi certificate skill)

---

## 📝 Các chức năng chính

### 1️⃣ Tạo kỹ năng mới

**Bước 1:** Click nút **[+ Thêm kỹ năng]**

**Bước 2:** Điền form:

```
┌─────────────────────────────────────┐
│ Tạo kỹ năng mới                 ✖  │
├─────────────────────────────────────┤
│ Tên kỹ năng *                       │
│ ┌─────────────────────────────────┐ │
│ │ Listening Comprehension         │ │
│ └─────────────────────────────────┘ │
│                                     │
│           [Hủy]  [Tạo kỹ năng]    │
└─────────────────────────────────────┘
```

**Validation:**

- ✅ Tên kỹ năng không được để trống
- ✅ Không trùng tên với kỹ năng đã tồn tại (backend kiểm tra)

---

### 2️⃣ Chỉnh sửa kỹ năng

**Bước 1:** Click icon ✏️ ở hàng kỹ năng cần sửa

**Bước 2:** Sửa tên và lưu:

```
┌─────────────────────────────────────┐
│ Chỉnh sửa kỹ năng              ✖   │
├─────────────────────────────────────┤
│ Tên kỹ năng *                       │
│ ┌─────────────────────────────────┐ │
│ │ Advanced Listening              │ │
│ └─────────────────────────────────┘ │
│                                     │
│           [Hủy]  [Cập nhật]        │
└─────────────────────────────────────┘
```

---

### 3️⃣ Liên kết kỹ năng với chứng chỉ

**Bước 1:** Click icon 🔗 ở kỹ năng cần liên kết

**Bước 2:** Chọn chứng chỉ và điền thông tin:

```
┌──────────────────────────────────────────┐
│ Liên kết chứng chỉ                   ✖  │
│ Kỹ năng: Listening                      │
├──────────────────────────────────────────┤
│ Chọn chứng chỉ *                        │
│ ┌──────────────────────────────────────┐ │
│ │ ▼ IELTS                              │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Trọng số (%) *                          │
│ ┌──────────────────────────────────────┐ │
│ │ 25.0                                 │ │
│ └──────────────────────────────────────┘ │
│ Trọng số của kỹ năng trong chứng chỉ   │
│                                          │
│ Mô tả (tùy chọn)                        │
│ ┌──────────────────────────────────────┐ │
│ │ Listening accounts for 25% of       │ │
│ │ total score...                       │ │
│ └──────────────────────────────────────┘ │
│                                          │
│              [Hủy]  [Liên kết]          │
└──────────────────────────────────────────┘
```

**Validation:**

- ✅ Phải chọn chứng chỉ
- ✅ Trọng số > 0
- ✅ Trọng số ≤ 100
- ✅ Không trùng lặp (cùng certificate_id + skill_id)

**Lưu ý:**

- Modal chỉ hiển thị các chứng chỉ chưa được liên kết
- Nếu tất cả chứng chỉ đã được liên kết → Hiển thị thông báo

---

### 4️⃣ Xóa liên kết Certificate-Skill

**Bước 1:** Trong danh sách kỹ năng, tìm kỹ năng có liên kết

**Bước 2:** Click icon 🗑️ bên cạnh chứng chỉ cần xóa

**Bước 3:** Xác nhận xóa trong popup

```
┌─────────────────────────────────────┐
│ ⚠️ Xác nhận xóa                     │
├─────────────────────────────────────┤
│ Bạn có chắc chắn muốn xóa liên kết │
│ này?                                │
│                                     │
│           [Hủy]  [Xóa]             │
└─────────────────────────────────────┘
```

---

## 🔍 Tìm kiếm

**Cách sử dụng:**

1. Gõ từ khóa vào ô tìm kiếm
2. Hệ thống tự động search sau 300ms (debounce)
3. Kết quả hiển thị theo tên kỹ năng

**Ví dụ:**

- Tìm "list" → Tìm thấy "Listening"
- Tìm "read" → Tìm thấy "Reading"

---

## 📊 Hiển thị dữ liệu

### Structure của Skill với Certificate_Skills:

```json
{
  "skill_id": 1,
  "skill_name": "Listening",
  "created_at": "2026-01-15T00:00:00.000Z",
  "Certificate_Skills": [
    {
      "certificate_skill_id": 1,
      "certificate_id": 1,
      "skill_id": 1,
      "weight": 25.5,
      "description": "Listening section",
      "Certificate": {
        "certificate_id": 1,
        "certificate_name": "IELTS",
        "description": "International English Testing System"
      }
    },
    {
      "certificate_skill_id": 2,
      "certificate_id": 2,
      "skill_id": 1,
      "weight": 25.0,
      "description": "Listening comprehension",
      "Certificate": {
        "certificate_id": 2,
        "certificate_name": "TOEIC"
      }
    }
  ]
}
```

**Cách hiển thị trong UI:**

```
Listening
├─ IELTS
│  ├─ Trọng số: 25.5%
│  └─ Mô tả: Listening section
└─ TOEIC
   ├─ Trọng số: 25.0%
   └─ Mô tả: Listening comprehension
```

---

## 🔄 Flow hoạt động

### Scenario: Tạo IELTS với 4 kỹ năng

**Bước 1: Tạo các kỹ năng**

```
1. Tạo skill "Listening"     → skill_id: 1
2. Tạo skill "Reading"       → skill_id: 2
3. Tạo skill "Writing"       → skill_id: 3
4. Tạo skill "Speaking"      → skill_id: 4
```

**Bước 2: Liên kết với IELTS (certificate_id: 1)**

```
1. Skill "Listening" + IELTS
   - Weight: 25.0
   - Description: "Listening section"

2. Skill "Reading" + IELTS
   - Weight: 25.0
   - Description: "Reading section"

3. Skill "Writing" + IELTS
   - Weight: 25.0
   - Description: "Writing section"

4. Skill "Speaking" + IELTS
   - Weight: 25.0
   - Description: "Speaking section"
```

**Kết quả:**

```
┌────────────────────────────────────────────┐
│ Listening                                  │
│ ├─ IELTS (25%) - Listening section     🗑️ │
├────────────────────────────────────────────┤
│ Reading                                    │
│ ├─ IELTS (25%) - Reading section       🗑️ │
├────────────────────────────────────────────┤
│ Writing                                    │
│ ├─ IELTS (25%) - Writing section       🗑️ │
├────────────────────────────────────────────┤
│ Speaking                                   │
│ ├─ IELTS (25%) - Speaking section      🗑️ │
└────────────────────────────────────────────┘
```

---

## 📂 Files Structure

```
client/src/admin/
├── contexts/
│   └── skillContext.tsx          # State management cho Skill & Certificate-Skill
├── pages/
│   └── SkillManagement.tsx       # Trang chính quản lý kỹ năng
├── components/
│   └── SkillManagement/
│       ├── AddSkillModal.tsx          # Modal tạo skill
│       ├── EditSkillModal.tsx         # Modal sửa skill
│       └── LinkCertificateSkillModal.tsx  # Modal liên kết certificate
└── routes/
    └── AdminRoutes.tsx           # Route config
```

---

## 🔌 API Endpoints sử dụng

### Skill APIs:

```
GET    /api/admin/skills/paginated?search=&limit=10&page=1
GET    /api/admin/skills/:skill_id
POST   /api/admin/skills
PUT    /api/admin/skills/:skill_id
```

### Certificate-Skill APIs:

```
GET    /api/admin/certificate-skills/paginated?certificate_id=&limit=10&page=1
POST   /api/admin/certificate-skills
PUT    /api/admin/certificate-skills/:certificate_skill_id
DELETE /api/admin/certificate-skills/:certificate_skill_id
```

### Certificate APIs (dùng để lấy danh sách):

```
GET    /api/admin/certificates/paginated
```

---

## ⚙️ Context Provider

**skillContext.tsx** cung cấp:

```typescript
{
  // Skill state
  skills: Skill[]
  totalItems: number
  totalPages: number
  currentPage: number
  loading: boolean
  error: string | null

  // Skill functions
  fetchSkills(search?, limit?, page?)
  getSkillById(skill_id)
  createSkill(skill_name)
  updateSkill(skill_id, skill_name)

  // Certificate-Skill state
  certificateSkills: CertificateSkill[]

  // Certificate-Skill functions
  fetchCertificateSkills(certificate_id?, limit?, page?)
  createCertificateSkill(certificate_id, skill_id, weight, description?)
  updateCertificateSkill(certificate_skill_id, skill_id?, certificate_id?, weight?, description?)
  deleteCertificateSkill(certificate_skill_id)
}
```

---

## 🎨 UI Components

### 1. AddSkillModal

- Input: skill_name
- Validation: Không để trống
- Submit → createSkill()

### 2. EditSkillModal

- Props: skill object
- Pre-fill data từ skill
- Submit → updateSkill()

### 3. LinkCertificateSkillModal

- Props: skill object, certificates array
- Auto-filter chứng chỉ đã liên kết
- Input: certificate_id, weight, description
- Validation: weight > 0 && weight <= 100
- Submit → createCertificateSkill()

---

## 🎯 Best Practices

### 1. Tạo skill trước, link sau

```
✅ Đúng:
1. Tạo skill "Listening"
2. Link "Listening" với "IELTS"

❌ Sai:
Không thể link skill chưa tồn tại
```

### 2. Kiểm tra tổng weight

```
Ví dụ: IELTS có 4 kỹ năng
- Listening: 25%
- Reading: 25%
- Writing: 25%
- Speaking: 25%
Tổng: 100% ✅
```

### 3. Xóa link khi không cần

```
- Skill vẫn tồn tại khi xóa link
- Chỉ xóa mối quan hệ certificate-skill
```

---

## 🐛 Troubleshooting

### Lỗi: "Skill already exists"

**Nguyên nhân:** Tên kỹ năng đã tồn tại trong database
**Giải pháp:** Đổi tên khác hoặc sửa skill cũ

### Lỗi: "This skill is already associated with the certificate"

**Nguyên nhân:** Đã tồn tại link giữa skill và certificate này
**Giải pháp:** Sử dụng chức năng Edit thay vì tạo mới

### Lỗi: "Certificate not found" / "Skill not found"

**Nguyên nhân:** ID không tồn tại
**Giải pháp:** Kiểm tra lại certificate_id và skill_id

### Modal không hiển thị certificate

**Nguyên nhân:** Tất cả certificate đã được link
**Giải pháp:** Tạo certificate mới hoặc xóa link cũ

---

## 📱 Responsive Design

- ✅ Desktop: Hiển thị table đầy đủ
- ✅ Tablet: Table scroll ngang
- ✅ Mobile: Sidebar collapse, modals full width

---

## 🔐 Authorization

**Yêu cầu:**

- ✅ Đăng nhập
- ✅ Role = 1 (Admin)
- ✅ Valid JWT token

---

## 🚀 Quick Start

### 1. Đảm bảo backend đang chạy

```bash
cd server
npm run dev
```

### 2. Chạy frontend

```bash
cd client
npm run dev
```

### 3. Truy cập

```
http://localhost:5173/admin/skills
```

### 4. Login với admin account

```
Email: admin@example.com
Password: admin123
```

---

**Version:** 1.0.0  
**Last Updated:** January 15, 2026  
**Author:** Development Team

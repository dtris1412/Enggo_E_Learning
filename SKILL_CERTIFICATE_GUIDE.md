# 📚 Skill & Certificate-Skill Management - Backend Documentation

## 🎯 Tổng quan

Hệ thống quản lý **Skill** và **Certificate-Skill** cho phép:

- Quản lý các kỹ năng (Skills) độc lập
- Liên kết kỹ năng với chứng chỉ thông qua bảng trung gian Certificate-Skill
- Gán trọng số (weight) và mô tả cho từng liên kết

---

## 🏗️ Cấu trúc Database

### Bảng `skills`

```sql
- skill_id (PK)
- skill_name (NOT NULL)
- created_at
- updated_at
```

### Bảng `certificate_skills` (Bảng trung gian)

```sql
- certificate_skill_id (PK)
- certificate_id (FK -> certificates)
- skill_id (FK -> skills)
- weight (DECIMAL(5,2)) - Trọng số của skill trong certificate
- description (TEXT) - Mô tả về vai trò của skill
- created_at
- updated_at
```

### Quan hệ

- **Skill** `hasMany` **Certificate_Skill** (một skill có thể thuộc nhiều certificate)
- **Certificate** `hasMany` **Certificate_Skill** (một certificate có nhiều skills)
- **Certificate_Skill** `belongsTo` **Skill**
- **Certificate_Skill** `belongsTo` **Certificate**

---

## 📋 Flow hoạt động

### 1. Tạo Skill trước

```
POST /api/admin/skills
Body: { skill_name: "Reading Comprehension" }
```

### 2. Tạo Certificate-Skill sau

```
POST /api/admin/certificate-skills
Body: {
  certificate_id: 1,
  skill_id: 1,
  weight: 25.5,
  description: "Reading comprehension accounts for 25.5% of the exam"
}
```

### 3. Hiển thị dữ liệu

- **Khi query Skill**: Tự động include các Certificate liên quan
- **Khi query Certificate**: Tự động include các Skill liên quan
- Cả hai đều qua bảng trung gian `Certificate_Skill`

---

## 🔌 API Endpoints

### Skill Management

#### 1. Get Skills (Paginated)

```
GET /api/admin/skills/paginated?search=reading&limit=10&page=1
Headers: Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Skills retrieved successfully",
  "data": {
    "skills": [
      {
        "skill_id": 1,
        "skill_name": "Reading Comprehension",
        "created_at": "2026-01-15T00:00:00.000Z",
        "Certificate_Skills": [
          {
            "certificate_skill_id": 1,
            "certificate_id": 1,
            "weight": "25.50",
            "description": "Core reading skill",
            "Certificate": {
              "certificate_id": 1,
              "certificate_name": "IELTS",
              "description": "International English Testing System"
            }
          }
        ]
      }
    ],
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

#### 2. Get Skill by ID

```
GET /api/admin/skills/:skill_id
Headers: Authorization: Bearer <token>
```

#### 3. Create Skill

```
POST /api/admin/skills
Headers: Authorization: Bearer <token>
Body: {
  "skill_name": "Listening Comprehension"
}
```

#### 4. Update Skill

```
PUT /api/admin/skills/:skill_id
Headers: Authorization: Bearer <token>
Body: {
  "skill_name": "Advanced Listening"
}
```

---

### Certificate-Skill Management

#### 1. Get Certificate-Skills (Paginated)

```
GET /api/admin/certificate-skills/paginated?certificate_id=1&limit=10&page=1
Headers: Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Certificate-Skill associations retrieved successfully",
  "data": {
    "certificateSkills": [
      {
        "certificate_skill_id": 1,
        "certificate_id": 1,
        "skill_id": 1,
        "weight": "25.50",
        "description": "Reading comprehension component",
        "Certificate": {
          "certificate_id": 1,
          "certificate_name": "IELTS",
          "description": "International English Testing System"
        },
        "Skill": {
          "skill_id": 1,
          "skill_name": "Reading Comprehension"
        }
      }
    ],
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

#### 2. Get Certificate-Skill by ID

```
GET /api/admin/certificate-skills/:certificate_skill_id
Headers: Authorization: Bearer <token>
```

#### 3. Create Certificate-Skill

```
POST /api/admin/certificate-skills
Headers: Authorization: Bearer <token>
Body: {
  "certificate_id": 1,
  "skill_id": 2,
  "weight": 25.0,
  "description": "Listening accounts for 25% of total score"
}
```

**Validations:**

- ✅ Kiểm tra Certificate tồn tại
- ✅ Kiểm tra Skill tồn tại
- ✅ Kiểm tra duplicate (certificate + skill đã liên kết)

#### 4. Update Certificate-Skill

```
PUT /api/admin/certificate-skills/:certificate_skill_id
Headers: Authorization: Bearer <token>
Body: {
  "weight": 30.0,
  "description": "Updated weight to 30%"
}
```

#### 5. Delete Certificate-Skill

```
DELETE /api/admin/certificate-skills/:certificate_skill_id
Headers: Authorization: Bearer <token>
```

---

## 🔍 Query với Include

### Khi query Certificate

```javascript
const certificate = await db.Certificate.findByPk(certificate_id, {
  include: [
    {
      model: db.Certificate_Skill,
      as: "Certificate_Skills",
      include: [
        {
          model: db.Skill,
          attributes: ["skill_id", "skill_name"],
        },
      ],
    },
  ],
});
```

**Kết quả:**

```json
{
  "certificate_id": 1,
  "certificate_name": "IELTS",
  "Certificate_Skills": [
    {
      "certificate_skill_id": 1,
      "weight": "25.50",
      "Skill": {
        "skill_id": 1,
        "skill_name": "Reading"
      }
    }
  ]
}
```

### Khi query Skill

```javascript
const skill = await db.Skill.findByPk(skill_id, {
  include: [
    {
      model: db.Certificate_Skill,
      as: "Certificate_Skills",
      include: [
        {
          model: db.Certificate,
          attributes: ["certificate_id", "certificate_name"],
        },
      ],
    },
  ],
});
```

**Kết quả:**

```json
{
  "skill_id": 1,
  "skill_name": "Reading Comprehension",
  "Certificate_Skills": [
    {
      "certificate_skill_id": 1,
      "weight": "25.50",
      "Certificate": {
        "certificate_id": 1,
        "certificate_name": "IELTS"
      }
    }
  ]
}
```

---

## 🎨 Use Cases

### Scenario 1: Tạo IELTS Certificate với 4 skills

```javascript
// 1. Tạo các skills trước
POST /api/admin/skills { skill_name: "Listening" }  // skill_id: 1
POST /api/admin/skills { skill_name: "Reading" }    // skill_id: 2
POST /api/admin/skills { skill_name: "Writing" }    // skill_id: 3
POST /api/admin/skills { skill_name: "Speaking" }   // skill_id: 4

// 2. Tạo certificate (giả sử certificate_id = 1)

// 3. Liên kết skills với certificate
POST /api/admin/certificate-skills
{
  "certificate_id": 1,
  "skill_id": 1,
  "weight": 25.0,
  "description": "Listening section"
}

POST /api/admin/certificate-skills
{
  "certificate_id": 1,
  "skill_id": 2,
  "weight": 25.0,
  "description": "Reading section"
}

// ... tương tự cho Writing và Speaking
```

### Scenario 2: Hiển thị tất cả skills của IELTS

```javascript
GET / api / admin / certificates / 1;
// Response sẽ bao gồm tất cả skills với weight và description
```

### Scenario 3: Tìm tất cả certificates có skill "Reading"

```javascript
GET / api / admin / skills / 2;
// Response sẽ bao gồm tất cả certificates liên kết với skill này
```

---

## ✅ Những gì đã được sửa

### 1. **Sửa lỗi tên cột**

- ❌ `skil_name` → ✅ `skill_name`
- ❌ `skil_id` → ✅ `skill_id`

### 2. **Thêm validation đầy đủ**

- ✅ Kiểm tra Certificate tồn tại khi tạo Certificate-Skill
- ✅ Kiểm tra Skill tồn tại khi tạo Certificate-Skill
- ✅ Kiểm tra duplicate association

### 3. **Thêm CRUD đầy đủ cho Certificate-Skill**

- ✅ Create
- ✅ Read (Get by ID, Get Paginated)
- ✅ Update
- ✅ Delete

### 4. **Thêm Include Associations**

- ✅ Skill query tự động include Certificates
- ✅ Certificate query tự động include Skills
- ✅ Certificate-Skill query include cả hai

### 5. **Thêm timestamps**

- ✅ `updated_at` được cập nhật khi update

---

## 🚀 Testing

### Test Create Flow

```bash
# 1. Tạo skill
curl -X POST http://localhost:3000/api/admin/skills \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"skill_name":"Reading Comprehension"}'

# 2. Tạo certificate-skill link
curl -X POST http://localhost:3000/api/admin/certificate-skills \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "certificate_id": 1,
    "skill_id": 1,
    "weight": 25.5,
    "description": "Core reading skill"
  }'

# 3. Query skill with certificates
curl http://localhost:3000/api/admin/skills/1 \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Notes

- **Weight**: Sử dụng DECIMAL(5,2) cho phép giá trị từ 0.00 đến 999.99
- **Cascade Delete**: Khi xóa Certificate hoặc Skill, các liên kết trong Certificate_Skill sẽ tự động bị xóa (CASCADE)
- **Unique Constraint**: Mỗi cặp (certificate_id, skill_id) chỉ tồn tại một lần
- **Alias**: Sử dụng `as: "Certificate_Skills"` để query dễ dàng hơn

---

## 🔐 Authorization

Tất cả endpoints yêu cầu:

- ✅ Valid JWT token
- ✅ Admin role (`requireAdmin` middleware)

---

## 🐛 Common Errors

### 1. "Skill already exists"

- Kiểm tra trùng lặp `skill_name` khi tạo mới

### 2. "This skill is already associated with the certificate"

- Một skill chỉ có thể link với một certificate một lần
- Sử dụng UPDATE thay vì tạo mới

### 3. "Certificate not found" / "Skill not found"

- Đảm bảo certificate_id và skill_id tồn tại trước khi tạo liên kết

---

**Last Updated:** January 15, 2026
**Version:** 1.0.0

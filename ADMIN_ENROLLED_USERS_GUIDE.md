# Hướng Dẫn - Hiển Thị Số Người Học (Admin)

## Tổng Quan

Đã thêm tính năng hiển thị số lượng người học cho:

- **Quản lý Khóa học** (Course Management)
- **Quản lý Lộ trình** (Roadmap Management)
- **Dashboard - Top Courses & Roadmaps**

---

## 1. Quản Lý Khóa Học

### API: Get Course By ID

```http
GET /api/admin/courses/:course_id
```

**Response:**

```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "course_id": 1,
    "course_title": "React Fundamentals",
    "description": "Learn React from scratch",
    "course_level": "beginner",
    "enrolled_users_count": 145 // ← SỐ NGƯỜI HỌC
    // ... các field khác
  }
}
```

### API: Get Courses Paginated

```http
GET /api/admin/courses?page=1&limit=10&search=react
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "course_id": 1,
      "course_title": "React Fundamentals",
      "enrolled_users_count": 145 // ← SỐ NGƯỜI HỌC
      // ...
    }
  ],
  "total": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

---

## 2. Quản Lý Lộ Trình

### API: Get Roadmap By ID

```http
GET /api/admin/roadmaps/:roadmap_id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "roadmap_id": 1,
    "roadmap_title": "Full Stack Developer",
    "enrolled_users_count": 67, // ← SỐ NGƯỜI HỌC
    "Phases": [
      /* ... */
    ]
  }
}
```

### API: Get Roadmaps Paginated

```http
GET /api/admin/roadmaps?page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "roadmap_id": 1,
      "roadmap_title": "Full Stack Developer",
      "enrolled_users_count": 67 // ← SỐ NGƯỜI HỌC
      // ...
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

## 3. Dashboard Statistics

### API: Get Dashboard Statistics

```http
GET /api/admin/dashboard/statistics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeCourses": 45,
    "testStatistics": {
      /* ... */
    },

    // TOP 5 KHÓA HỌC
    "topCourses": [
      {
        "course_id": 5,
        "course_title": "JavaScript Master Class",
        "course_level": "advanced",
        "enrolled_users_count": 234, // Nhiều nhất
        "course_status": true
        // ... các field khác
      }
      // ... 4 khóa học khác
    ],

    // TOP 5 LỘ TRÌNH
    "topRoadmaps": [
      {
        "roadmap_id": 3,
        "roadmap_title": "Full Stack Developer Path",
        "roadmap_level": "intermediate",
        "enrolled_users_count": 156, // Nhiều nhất
        "roadmap_status": true
        // ... các field khác
      }
      // ... 4 lộ trình khác
    ]
  }
}
```

---

## 4. Frontend Implementation

### Hiển thị trong Table (Course/Roadmap Management)

```tsx
// Components table
<TableCell>
  <div className="flex items-center gap-2">
    <Users className="h-4 w-4 text-blue-500" />
    <span className="font-semibold">{course.enrolled_users_count || 0}</span>
    <span className="text-sm text-gray-500">người học</span>
  </div>
</TableCell>
```

### Dashboard - Top Courses Widget

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Trophy className="h-5 w-5 text-yellow-500" />
      Top Khóa Học Phổ Biến
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {dashboardData.topCourses?.map((course, index) => (
        <div key={course.course_id} className="flex items-center gap-3">
          {/* Ranking Badge */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              index === 0
                ? "bg-yellow-100 text-yellow-700"
                : index === 1
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gray-50 text-gray-600"
            }`}
          >
            #{index + 1}
          </div>

          {/* Course Info */}
          <div className="flex-1">
            <h4 className="font-medium">{course.course_title}</h4>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-3.5 w-3.5" />
              <span className="font-semibold text-blue-600">
                {course.enrolled_users_count}
              </span>
              <span className="text-gray-500">người học</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

### Dashboard - Top Roadmaps Widget

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Map className="h-5 w-5 text-indigo-500" />
      Top Lộ Trình Phổ Biến
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {dashboardData.topRoadmaps?.map((roadmap, index) => (
        <div key={roadmap.roadmap_id} className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              index === 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-50"
            }`}
          >
            #{index + 1}
          </div>

          <div className="flex-1">
            <h4 className="font-medium">{roadmap.roadmap_title}</h4>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span className="font-semibold text-green-600">
                {roadmap.enrolled_users_count}
              </span>
              <span className="text-gray-500">đang học</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## 5. Cơ Chế Hoạt Động

### Database Query

Sử dụng Sequelize literal subquery để đếm DISTINCT users:

**Courses:**

```sql
SELECT
  Course.*,
  (SELECT COUNT(DISTINCT user_id)
   FROM user_courses
   WHERE user_courses.course_id = Course.course_id
  ) AS enrolled_users_count
FROM courses AS Course
ORDER BY enrolled_users_count DESC;
```

**Roadmaps:**

```sql
SELECT
  Roadmap.*,
  (SELECT COUNT(DISTINCT user_id)
   FROM user_roadmaps
   WHERE user_roadmaps.roadmap_id = Roadmap.roadmap_id
  ) AS enrolled_users_count
FROM roadmaps AS Roadmap
ORDER BY enrolled_users_count DESC;
```

### Bảng Liên Quan

- `user_courses` - Lưu thông tin user đã đăng ký khóa học
- `user_roadmaps` - Lưu thông tin user đã theo học lộ trình

---

## 6. Testing

### Test API Endpoints

```bash
# 1. Get course with enrollment count
curl http://localhost:5000/api/admin/courses/1

# 2. Get courses paginated
curl http://localhost:5000/api/admin/courses?page=1&limit=10

# 3. Get roadmap with enrollment count
curl http://localhost:5000/api/admin/roadmaps/1

# 4. Get roadmaps paginated
curl http://localhost:5000/api/admin/roadmaps?page=1&limit=10

# 5. Get dashboard statistics
curl http://localhost:5000/api/admin/dashboard/statistics
```

### Expected Results

✅ Mỗi course có field `enrolled_users_count`  
✅ Mỗi roadmap có field `enrolled_users_count`  
✅ Dashboard có `topCourses` (top 5)  
✅ Dashboard có `topRoadmaps` (top 5)  
✅ Sắp xếp theo số người học giảm dần

---

## 7. Performance Optimization

### Recommended Indexes

```sql
-- Index cho user_courses
CREATE INDEX idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);

-- Index cho user_roadmaps
CREATE INDEX idx_user_roadmaps_roadmap_id ON user_roadmaps(roadmap_id);
CREATE INDEX idx_user_roadmaps_user_id ON user_roadmaps(user_id);
```

---

## 8. Troubleshooting

### Issue: enrolled_users_count = 0

**Nguyên nhân:** Không có data trong `user_courses` hoặc `user_roadmaps`

**Giải pháp:** Thêm test data:

```sql
INSERT INTO user_courses (user_id, course_id, started_at, progress_percentage, is_completed)
VALUES (1, 1, NOW(), 0, false);

INSERT INTO user_roadmaps (user_id, roadmap_id, started_at, progress_percentage, is_completed)
VALUES (1, 1, NOW(), 0, false);
```

### Issue: Query quá chậm

**Nguyên nhân:** Thiếu index

**Giải pháp:** Tạo index như mục 7

---

**Tài liệu được tạo:** March 12, 2026  
**Trạng thái:** ✅ Production Ready

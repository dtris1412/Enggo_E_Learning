# Report Management - Date Range Filter & Pagination Guide

## 📋 Tổng quan

Hệ thống báo cáo đã được nâng cấp với các tính năng:

- ✅ **Phân trang**: Hỗ trợ xuất dữ liệu với pagination (page, limit)
- ✅ **Lọc theo ngày**: Lọc dữ liệu theo khoảng thời gian (from_date, to_date)
- ✅ **Quick Export**: Xuất nhanh với bộ lọc tùy chỉnh
- ✅ **Report Management**: Tạo báo cáo lưu vào database

---

## 🛠️ Backend API

### 1. Quick Export Endpoints

Tất cả 6 endpoints export hỗ trợ các query parameters sau:

```
GET /api/admin/{type}/export?from_date=2026-01-01&to_date=2026-02-10&page=1&limit=1000
```

**Supported types:**

- `courses` - Khóa học
- `lessons` - Bài học
- `exams` - Đề thi
- `blogs` - Tin tức
- `documents` - Tài liệu
- `roadmaps` - Lộ trình

**Query Parameters:**

- `from_date` (optional): Ngày bắt đầu (format: YYYY-MM-DD)
- `to_date` (optional): Ngày kết thúc (format: YYYY-MM-DD)
- `page` (optional, default: 1): Trang hiện tại
- `limit` (optional, default: 1000): Số bản ghi tối đa
- Các filters khác theo từng loại (course_status, exam_type, blog_status, etc.)

### 2. Report Generation Endpoint

```
POST /api/admin/reports/generate
```

**Request Body:**

```json
{
  "report_name": "Báo cáo khóa học tháng 2/2026",
  "report_type": "courses",
  "filters": {
    "from_date": "2026-02-01",
    "to_date": "2026-02-10",
    "page": 1,
    "limit": 1000,
    "course_status": true
  }
}
```

---

## 🎨 Frontend Components

### 1. DateRangeFilter Component

Component lọc theo khoảng thời gian với quick select buttons.

**Location:** `client/src/admin/components/ReportManagement/DateRangeFilter.tsx`

**Props:**

```typescript
interface DateRangeFilterProps {
  onFilterChange: (filters: { from_date?: string; to_date?: string }) => void;
  className?: string;
}
```

**Usage Example:**

```tsx
import { DateRangeFilter } from "../components/ReportManagement";

const [filters, setFilters] = useState({});

<DateRangeFilter
  onFilterChange={(dateFilters) => {
    setFilters({ ...filters, ...dateFilters });
  }}
  className="ml-auto"
/>;
```

**Features:**

- Quick select: Hôm nay, 7 ngày, 30 ngày, 1 năm
- Custom date range picker
- Clear filters button
- Auto-close dropdown

### 2. ExportButton Component

Component xuất Excel với filters tùy biến.

**Location:** `client/src/admin/components/ExportButton.tsx`

**Props:**

```typescript
interface ExportButtonProps {
  type:
    | "users"
    | "courses"
    | "lessons"
    | "exams"
    | "blogs"
    | "documents"
    | "roadmaps";
  filters?: any;
  label?: string;
  className?: string;
}
```

**Usage Example:**

```tsx
import ExportButton from "../components/ExportButton";

const [filters, setFilters] = useState({});

<ExportButton type="courses" filters={filters} label="Xuất Excel" />;
```

### 3. AddReportModal Component

Modal tạo báo cáo với date range và pagination options.

**Features:**

- Date range picker (Từ ngày - Đến ngày)
- Pagination options (Limit: 100, 500, 1K, 5K, 10K)
- Page number selector
- Auto-clean empty filters

---

## 📖 Integration Guide

### Step 1: Import Components

```tsx
import ExportButton from "../components/ExportButton";
import { DateRangeFilter } from "../components/ReportManagement";
```

### Step 2: Setup State

```tsx
const [filters, setFilters] = useState<any>({});
const [dateFilters, setDateFilters] = useState<{
  from_date?: string;
  to_date?: string;
}>({});
```

### Step 3: Add DateRangeFilter to Toolbar

```tsx
<div className="flex items-center gap-3">
  {/* Search, other filters */}

  <DateRangeFilter
    onFilterChange={(dates) => {
      setDateFilters(dates);
      setFilters({ ...filters, ...dates });
    }}
  />

  <ExportButton
    type="courses"
    filters={{ ...filters, ...dateFilters }}
    label="Xuất Excel"
  />
</div>
```

### Step 4: Update Existing Filters

When user changes status, category, or other filters:

```tsx
// Option 1: Merge with existing filters
const handleStatusChange = (status: boolean) => {
  setFilters({
    ...filters,
    ...dateFilters, // Keep date filters
    course_status: status,
  });
};

// Option 2: Use useState hook
const [courseStatus, setCourseStatus] = useState<boolean | undefined>();

<ExportButton
  type="courses"
  filters={{
    course_status: courseStatus,
    ...dateFilters,
  }}
/>;
```

---

## 💡 Best Practices

### 1. Always Merge Date Filters

```tsx
// ✅ GOOD
const combinedFilters = {
  ...statusFilters,
  ...dateFilters,
  ...paginationOptions,
};

// ❌ BAD - Date filters will be lost
const combinedFilters = statusFilters;
```

### 2. Default Pagination

```tsx
// Set reasonable defaults
const [pagination, setPagination] = useState({
  page: 1,
  limit: 1000, // Default 1000 records
});
```

### 3. Filter State Management

```tsx
// Keep date filters separate from other filters
const [dateRange, setDateRange] = useState({});
const [statusFilters, setStatusFilters] = useState({});

// Combine when exporting
const exportFilters = {
  ...statusFilters,
  ...dateRange,
};
```

### 4. Clear Filters

```tsx
const handleClearAll = () => {
  setFilters({});
  setDateFilters({});
  // Trigger re-fetch
};
```

---

## 📊 Example: CourseManagement Integration

```tsx
import { useState } from "react";
import ExportButton from "../components/ExportButton";
import { DateRangeFilter } from "../components/ReportManagement";

const CourseManagement = () => {
  const [search, setSearch] = useState("");
  const [courseStatus, setCourseStatus] = useState<boolean | undefined>();
  const [dateFilters, setDateFilters] = useState({});

  // Combine all filters for export
  const exportFilters = {
    search,
    course_status: courseStatus,
    ...dateFilters,
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-4 py-2"
        />

        <select
          value={courseStatus?.toString() || ""}
          onChange={(e) =>
            setCourseStatus(
              e.target.value === "" ? undefined : e.target.value === "true",
            )
          }
          className="rounded-lg border px-4 py-2"
        >
          <option value="">Tất cả</option>
          <option value="true">Hoạt động</option>
          <option value="false">Khóa</option>
        </select>

        <DateRangeFilter onFilterChange={setDateFilters} className="ml-auto" />

        <ExportButton
          type="courses"
          filters={exportFilters}
          label="Xuất Excel"
        />
      </div>

      {/* Course table... */}
    </div>
  );
};
```

---

## 🔍 Troubleshooting

### Issue: Date filters not applied

**Solution:** Make sure to merge date filters with other filters:

```tsx
const allFilters = { ...statusFilters, ...dateFilters };
```

### Issue: Export returns all data ignoring filters

**Solution:** Check if filters object is being passed correctly to ExportButton:

```tsx
<ExportButton type="courses" filters={allFilters} />
// not
<ExportButton type="courses" /> // Missing filters prop
```

### Issue: Pagination not working

**Solution:** Ensure page and limit are numbers, not strings:

```tsx
filters: {
  page: parseInt(page),
  limit: parseInt(limit),
}
```

---

## 📝 Notes

1. **Date Format**: Backend expects ISO format `YYYY-MM-DD`
2. **Default Limit**: 1000 records if not specified
3. **Empty Filters**: Backend handles empty filters gracefully
4. **Sequelize Operators**: Uses `Op.between`, `Op.gte`, `Op.lte` for date ranges
5. **Performance**: Large datasets may take longer to export - consider using pagination

---

## 🚀 Next Steps

1. Test date range filtering on all management pages
2. Add date range to Quick Export buttons
3. Monitor export performance with large datasets
4. Consider adding export progress indicator
5. Add export history tracking

---

**Last Updated:** February 10, 2026  
**Version:** 1.0.0

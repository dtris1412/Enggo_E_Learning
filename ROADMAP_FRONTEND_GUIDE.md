# Quản Lý Lộ Trình (Roadmap Management) - Frontend

## Tóm tắt

Đã xây dựng hoàn chỉnh phần frontend cho quản lý lộ trình (roadmap), bao gồm context, pages và components tương tác với backend API.

## Các file đã tạo/cập nhật

### 1. Context - `client/src/admin/contexts/roadmapContext.tsx`

**Chức năng:**

- Quản lý state toàn cục cho roadmaps
- Cung cấp các function để tương tác với API backend

**Các function chính:**

- `fetchRoadmapsPaginated()` - Lấy danh sách lộ trình có phân trang và filter
- `getRoadmapById()` - Lấy chi tiết một lộ trình
- `createRoadmap()` - Tạo lộ trình mới
- `updateRoadmap()` - Cập nhật lộ trình
- `lockRoadmap()` - Khóa lộ trình
- `unlockRoadmap()` - Mở khóa lộ trình

**Interface Roadmap:**

```typescript
interface Roadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_description: string;
  roadmap_aim: string;
  roadmap_level: string; // 'beginner', 'intermediate', 'advanced'
  estimated_duration: number; // số tháng
  roadmap_status: boolean;
  certificate_id: number; // liên kết với chứng chỉ
  discount_percent: number;
  roadmap_price: number;
  created_at: string;
  updated_at: string;
}
```

### 2. Page - `client/src/admin/pages/RoadmapManagement.tsx`

**Chức năng:**

- Hiển thị danh sách lộ trình dạng grid
- Tìm kiếm và lọc theo cấp độ
- Tạo mới, chỉnh sửa, khóa/mở lộ trình
- Hiển thị thông tin chứng chỉ liên kết

**Features:**

- ✅ Tìm kiếm theo tiêu đề/mô tả
- ✅ Filter theo cấp độ (Cơ bản/Trung cấp/Nâng cao)
- ✅ Hiển thị thông tin: mục tiêu, thời gian, chứng chỉ, giá
- ✅ Quản lý trạng thái (Lock/Unlock)
- ✅ Modal tạo mới và chỉnh sửa

### 3. Components

#### `client/src/admin/components/RoadmapManagement/AddRoadmapModal.tsx`

**Chức năng:** Modal tạo lộ trình mới

**Các trường input:**

- Tiêu đề lộ trình (\*)
- Mô tả (\*)
- Mục tiêu (\*)
- Cấp độ (\*) - Select: beginner/intermediate/advanced
- Thời gian ước tính (tháng) (\*)
- Chứng chỉ (\*) - Select từ danh sách certificates
- Giá (VNĐ) (\*)
- Phần trăm giảm giá (0-100)
- Trạng thái kích hoạt - Checkbox

**Validation:**

- Kiểm tra các trường bắt buộc
- Validation số âm cho giá và thời gian
- Validation phạm vi 0-100 cho discount

#### `client/src/admin/components/RoadmapManagement/EditRoadmapModal.tsx`

**Chức năng:** Modal chỉnh sửa lộ trình

**Đặc điểm:**

- Pre-fill dữ liệu từ roadmap hiện tại
- Tương tự AddRoadmapModal nhưng không có trường roadmap_price (do backend không update)
- Validation tương tự

### 4. App Provider - `client/src/App.tsx`

**Cập nhật:**

- Thêm `RoadmapProvider` vào component tree
- Đảm bảo RoadmapProvider bọc toàn bộ app để sử dụng context ở mọi nơi

```tsx
<RoadmapProvider>
  <ToastProvider>{/* ... */}</ToastProvider>
</RoadmapProvider>
```

## Tích hợp với Backend

### API Endpoints sử dụng:

```
GET    /api/admin/roadmaps/paginated?search=&page=&limit=&roadmap_level=&roadmap_status=
GET    /api/admin/roadmaps/:roadmap_id
POST   /api/admin/roadmaps
PUT    /api/admin/roadmaps/:roadmap_id
PATCH  /api/admin/roadmaps/:roadmap_id/lock
PATCH  /api/admin/roadmaps/:roadmap_id/unlock
```

### Tích hợp Certificate:

- Sử dụng `useCertificate()` context để lấy danh sách certificates
- Hiển thị dropdown chọn certificate khi tạo/sửa roadmap
- Hiển thị tên certificate trong card roadmap thông qua `getCertificateName()`

## Cách sử dụng

### 1. Import và sử dụng Context:

```tsx
import { useRoadmap } from "../contexts/roadmapContext";

const MyComponent = () => {
  const { roadmaps, fetchRoadmapsPaginated, createRoadmap } = useRoadmap();

  // Fetch roadmaps
  useEffect(() => {
    fetchRoadmapsPaginated();
  }, []);

  // Create roadmap
  const handleCreate = async (data) => {
    await createRoadmap(
      data.roadmap_title,
      data.roadmap_description,
      // ... other fields
    );
  };
};
```

### 2. Sử dụng Page:

```tsx
import RoadmapManagement from "./admin/pages/RoadmapManagement";

// Trong routes:
<Route path="/admin/roadmaps" element={<RoadmapManagement />} />;
```

## Ghi chú quan trọng

### ⚠️ Lưu ý về roadmap_price:

- **Create:** Backend nhận và lưu `roadmap_price`
- **Update:** Backend KHÔNG nhận `roadmap_price` (không có trong params)
- Frontend chỉ gửi `roadmap_price` khi tạo mới, không gửi khi update

### 🔑 Certificate_id:

- Trường bắt buộc khi tạo/update roadmap
- Được chọn từ dropdown danh sách certificates có sẵn
- Frontend tự động fetch danh sách certificates khi component mount

### 🎨 UI/UX:

- Grid layout 2 cột trên màn hình lớn
- Responsive xuống 1 cột trên mobile
- Color coding theo cấp độ:
  - Beginner: Blue
  - Intermediate: Orange
  - Advanced: Red
- Status badges: Green (active) / Red (locked)

### 📝 TypeScript Errors:

Các lỗi TypeScript về import modules sẽ tự động biến mất sau khi:

- VS Code khởi động lại TypeScript server
- Hoặc lưu lại file

Nếu lỗi vẫn còn, thử:

```bash
# Trong terminal, ở thư mục client:
npm run build
# Hoặc restart VS Code
```

## Testing

### Checklist trước khi test:

- ✅ Backend đã chạy và roadmap routes đã được định nghĩa
- ✅ Database có bảng roadmaps và certificates
- ✅ Token authentication hoạt động bình thường
- ✅ CertificateProvider đã được thêm vào App.tsx

### Test scenarios:

1. Tạo roadmap mới với tất cả trường
2. Tạo roadmap với discount_percent = 0
3. Update roadmap (lưu ý không có roadmap_price)
4. Lock/Unlock roadmap
5. Search roadmap theo tên
6. Filter theo level
7. Kiểm tra hiển thị certificate name

## Tương lai

### Có thể mở rộng:

- [ ] Thêm pagination controls (prev/next buttons)
- [ ] Thêm sort (theo giá, thời gian, tên)
- [ ] View detail roadmap page
- [ ] Liên kết courses với roadmap
- [ ] Statistics dashboard cho roadmaps
- [ ] Export roadmap data

---

**Tạo bởi:** GitHub Copilot
**Ngày:** January 21, 2026

# Phase Management Frontend Guide

## Tổng quan

Hệ thống quản lý Phase (Giai đoạn học tập) cho phép quản trị viên tạo và quản lý các giai đoạn trong mỗi lộ trình học (Roadmap).

## Kiến trúc

### 1. Phase Context (`client/src/admin/contexts/phaseContext.tsx`)

Context cung cấp các chức năng CRUD cho Phase:

```typescript
interface Phase {
  phase_id: number;
  phase_name: string;
  phase_description: string;
  order: number;
  phase_aims: string;
  roadmap_id: number;
  created_at: string;
  updated_at: string;
}
```

**Các hàm chính:**

- `getPhasesByRoadmapId(roadmap_id)` - Lấy tất cả các phase của một roadmap
- `getPhaseById(phase_id)` - Lấy chi tiết một phase
- `createPhase(roadmap_id, phase_name, phase_description, order, phase_aims)` - Tạo phase mới
- `updatePhase(phase_id, phase_name, phase_description, order, phase_aims)` - Cập nhật phase

### 2. Provider Setup (`client/src/App.tsx`)

PhaseProvider được lồng bên trong RoadmapProvider:

```tsx
<RoadmapProvider>
  <PhaseProvider>{/* Other providers and routes */}</PhaseProvider>
</RoadmapProvider>
```

### 3. Routing (`client/src/admin/routes/AdminRoutes.tsx`)

Route chi tiết roadmap:

```tsx
<Route path="roadmaps/:roadmap_id" element={<RoadmapDetail />} />
```

### 4. Navigation Flow

**RoadmapManagement → RoadmapDetail:**

Từ trang RoadmapManagement, click nút "Chi tiết" (Eye icon) sẽ navigate đến:

```typescript
navigate(`/admin/roadmaps/${roadmap.roadmap_id}`);
```

## RoadmapDetail Page

### Chức năng

1. **Hiển thị thông tin roadmap:**
   - Tiêu đề và mô tả
   - Mục tiêu (roadmap_aim)
   - Thời gian ước tính (estimated_duration)
   - Chứng chỉ (certificate_id)
   - Giá (roadmap_price)
   - Cấp độ (roadmap_level)
   - Giảm giá (discount_percent)
   - Ngày tạo

2. **Hiển thị các Phase:**
   - Tab navigation để chuyển giữa các phase
   - Chi tiết từng phase: tên, mô tả, mục tiêu
   - Nút "Thêm giai đoạn" (chưa kết nối)
   - Nút "Edit" cho mỗi phase (chưa kết nối)

3. **Trạng thái Loading và Error:**
   - Loading state khi fetch dữ liệu
   - Empty state khi chưa có phase nào

### Dữ liệu hiển thị

**Từ Roadmap API:**

- `roadmap_title` - Tiêu đề lộ trình
- `roadmap_description` - Mô tả
- `roadmap_aim` - Mục tiêu
- `estimated_duration` - Thời gian (tháng)
- `roadmap_price` - Giá tiền
- `discount_percent` - Phần trăm giảm giá
- `roadmap_level` - Cấp độ (beginner/intermediate/advanced)
- `certificate_id` - ID chứng chỉ
- `created_at` - Ngày tạo

**Từ Phase API:**

- `phase_name` - Tên giai đoạn
- `phase_description` - Mô tả giai đoạn
- `phase_aims` - Mục tiêu giai đoạn (text)
- `order` - Thứ tự

## Điểm khác biệt so với Template

### Đã loại bỏ:

❌ Dữ liệu mẫu (sample data)
❌ Phần "Assessment Schedule" (Lịch kiểm tra)
❌ Phần "Additional Resources" (Tài liệu hỗ trợ)
❌ Progress bars cho phase
❌ Courses trong phase (backend không có)
❌ Milestones array (backend chỉ có phase_aims string)
❌ Stats: totalStudents, completionRate (backend không trả về)

### Đã giữ lại:

✅ Hiển thị thông tin roadmap từ API
✅ Tab navigation cho phases
✅ Chi tiết phase với phase_aims
✅ Nút "Thêm giai đoạn"
✅ Nút "Edit" cho phase
✅ Loading và error states
✅ Empty state cho phase

## API Endpoints sử dụng

### Roadmap API

```
GET /api/admin/roadmaps/:roadmap_id
```

### Phase API

```
GET /api/admin/phases/roadmap/:roadmap_id
GET /api/admin/phases/:phase_id
POST /api/admin/phases
PUT /api/admin/phases/:phase_id
```

## Workflow sử dụng

1. **Xem danh sách roadmaps:**
   - Vào `/admin/roadmaps`
   - Tìm kiếm, filter theo level/status

2. **Xem chi tiết roadmap:**
   - Click nút "Chi tiết" (Eye icon) trên card roadmap
   - Hệ thống navigate đến `/admin/roadmaps/:roadmap_id`
   - Tự động fetch roadmap và phases

3. **Quản lý phases:**
   - Click tab để xem từng phase
   - Click "Thêm giai đoạn" để tạo mới (chưa implement modal)
   - Click icon "Edit" để chỉnh sửa (chưa implement modal)

## Các component cần tạo tiếp

### AddPhaseModal

Tương tự AddRoadmapModal, cần có:

- Form input: phase_name, phase_description, order, phase_aims
- Validation
- Submit gọi `createPhase()` từ context

### EditPhaseModal

Tương tự EditRoadmapModal, cần có:

- Pre-fill data từ phase hiện tại
- Form input tương tự Add
- Submit gọi `updatePhase()` từ context

## Notes quan trọng

1. **phase_aims là string, không phải array:**
   Backend trả về `phase_aims` dưới dạng text thuần, có thể format với `whitespace-pre-wrap` trong CSS để giữ nguyên format.

2. **Không có courses trong phase:**
   Hiện tại phase chỉ chứa thông tin cơ bản, không có nested courses như trong template.

3. **Backend endpoint:**
   - Đã có sẵn phaseController và phaseService
   - Routes đã được config trong adminRoutes.js

4. **Loading state:**
   Component sử dụng local state `loading` để handle loading khi fetch data.

## Cấu trúc thư mục

```
client/src/admin/
├── contexts/
│   ├── phaseContext.tsx          ✅ Đã tạo
│   └── roadmapContext.tsx        ✅ Đã có
├── pages/
│   ├── RoadmapManagement.tsx     ✅ Đã cập nhật (thêm nút Chi tiết)
│   └── RoadmapDetail.tsx         ✅ Đã cập nhật (hiển thị dữ liệu thật)
├── components/
│   └── RoadmapManagement/
│       ├── AddRoadmapModal.tsx   ✅ Đã có
│       ├── EditRoadmapModal.tsx  ✅ Đã có
│       ├── AddPhaseModal.tsx     ⏳ Cần tạo
│       └── EditPhaseModal.tsx    ⏳ Cần tạo
└── routes/
    └── AdminRoutes.tsx           ✅ Đã cập nhật (thêm route detail)
```

## Kết luận

Hệ thống Phase Management đã được tích hợp thành công với:

- ✅ Context và Provider hoàn chỉnh
- ✅ Route navigation đã setup
- ✅ RoadmapDetail page hiển thị dữ liệu thật từ API
- ✅ Loại bỏ dữ liệu mẫu và lịch kiểm tra
- ⏳ Modal Add/Edit Phase cần được implement

Bước tiếp theo: Tạo AddPhaseModal và EditPhaseModal để hoàn thiện chức năng CRUD cho Phase.

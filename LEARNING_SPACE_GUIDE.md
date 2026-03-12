# Learning Space Guide - Góc Học Tập

## Tổng quan

**Góc học tập** (Learning Space) là giao diện học tập tương tác chuyên dụng cho người dùng khi họ bắt đầu một khóa học. Trang này cung cấp trải nghiệm học tập immersive với sidebar điều hướng và khu vực hiển thị nội dung bài học.

## Cấu trúc

### 1. Context Layer - `learningContext.tsx`

Context quản lý trạng thái và logic cho toàn bộ phiên học tập.

**Đường dẫn**: `client/src/user/contexts/learningContext.tsx`

**State Management**:

```typescript
interface LearningContextType {
  course: Course | null;
  currentLesson: Lesson | null;
  currentModuleLesson: ModuleLesson | null;
  lessonProgress: LessonProgress | null;
  loading: boolean;
  error: string | null;

  // Methods
  loadCourse: (courseId: number) => Promise<void>;
  selectLesson: (moduleLessonId: number) => Promise<void>;
  updateProgress: (progressPercentage: number) => Promise<void>;
  getNextLesson: () => ModuleLesson | null;
  getPreviousLesson: () => ModuleLesson | null;
  markLessonComplete: () => Promise<void>;
}
```

**Tính năng chính**:

1. **Load Course với Auto-Selection**:

```typescript
const loadCourse = async (courseId: number) => {
  // Fetch course với modules và lessons
  // Auto-select bài học đầu tiên
  // Load progress của bài học
};
```

2. **Lesson Navigation**:

```typescript
const selectLesson = async (moduleLessonId: number) => {
  // Chuyển đến bài học cụ thể
  // Fetch progress của bài học đó
};
```

3. **Progress Tracking**:

```typescript
const updateProgress = async (progressPercentage: number) => {
  // Lưu tiến độ vào backend
  // Reload progress để cập nhật UI
};
```

4. **Sequential Navigation**:

```typescript
const getNextLesson = () => ModuleLesson | null;
const getPreviousLesson = () => ModuleLesson | null;
```

5. **Mark Complete & Auto-Advance**:

```typescript
const markLessonComplete = async () => {
  await updateProgress(100);
  const next = getNextLesson();
  if (next) {
    await selectLesson(next.module_lesson_id);
  }
};
```

### 2. Component Layer

#### A. LessonSidebar Component

**Đường dẫn**: `client/src/user/components/LearningSpaceComponent/LessonSidebar.tsx`

**Chức năng**:

- Hiển thị thông tin khóa học (tiêu đề, mô tả, level, access type)
- Expandable tree của modules và lessons
- Highlight bài học hiện tại
- Checkmark cho bài học đã hoàn thành
- Progress summary ở footer

**UI Elements**:

1. **Course Header**:

```tsx
<div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
  <h2>{course.course_title}</h2>
  <p>{course.description}</p>
  <Badge>{course.course_level}</Badge>
  {premium && <Badge>Premium</Badge>}
</div>
```

2. **Module List**:

```tsx
<div className="p-4">
  {modules.map((module) => (
    <>
      <ModuleHeader>
        <span>{moduleIndex + 1}</span>
        <h3>{module.module_title}</h3>
        <p>
          {lessons.length} bài học • {estimated_time} phút
        </p>
      </ModuleHeader>

      <LessonList>
        {module.lessons.map((lesson) => (
          <LessonButton
            active={isActive}
            completed={isCompleted}
            onClick={() => selectLesson(lesson.id)}
          >
            <Icon /> {/* CheckCircle or Circle */}
            <LessonInfo>
              <Type>{lesson.type}</Type>
              <Title>{lesson.title}</Title>
              <Time>{lesson.time} phút</Time>
            </LessonInfo>
            {isActive && <ChevronRight />}
          </LessonButton>
        ))}
      </LessonList>
    </>
  ))}
</div>
```

3. **Progress Summary**:

```tsx
<div className="p-4 border-t border-gray-200 bg-gray-50">
  <p>Tiến độ khóa học</p>
  <ProgressBar value={completedLessons} max={totalLessons} />
  <p>
    {completedLessons} / {totalLessons} bài học hoàn thành
  </p>
</div>
```

**Visual States**:

- **Active Lesson**: Blue background (#2563eb), white text, ChevronRight icon
- **Completed Lesson**: Green CheckCircle icon
- **Incomplete Lesson**: Gray Circle outline icon
- **Hover**: Gray background transition

#### B. LessonContent Component

**Đường dẫn**: `client/src/user/components/LearningSpaceComponent/LessonContent.tsx`

**Chức năng**:

- Hiển thị header với metadata bài học
- Render nội dung markdown
- Progress bar cho bài học hiện tại
- Navigation buttons (Previous/Next/Complete)

**UI Structure**:

1. **Lesson Header**:

```tsx
<header className="border-b bg-gray-50 p-6">
  <TypeIcon />
  <div>
    <Badges>
      <Badge>{difficulty}</Badge>
      <Badge>{type}</Badge>
      {completed && <Badge>Đã hoàn thành</Badge>}
    </Badges>
    <h1>{lesson.title}</h1>
    <Metadata>
      <Clock /> {estimatedTime} phút
      {description && <span>• {description}</span>}
    </Metadata>
  </div>

  {/* Progress Bar */}
  {progress > 0 && <ProgressBar value={progress} />}
</header>
```

2. **Content Area**:

```tsx
<main className="flex-1 overflow-y-auto p-6">
  <div className="max-w-4xl mx-auto">
    <div className="prose prose-lg">
      <ReactMarkdown>{lesson.content}</ReactMarkdown>
    </div>

    {isExamFormat && (
      <Alert variant="warning">Bài học này có định dạng bài kiểm tra...</Alert>
    )}
  </div>
</main>
```

3. **Navigation Footer**:

```tsx
<footer className="border-t bg-gray-50 p-4">
  <div className="flex items-center justify-between">
    <Button onClick={handlePrevious} disabled={!previousLesson}>
      <ArrowLeft /> Bài trước
    </Button>

    {!isCompleted && (
      <Button variant="success" onClick={handleComplete}>
        <CheckCircle /> Hoàn thành & Tiếp tục
      </Button>
    )}

    <Button onClick={handleNext} disabled={!nextLesson}>
      Bài tiếp theo <ArrowRight />
    </Button>
  </div>
</footer>
```

**Interactive Features**:

- **Complete Button**: Marks lesson 100% complete, auto-advances to next
- **Previous/Next Navigation**: Sequential lesson browsing
- **Disabled States**: Buttons disabled when no previous/next lesson exists
- **Loading States**: Spinner during content loading

#### C. Type Icons Mapping

Các icon cho từng loại bài học:

```typescript
const getLessonTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "video":
      return <PlayCircle className="text-red-500" />;
    case "reading":
    case "text":
      return <FileText className="text-blue-500" />;
    default:
      return <BookOpen className="text-gray-500" />;
  }
}
```

### 3. Page Layer - `LearningSpace.tsx`

**Đường dẫn**: `client/src/user/pages/LearningSpace.tsx`

**Layout Structure**:

```tsx
<LearningProvider>
  <div className="h-screen flex flex-col">
    {/* Top Navigation Bar */}
    <header className="bg-white border-b shadow-sm">
      <BackButton onClick={() => navigate("/courses")} />
      <h1>Góc học tập</h1>
    </header>

    {/* Main Content Area */}
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar - Fixed 320px */}
      <aside className="w-80 flex-shrink-0">
        <LessonSidebar />
      </aside>

      {/* Content - Flexible */}
      <main className="flex-1 overflow-hidden">
        <LessonContent />
      </main>
    </div>
  </div>
</LearningProvider>
```

**Features**:

- Full-screen layout (h-screen)
- Fixed sidebar width (320px)
- Flexible content area
- Back button to return to course list
- Error handling for invalid courseId

**Loading States**:

```tsx
if (loading && !course) {
  return (
    <LoadingScreen>
      <Spinner />
      <p>Đang tải khóa học...</p>
    </LoadingScreen>
  );
}
```

**Error States**:

```tsx
if (error) {
  return (
    <ErrorScreen>
      <AlertCircle />
      <h2>Không thể tải khóa học</h2>
      <p>{error}</p>
      <Button onClick={() => navigate("/courses")}>
        Quay lại danh sách khóa học
      </Button>
    </ErrorScreen>
  );
}
```

## Routing Configuration

### App.tsx Route Setup

```tsx
// Import
import LearningSpace from "./user/pages/LearningSpace.tsx";

// Routes
<Route path="/learning/:courseId" element={<LearningSpace />} />;
```

**Route Pattern**: `/learning/:courseId`

- **Example**: `/learning/123` - Opens learning space for course ID 123

### Navigation Flow

1. **User clicks "Bắt đầu học ngay" on CourseDetail**:

```tsx
const handleStartCourse = async () => {
  const success = await startCourse(courseId);
  if (success) {
    navigate(`/learning/${courseId}`);
  }
};
```

2. **LearningSpace loads**:
   - Extracts courseId from URL params
   - Calls `loadCourse(courseId)`
   - Auto-selects first lesson
   - Fetches lesson progress

3. **User navigates lessons**:
   - Click sidebar lesson → `selectLesson(moduleLessonId)`
   - Click "Bài tiếp theo" → `getNextLesson()` → `selectLesson()`
   - Click "Hoàn thành" → `markLessonComplete()` → auto-advance

## Data Flow

### 1. Course Loading Flow

```
LearningSpace (mount)
  ↓
useParams() → courseId
  ↓
loadCourse(courseId)
  ↓
API: GET /api/courses/:id (with modules, lessons)
  ↓
Set course → Auto-select first lesson
  ↓
API: GET /api/lessons/:id/progress
  ↓
Display first lesson with progress
```

### 2. Lesson Selection Flow

```
User clicks lesson in sidebar
  ↓
selectLesson(moduleLessonId)
  ↓
Find lesson in course.Modules.Module_Lessons
  ↓
Set currentLesson, currentModuleLesson
  ↓
API: GET /api/lessons/:id/progress
  ↓
Set lessonProgress
  ↓
LessonContent re-renders with new content
```

### 3. Progress Update Flow

```
User clicks "Hoàn thành & Tiếp tục"
  ↓
markLessonComplete()
  ↓
updateProgress(100)
  ↓
API: PUT /api/lessons/:id/progress { progress_percentage: 100 }
  ↓
Backend: Update lesson → Update course → Update roadmap (cascade)
  ↓
API: GET /api/lessons/:id/progress (reload)
  ↓
getNextLesson()
  ↓
If exists: selectLesson(nextLesson.id)
  ↓
Navigate to next lesson automatically
```

## API Integration

### Endpoints Used

1. **Get Course with Modules & Lessons**:

```typescript
GET /api/courses/:id

Response:
{
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  access_type: string;
  Modules: [
    {
      module_id: number;
      module_title: string;
      order_index: number;
      estimated_time: number;
      Module_Lessons: [
        {
          module_lesson_id: number;
          order_index: number;
          description: string;
          status: boolean; // completion status
          Lesson: {
            lesson_id: number;
            lesson_title: string;
            lesson_type: string;
            lesson_content: string;
            estimated_time: number;
            difficulty_level: string;
            is_exam_format: boolean;
          }
        }
      ]
    }
  ]
}
```

2. **Update Lesson Progress**:

```typescript
PUT /api/lessons/:id/progress

Body: {
  progress_percentage: number; // 0-100
}

Response: {
  success: true;
  message: "Progress updated successfully";
  data: {
    user_lesson_progress_id: number;
    progress_percentage: number;
    is_completed: boolean;
    last_accessed: string;
  }
}
```

3. **Get Lesson Progress**:

```typescript
GET /api/lessons/:id/progress

Response: {
  exists: true;
  progress: {
    user_lesson_progress_id: number;
    lesson_id: number;
    progress_percentage: number;
    is_completed: boolean;
    last_accessed: string;
    created_at: string;
    updated_at: string;
  }
}
```

## Styling & Design

### Color Scheme

- **Primary (Active)**: Blue-600 (#2563eb)
- **Success (Completed)**: Green-500/600
- **Warning**: Yellow-50/100
- **Neutral**: Gray-50 to Gray-900

### Component Patterns

1. **Cards**: `rounded-lg border shadow-sm`
2. **Buttons**: `rounded-lg px-4 py-2 font-medium transition-colors`
3. **Progress Bars**: `bg-gray-200 rounded-full h-2` with colored fill
4. **Badges**: `text-xs px-2 py-1 rounded-full font-medium`

### Responsive Considerations

- **Sidebar**: Fixed 320px width (w-80)
- **Content**: Flexible with max-width-4xl for readability
- **Height**: Full screen (h-screen) for immersive experience
- **Overflow**: Sidebar and content scroll independently

### Animations

1. **Active Lesson**:

```tsx
className = "bg-blue-600 text-white shadow-md";
```

2. **Hover States**:

```tsx
className = "hover:bg-gray-100 transition-all";
```

3. **Progress Bar**:

```tsx
className="transition-all duration-300"
style={{ width: `${progress}%` }}
```

## Key Features Summary

### ✅ Implemented Features

1. **Immersive Learning Interface**:
   - Full-screen dedicated learning space
   - Distraction-free content display
   - Fixed sidebar navigation

2. **Smart Lesson Navigation**:
   - Auto-select first lesson on load
   - Sequential next/previous navigation
   - Click-to-jump from sidebar

3. **Progress Tracking**:
   - Per-lesson progress percentage
   - Visual indicators (checkmarks, progress bars)
   - Auto-cascade to course and roadmap levels

4. **Auto-Advance Feature**:
   - "Hoàn thành & Tiếp tục" button
   - Marks lesson 100% complete
   - Automatically loads next lesson

5. **Visual Feedback**:
   - Active lesson highlighting
   - Completion badges and icons
   - Loading and error states
   - Disabled button states

6. **Content Rendering**:
   - Markdown support via ReactMarkdown
   - Type-specific icons (video, reading, etc.)
   - Difficulty level badges
   - Estimated time display

7. **Module Organization**:
   - Grouped by modules
   - Ordered by index
   - Lesson count and time summary

## Usage Examples

### Basic Usage

1. User visits Course Detail page → Clicks "Bắt đầu học ngay"
2. System creates `user_course` record
3. Navigate to `/learning/:courseId`
4. First lesson loads automatically
5. User reads content → Clicks "Hoàn thành & Tiếp tục"
6. System marks lesson complete, advances to next lesson
7. Repeat until all lessons complete

### Advanced Scenarios

**Jump to Specific Lesson**:

```tsx
// User clicks lesson 5 in sidebar
<button onClick={() => selectLesson(moduleLessonId)}>
  Lesson 5: Advanced Concepts
</button>
// System loads lesson 5 immediately
```

**Resume Learning**:

```tsx
// When user returns to /learning/:courseId
// System auto-selects first incomplete lesson
// Or first lesson if all complete
```

**Manual Progress Update** (if needed):

```tsx
// While watching video, update progress at intervals
const handleVideoProgress = async (percentage: number) => {
  await updateProgress(percentage);
};
```

## Error Handling

### Loading Errors

```tsx
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <AlertCircle className="text-red-500" />
      <h2>Không thể tải khóa học</h2>
      <p>{error}</p>
      <button onClick={() => navigate("/courses")}>
        Quay lại danh sách khóa học
      </button>
    </div>
  );
}
```

### Progress Update Errors

```tsx
const updateProgress = async (progressPercentage: number) => {
  try {
    const response = await courseApi.updateLessonProgress(
      lessonId,
      progressPercentage,
    );
    if (!response.success) {
      setError("Không thể cập nhật tiến độ");
    }
  } catch (err) {
    setError(err.message);
  }
};
```

### Navigation Guards

```tsx
// Prevent navigation when no next lesson
<button
  onClick={handleNext}
  disabled={!nextLesson}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  Bài tiếp theo
</button>
```

## Performance Considerations

1. **Lazy Content Loading**: Load only current lesson content
2. **Progress Debouncing**: Don't update progress on every scroll
3. **Sidebar Virtualization**: Consider for courses with 100+ lessons
4. **Caching**: Store course data to avoid re-fetching on lesson switch

## Future Enhancements

- [ ] Video player integration with progress tracking
- [ ] Note-taking feature for each lesson
- [ ] Bookmark/favorite lessons
- [ ] Discussion/comment section per lesson
- [ ] Quiz integration for exam-format lessons
- [ ] Certificate generation on course completion
- [ ] Download lesson content for offline reading
- [ ] Keyboard shortcuts (← → for navigation, Space for complete)
- [ ] Dark mode support
- [ ] Mobile responsive layout (collapsible sidebar)
- [ ] Multi-language lesson content

## Testing Checklist

- [ ] Load course successfully
- [ ] Auto-select first lesson
- [ ] Navigate to next lesson
- [ ] Navigate to previous lesson
- [ ] Mark lesson complete
- [ ] Auto-advance after completion
- [ ] Click lesson in sidebar
- [ ] Display progress bar correctly
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Disable buttons when appropriate
- [ ] Markdown rendering works
- [ ] Icons display correctly
- [ ] Back button navigation
- [ ] URL param handling
- [ ] Progress persistence across sessions

## Troubleshooting

### Issue: Lesson content not displaying

**Check**:

1. Ensure `lesson_content` field exists in API response
2. Verify ReactMarkdown is installed (`npm list react-markdown`)
3. Check console for markdown parsing errors

### Issue: Progress not saving

**Check**:

1. Verify user is authenticated (token valid)
2. Check network tab for PUT /api/lessons/:id/progress
3. Ensure `user_lesson_progresss` table exists
4. Verify backend progressService is working

### Issue: Auto-advance not working

**Check**:

1. Ensure `getNextLesson()` returns correct lesson
2. Verify `markLessonComplete()` calls `selectLesson()`
3. Check lesson order_index values are sequential

### Issue: Sidebar not highlighting active lesson

**Check**:

1. Verify `currentModuleLesson.module_lesson_id` matches
2. Ensure `selectLesson()` updates state correctly
3. Check React re-rendering (add console.log)

## Related Documentation

- [PROGRESS_TRACKING_API_GUIDE.md](./PROGRESS_TRACKING_API_GUIDE.md) - API endpoints for progress tracking
- [ROADMAP_FRONTEND_GUIDE.md](./ROADMAP_FRONTEND_GUIDE.md) - Roadmap and Course listing
- Course Context Documentation - `client/src/user/contexts/courseContext.tsx`

## Summary

**Góc học tập** (Learning Space) provides a complete, immersive learning experience with:

- ✅ Dedicated full-screen interface
- ✅ Smart auto-navigation and progress tracking
- ✅ Visual feedback and completion indicators
- ✅ Markdown content rendering
- ✅ Mobile-ready responsive design
- ✅ Seamless integration with existing progress tracking system

This feature transforms the e-learning platform from a course catalog into a full-fledged interactive learning environment.

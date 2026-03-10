import React, { ReactNode } from "react";
import { Search } from "lucide-react";

interface BlogLayoutProps {
  children: ReactNode;
  onSearch?: (term: string) => void;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const sidebarSections = [
    {
      title: "Tìm hiểu về STUDY4",
      items: ["Tính năng trên STUDY4", "Khóa học trên STUDY4"],
    },
    {
      title: "Review của học viên STUDY4",
      items: ["Học viên IELTS", "Học viên TOEIC", "Học viên HSK"],
    },
    {
      title: "Luyện thi IELTS",
      items: [
        "IELTS Listening",
        "IELTS Reading",
        "IELTS Speaking",
        "IELTS Writing",
        "IELTS Materials",
        "Thông tin kỳ thi IELTS",
        "Kinh nghiệm thi IELTS",
        "The Reading Hub",
      ],
    },
  ];

  const recommendedCourses = [
    {
      icon: "🎧",
      title: "KHÓA HỌC IELTS INTENSIVE LISTENING",
      color: "text-purple-600",
    },
    {
      icon: "📖",
      title: "KHÓA HỌC IELTS INTENSIVE READING (ACADEMIC)",
      color: "text-blue-600",
    },
    {
      icon: "🎤",
      title: "KHÓA HỌC IELTS INTENSIVE SPEAKING",
      color: "text-pink-600",
    },
    {
      icon: "✍️",
      title: "KHÓA HỌC IELTS INTENSIVE WRITING (ACADEMIC)",
      color: "text-orange-600",
    },
    {
      icon: "📚",
      title: "KHÓA HỌC IELTS GENERAL READING",
      color: "text-blue-600",
    },
    {
      icon: "📝",
      title: "KHÓA HỌC IELTS GENERAL WRITING",
      color: "text-orange-600",
    },
    {
      icon: "📘",
      title: "KHÓA HỌC IELTS FUNDAMENTALS (cơ bản)",
      color: "text-yellow-600",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800">Bài viết nổi bật</h1>
        </div>
      </div>

      {/* Main Content - 3 columns layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Chuyên mục */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="bg-white rounded-lg p-4 lg:sticky lg:top-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">
                Chuyên mục
              </h3>

              <div className="space-y-3">
                {sidebarSections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-xs text-gray-700 mb-1.5">
                      {section.title}
                    </h4>
                    <ul className="space-y-0.5 ml-2">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <a
                            href="#"
                            className="text-xs text-gray-600 hover:text-gray-900 block py-0.5 transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Middle Content - Dynamic */}
          <main className="col-span-12 lg:col-span-7">{children}</main>

          {/* Right Sidebar - Tìm kiếm & Tìm hiểu thêm */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="space-y-4 lg:sticky lg:top-4">
              {/* Search Box */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">
                  Tìm kiếm bài viết
                </h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Recommended Courses */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">
                  Tìm hiểu thêm
                </h3>
                <div className="space-y-1.5">
                  {recommendedCourses.map((course, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors group"
                    >
                      <span className="text-base flex-shrink-0">
                        {course.icon}
                      </span>
                      <span className="text-xs text-gray-700 group-hover:text-gray-900">
                        {course.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;

import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Map,
  BookOpen,
  ClipboardList,
  Layers,
  FileText,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface BlogLayoutProps {
  children: ReactNode;
  onSearch?: (term: string) => void;
  categories?: Category[];
  selectedCategory?: string;
  onCategoryChange?: (id: string) => void;
}

const EXPLORE_LINKS = [
  {
    icon: Map,
    label: "Lộ trình học tập",
    to: "/roadmaps",
    iconClass: "text-blue-600 bg-blue-50",
  },
  {
    icon: BookOpen,
    label: "Khóa học",
    to: "/courses",
    iconClass: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: ClipboardList,
    label: "Đề thi",
    to: "/exams",
    iconClass: "text-violet-600 bg-violet-50",
  },
  {
    icon: Layers,
    label: "Flashcard",
    to: "/flashcards",
    iconClass: "text-rose-600 bg-rose-50",
  },
  {
    icon: FileText,
    label: "Tài liệu",
    to: "/documents",
    iconClass: "text-amber-600 bg-amber-50",
  },
];

const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  onSearch,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-800">Bài viết nổi bật</h1>
        </div>
      </div>

      {/* Main Content - 3 columns layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Chuyên mục / Filter */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="bg-white rounded-lg p-4 lg:sticky lg:top-4 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">
                Chuyên mục
              </h3>
              {categories && onCategoryChange ? (
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => onCategoryChange(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Không có chuyên mục</p>
              )}
            </div>
          </aside>

          {/* Middle Content - Dynamic */}
          <main className="col-span-12 lg:col-span-7">{children}</main>

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="space-y-4 lg:sticky lg:top-4">
              {/* Search Box */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-3 text-sm">
                  Tìm kiếm bài viết
                </h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nhập từ khóa..."
                      className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Tìm hiểu thêm */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-3 text-sm">
                  Tìm hiểu thêm
                </h3>
                <div className="space-y-1">
                  {EXPLORE_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${item.iconClass} flex items-center justify-center shrink-0`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                        {item.label}
                      </span>
                    </Link>
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

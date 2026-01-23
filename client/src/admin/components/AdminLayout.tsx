import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Newspaper,
  MessageSquare,
  BarChart3,
  Map,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Target,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../shared/contexts/authContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const [roadmapMenuOpen, setRoadmapMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý tài khoản",
      path: "/admin/accounts",
      icon: Users,
    },
    {
      name: "Quản lý khóa học",
      icon: BookOpen,
      hasDropdown: true,
      isOpen: courseMenuOpen,
      toggle: () => setCourseMenuOpen(!courseMenuOpen),
      children: [
        {
          name: "Quản lý khóa học",
          path: "/admin/courses",
        },
        {
          name: "Quản lý bài học",
          path: "/admin/lessons",
        },
      ],
    },
    {
      name: "Quản lý bài kiểm tra",
      path: "/admin/tests",
      icon: ClipboardList,
    },
    {
      name: "Quản lý tin tức",
      path: "/admin/news",
      icon: Newspaper,
    },
    {
      name: "Quản lý phản hồi",
      path: "/admin/feedback",
      icon: MessageSquare,
    },
    {
      name: "Quản lý báo cáo",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Quản lý kỹ năng",
      path: "/admin/skills",
      icon: Target,
    },
    {
      name: "Quản lý tài liệu",
      path: "/admin/documents",
      icon: FileText,
    },
    {
      name: "Quản lý lộ trình",
      icon: Map,
      hasDropdown: true,
      isOpen: roadmapMenuOpen,
      toggle: () => setRoadmapMenuOpen(!roadmapMenuOpen),
      children: [
        {
          name: "Quản lý chứng chỉ",
          path: "/admin/certificates",
        },
        {
          name: "Quản lý lộ trình",
          path: "/admin/roadmaps",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={item.path || index}>
                {item.hasDropdown ? (
                  <>
                    {/* Dropdown Parent Item */}
                    <button
                      onClick={item.toggle}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">
                            {item.name}
                          </span>
                          {item.isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Dropdown Children */}
                    {sidebarOpen && item.isOpen && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children?.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                                  isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  /* Regular Menu Item */
                  <NavLink
                    to={item.path!}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          {sidebarOpen ? (
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user?.full_name?.charAt(0)?.toUpperCase() ||
                      user?.user_name?.charAt(0)?.toUpperCase() ||
                      "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.full_name || user?.user_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.user_email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Chào mừng trở lại, {user?.full_name || user?.user_name}!
            </h2>
            <p className="text-sm text-gray-500">Quản lý hệ thống E-Learning</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

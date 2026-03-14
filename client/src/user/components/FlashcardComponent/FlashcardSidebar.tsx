import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookMarked, Bell } from "lucide-react";

const FlashcardSidebar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const navItems = [
    { path: "/flashcards", label: "Trang chính", icon: Home },
    {
      path: "/flashcards/my-library",
      label: "Thư viện của tôi",
      icon: BookMarked,
      requireAuth: true,
    },
    {
      path: "/flashcards/notifications",
      label: "Thông báo",
      icon: Bell,
      requireAuth: true,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white min-h-screen lg:min-h-0 lg:sticky lg:top-16">
      <div className="p-4">
        {/* Navigation Items */}
        <nav className="space-y-1 mb-6">
          {navItems.map((item) => {
            if (item.requireAuth && !isLoggedIn) return null;

            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-700 text-white shadow-lg"
                    : "text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="mt-8 px-4 py-4 bg-indigo-950/30 rounded-lg">
          <p className="text-xs text-indigo-300 text-center">
            Học thông minh hơn với Flashcards
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FlashcardSidebar;

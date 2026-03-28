import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookMarked, Bell } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const FlashcardSidebar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    if (token) {
      fetchDueCount();
    }
  }, []);

  const fetchDueCount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/user/flashcards/due-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();
      if (result.success) {
        setDueCount(result.total_due_cards || 0);
      }
    } catch (error) {
      console.error("Error fetching due count:", error);
    }
  };

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
    <aside className="w-full lg:w-64 lg:shrink-0 bg-gradient-to-b from-slate-900 to-violet-900 text-white min-h-screen lg:min-h-0 lg:sticky lg:top-16">
      <div className="p-4">
        {/* Navigation Items */}
        <nav className="space-y-1 mb-6">
          {navItems.map((item) => {
            if (item.requireAuth && !isLoggedIn) return null;

            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const showBadge =
              item.path === "/flashcards/notifications" && dueCount > 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "bg-violet-700 text-white shadow-lg"
                    : "text-violet-100 hover:bg-violet-700/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm flex-1 whitespace-nowrap">
                  {item.label}
                </span>
                {showBadge && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {dueCount > 99 ? "99+" : dueCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="mt-8 px-4 py-4 bg-violet-950/30 rounded-lg">
          <p className="text-xs text-violet-300 text-center">
            Học thông minh hơn với Flashcards
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FlashcardSidebar;

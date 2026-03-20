import React from "react";
import { User, BookOpen, ClipboardList, CreditCard } from "lucide-react";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    {
      id: "profile",
      label: "Hồ sơ",
      icon: User,
    },
    {
      id: "learning",
      label: "Tiến độ học tập",
      icon: BookOpen,
    },
    {
      id: "exam-history",
      label: "Lịch sử thi",
      icon: ClipboardList,
    },
    {
      id: "flashcard",
      label: "Flashcard",
      icon: CreditCard,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;

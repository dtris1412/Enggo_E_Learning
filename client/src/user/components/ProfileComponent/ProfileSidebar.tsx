import React from "react";
import {
  User,
  BookOpen,
  ClipboardList,
  CreditCard,
  BarChart2,
} from "lucide-react";
import SubscriptionInfo from "./SubscriptionInfo";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "profile", label: "Hồ sơ", icon: User },
    { id: "learning", label: "Tiến độ học tập", icon: BookOpen },
    { id: "exam-history", label: "Lịch sử thi", icon: ClipboardList },
    { id: "flashcard", label: "Flashcard", icon: CreditCard },
    { id: "exam-analytics", label: "Phân tích AI", icon: BarChart2 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subscription info embedded in sidebar */}
      <SubscriptionInfo />
    </div>
  );
};

export default ProfileSidebar;

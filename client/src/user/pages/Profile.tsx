import React, { useState } from "react";
import ProfileSidebar from "../components/ProfileComponent/ProfileSidebar";
import ProfileInfo from "../components/ProfileComponent/ProfileInfo";
import ChangePassword from "../components/ProfileComponent/ChangePassword";
import LearningProgress from "../components/ProfileComponent/LearningProgress";
import FlashcardProgress from "../components/ProfileComponent/FlashcardProgress";
import ExamHistorySimple from "../components/ProfileComponent/ExamHistorySimple";
import ExamAnalytics from "../components/ProfileComponent/ExamAnalytics";
import TokenTransactions from "../components/ProfileComponent/TokenTransactions";
import { useUserProfile } from "../contexts/userContext";
import { ExamAnalyticsProvider } from "../contexts/examAnalyticsContext";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile } = useUserProfile();

  const isSocialLogin = profile?.google_id || profile?.facebook_id;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "learning":
        return <LearningProgress />;
      case "exam-history":
        return <ExamHistorySimple />;
      case "flashcard":
        return <FlashcardProgress />;
      case "exam-analytics":
        return <ExamAnalytics />;
      case "token-transactions":
        return <TokenTransactions />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <ExamAnalyticsProvider>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">{renderContent()}</div>
          </div>
        </div>
      </div>
    </ExamAnalyticsProvider>
  );
};

export default Profile;

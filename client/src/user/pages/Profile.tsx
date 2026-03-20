import React, { useState } from "react";
import ProfileSidebar from "../components/ProfileComponent/ProfileSidebar";
import ProfileInfo from "../components/ProfileComponent/ProfileInfo";
import ChangePassword from "../components/ProfileComponent/ChangePassword";
import LearningProgress from "../components/ProfileComponent/LearningProgress";
import FlashcardProgress from "../components/ProfileComponent/FlashcardProgress";
import ExamHistorySimple from "../components/ProfileComponent/ExamHistorySimple";
import SubscriptionInfo from "../components/ProfileComponent/SubscriptionInfo";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ProfileInfo />
            <ChangePassword />
          </div>
        );
      case "learning":
        return <LearningProgress />;
      case "exam-history":
        return <ExamHistorySimple />;
      case "flashcard":
        return <FlashcardProgress />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-3">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">{renderContent()}</div>

          {/* Right Sidebar - Subscription Info */}
          <div className="lg:col-span-3">
            <SubscriptionInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

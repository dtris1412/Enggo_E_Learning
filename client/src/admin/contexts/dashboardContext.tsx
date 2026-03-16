import React, { createContext, useContext, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface TestStatistics {
  totalAttempts: number;
  completedTests: number;
  completionRate: number;
}

interface RecentSubscription {
  user_subscription_id: number;
  started_at: string;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
    user_email: string;
  };
  Subscription_Price: {
    subscription_price_id: number;
    price: number;
    billing_type: string;
    Subscription_Plan: {
      subscription_plan_id: number;
      name: string;
      code: string;
    };
  };
  Order: {
    order_id: number;
    amount: number;
  } | null;
}

interface CompletedExam {
  user_exam_id: number;
  submitted_at: string;
  total_score: number;
  status: string;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
  };
  Exam: {
    exam_id: number;
    exam_name: string;
  };
}

interface RecentFlashcard {
  flashcard_set_id: number;
  title: string;
  total_cards: number;
  created_at: string;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
  };
}

interface TopDocument {
  document_id: number;
  document_name: string;
  document_type: string;
  document_size: string;
  file_type: string;
  download_count: number;
}

interface TopBlog {
  blog_id: number;
  blog_title: string;
  category: string;
  views_count: number;
  likes_count?: number;
  comments_count?: number;
  interaction_count?: number;
  created_at: string;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
  };
}

interface TopCourse {
  course_id: number;
  course_title: string;
  course_level: string;
  course_status: boolean;
  tag: string;
  access_type: string;
  enrolled_users_count: number;
}

interface TopRoadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_level: string;
  roadmap_status: boolean;
  estimated_duration: number;
  enrolled_users_count: number;
}

interface TopLearnedFlashcard {
  flashcard_set_id: number;
  title: string;
  description: string | null;
  total_cards: number;
  visibility: string;
  created_by_type: string;
  created_at: string;
  learner_count: number;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
  };
}

interface DashboardData {
  totalUsers: number;
  activeCourses: number;
  testStatistics: TestStatistics;
  recentSubscriptions: RecentSubscription[];
  recentCompletedExams: CompletedExam[];
  recentFlashcards: RecentFlashcard[];
  topDocuments: TopDocument[];
  topBlogs: TopBlog[];
  topCourses: TopCourse[];
  topRoadmaps: TopRoadmap[];
  topLearnedFlashcards: TopLearnedFlashcard[];
}

interface DashboardContextType {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboardStatistics: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchDashboardStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/dashboard/statistics`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message || "Failed to fetch dashboard statistics");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error fetching dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loading,
        error,
        fetchDashboardStatistics,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

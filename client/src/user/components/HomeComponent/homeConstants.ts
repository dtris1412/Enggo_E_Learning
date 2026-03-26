import { Users, Award, Globe, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const LEVEL_GRADIENT: Record<string, string> = {
  Beginner: "from-emerald-400 to-teal-500",
  Intermediate: "from-blue-400 to-indigo-500",
  Advanced: "from-purple-500 to-pink-500",
};

export const LEVEL_BG: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
  Advanced: "bg-purple-50 text-purple-700 border-purple-200",
};

export const CATEGORY_STYLE: Record<string, string> = {
  "Mẹo học tập": "bg-amber-100 text-amber-700",
  TOEIC: "bg-sky-100 text-sky-700",
  IELTS: "bg-violet-100 text-violet-700",
  "Ngữ pháp": "bg-emerald-100 text-emerald-700",
  "Từ vựng": "bg-rose-100 text-rose-700",
};

export const SKILLS = [
  "IELTS",
  "TOEIC",
  "Business English",
  "Giao tiếp hàng ngày",
  "Ngữ pháp nâng cao",
  "Từ vựng học thuật",
  "Luyện phát âm",
  "Writing Skills",
  "Listening Intensive",
  "Reading Strategies",
  "Speaking Fluency",
];

export interface PlatformFact {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

export const PLATFORM_FACTS: PlatformFact[] = [
  {
    icon: Users,
    value: "10,000+",
    label: "Học viên tin tưởng",
    color: "text-blue-600",
  },
  {
    icon: Award,
    value: "95%",
    label: "Tỷ lệ đạt mục tiêu",
    color: "text-emerald-600",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Lộ trình đa dạng",
    color: "text-violet-600",
  },
  {
    icon: TrendingUp,
    value: "4.8★",
    label: "Đánh giá trung bình",
    color: "text-amber-500",
  },
];

export const FLASHCARD_COLORS = [
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-cyan-500",
];

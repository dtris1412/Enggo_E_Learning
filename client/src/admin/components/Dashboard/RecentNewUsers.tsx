import React, { useEffect, useState } from "react";
import { UserPlus, Mail, Calendar } from "lucide-react";
import { useUserContext } from "../../contexts/userContext";

interface NewUser {
  user_id: number;
  user_name: string;
  user_email: string;
  full_name?: string;
  created_at?: string;
  role: number;
}

interface RecentNewUsersProps {
  limit?: number;
}

const RecentNewUsers: React.FC<RecentNewUsersProps> = ({ limit = 5 }) => {
  const { users, getUsersPaginated, isLoading } = useUserContext();
  const [recentUsers, setRecentUsers] = useState<NewUser[]>([]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      // Lấy users trang đầu tiên với số lượng nhiều hơn để lọc những user mới
      await getUsersPaginated("", limit * 2, 1);
    };

    fetchRecentUsers();
  }, [limit, getUsersPaginated]);

  useEffect(() => {
    // Sắp xếp user theo created_at mới nhất và lấy top N
    if (users && users.length > 0) {
      const sorted = [...users]
        .sort((a, b) => {
          const dateA = new Date(a.created_at || "").getTime();
          const dateB = new Date(b.created_at || "").getTime();
          return dateB - dateA;
        })
        .slice(0, limit);
      setRecentUsers(sorted);
    }
  }, [users, limit]);

  const timeAgo = (dateString?: string) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  };

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 0:
        return "Người dùng";
      case 1:
        return "Admin";
      default:
        return "Khác";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <UserPlus className="h-5 w-5 text-green-600" />
        <h2 className="text-base font-semibold text-gray-900">
          User mới đăng ký
        </h2>
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {isLoading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : recentUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có user mới nào
          </p>
        ) : (
          recentUsers.map((user) => (
            <div
              key={user.user_id}
              className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar Circle */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.user_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name || user.user_name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-600 truncate">
                          {user.user_email}
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {timeAgo(user.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentNewUsers;

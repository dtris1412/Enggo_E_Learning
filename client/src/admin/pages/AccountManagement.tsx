import {
  Plus,
  Search,
  Filter,
  Edit2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "../contexts/userContext";
import { useToast } from "../../shared/components/Toast/Toast";
import AddUserModal from "../components/UserManagement/AddUserModal";
import EditUserModal from "../components/UserManagement/EditUserModal";
import ViewUserModal from "../components/UserManagement/ViewUserModal";
import ExportButton from "../components/ExportButton";
// import ViewUserModal from "../components/UserManagement/ViewUserModal";

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  full_name?: string;
  user_phone?: string;
  user_address?: string;
  avatar?: string;
  user_status: boolean;
  role: number;
  created_at?: string;
  updated_at?: string;
}

const AccountManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    isLoading,
    total,
    getUsersPaginated,
    createUser,
    updateUser,
    uploadAvatar,
    lockUser,
    unlockUser,
  } = useUserContext();
  const { showToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [searchTerm, selectedRole, selectedStatus, currentPage]);

  const loadUsers = async () => {
    const role = selectedRole === "all" ? "" : selectedRole;
    const user_status =
      selectedStatus === "all" ? "" : selectedStatus === "active";

    await getUsersPaginated(searchTerm, limit, currentPage, role, user_status);
  };

  const handleAddUser = async (userData: any) => {
    const result = await createUser(userData);
    if (result.success) {
      showToast("success", result.message || "Thêm tài khoản thành công!");
      loadUsers();
    } else {
      showToast("error", result.message || "Thêm tài khoản thất bại!");
    }
  };

  const handleEditUser = async (user_id: number, userData: any) => {
    const result = await updateUser(user_id, userData);
    if (result.success) {
      showToast("success", result.message || "Cập nhật tài khoản thành công!");
      loadUsers();
    } else {
      showToast("error", result.message || "Cập nhật tài khoản thất bại!");
    }
  };

  const handleLockUser = async (user_id: number) => {
    if (!confirm("Bạn có chắc chắn muốn khóa tài khoản này?")) return;

    const result = await lockUser(user_id);
    if (result.success) {
      showToast("success", result.message || "Khóa tài khoản thành công!");
      loadUsers();
    } else {
      showToast("error", result.message || "Khóa tài khoản thất bại!");
    }
  };

  const handleUnlockUser = async (user_id: number) => {
    if (!confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) return;

    const result = await unlockUser(user_id);
    if (result.success) {
      showToast("success", result.message || "Mở khóa tài khoản thành công!");
      loadUsers();
    } else {
      showToast("error", result.message || "Mở khóa tài khoản thất bại!");
    }
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const getRoleColor = (role: number) => {
    return role === 1
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  const getRoleText = (role: number) => {
    return role === 1 ? "Admin" : "Người dùng";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (status: boolean) => {
    return status ? "Hoạt động" : "Đã khóa";
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600">
            Quản lý người dùng và phân quyền hệ thống
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            type="users"
            filters={{
              user_status:
                selectedStatus === "all" ? "" : selectedStatus === "active",
              search: searchTerm,
            }}
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="1">Admin</option>
              <option value="2">Người dùng</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Không có dữ liệu</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.user_id}
                    onClick={() => openViewModal(user)}
                    className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      !user.user_status ? "opacity-60 bg-gray-50" : ""
                    }`}
                    title={!user.user_status ? "Tài khoản đã bị khóa" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.user_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {user.user_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.user_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                          user.role,
                        )}`}
                      >
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          user.user_status,
                        )}`}
                      >
                        {getStatusText(user.user_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.user_phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (user.user_status) {
                              openEditModal(user);
                            }
                          }}
                          disabled={!user.user_status}
                          className={`transition-colors ${
                            user.user_status
                              ? "text-blue-600 hover:text-blue-900 cursor-pointer"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title={
                            user.user_status
                              ? "Chỉnh sửa"
                              : "Tài khoản đã bị khóa"
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {user.user_status ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLockUser(user.user_id);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Khóa tài khoản"
                          >
                            <Lock className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlockUser(user.user_id);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Mở khóa tài khoản"
                          >
                            <Unlock className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading &&
        users.length > 0 &&
        totalPages > 1 &&
        (() => {
          const getPageNums = (): (number | "...")[] => {
            if (totalPages <= 7)
              return Array.from({ length: totalPages }, (_, i) => i + 1);
            const startGroup = [1, 2];
            const endGroup = [totalPages - 1, totalPages];
            const midGroup = [
              currentPage - 1,
              currentPage,
              currentPage + 1,
            ].filter((p) => p > 2 && p < totalPages - 1);
            const all = new Set([...startGroup, ...midGroup, ...endGroup]);
            const sorted = Array.from(all).sort((a, b) => a - b);
            const result: (number | "...")[] = [];
            for (let i = 0; i < sorted.length; i++) {
              if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
              result.push(sorted[i]);
            }
            return result;
          };
          return (
            <div className="flex justify-center items-center gap-5 flex-wrap py-4">
              {currentPage > 1 ? (
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  aria-label="Trang trước"
                  className="text-slate-400 hover:text-violet-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <span className="text-slate-200 cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              )}
              {getPageNums().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`e-${idx}`}
                    className="text-sm text-slate-300 select-none tracking-widest"
                    aria-hidden="true"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    aria-label={`Trang ${p}`}
                    aria-current={currentPage === p ? "page" : undefined}
                    className={
                      currentPage === p
                        ? "text-base font-semibold text-violet-600 border-b-2 border-violet-600 pb-0.5 pointer-events-none"
                        : "text-base font-medium text-slate-500 hover:text-violet-600 transition-colors pb-0.5 border-b-2 border-transparent hover:border-violet-300"
                    }
                  >
                    {p}
                  </button>
                ),
              )}
              {currentPage < totalPages ? (
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label="Trang tiếp"
                  className="text-slate-400 hover:text-violet-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <span className="text-slate-200 cursor-not-allowed">
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </div>
          );
        })()}

      {/* Modals */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={(user) => {
          setIsViewModalOpen(false);
          openEditModal(user);
        }}
        onLock={handleLockUser}
        onUnlock={handleUnlockUser}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleEditUser}
        onUploadAvatar={uploadAvatar}
      />
    </div>
  );
};

export default AccountManagement;

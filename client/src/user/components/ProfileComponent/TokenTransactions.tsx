import React, { useState, useEffect, useCallback } from "react";
import {
  Coins,
  TrendingDown,
  TrendingUp,
  Gift,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  AlertCircle,
  Sparkles,
  Brain,
  FileText,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Transaction {
  transaction_id: number;
  user_id: number;
  amount: number;
  transaction_type: "subscription_grant" | "usage" | "purchase" | "bonus";
  reference_id: number | null;
  created_at: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const TYPE_META: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }
> = {
  subscription_grant: {
    label: "Gói đăng ký",
    icon: Gift,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  usage: {
    label: "Sử dụng AI",
    icon: Brain,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  purchase: {
    label: "Mua token",
    icon: ShoppingCart,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  bonus: {
    label: "Bonus",
    icon: Sparkles,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

const FILTER_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "subscription_grant", label: "Gói đăng ký" },
  { value: "usage", label: "Sử dụng AI" },
  { value: "purchase", label: "Mua token" },
  { value: "bonus", label: "Bonus" },
];

const TokenTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(typeFilter ? { type: typeFilter } : {}),
      });
      const res = await fetch(`${API_URL}/user/transactions?${params}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Lỗi tải dữ liệu");
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 on filter change
  const handleFilterChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Compute summary stats from all fetched transactions for this filter
  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalReceived = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-bold text-slate-900">Lịch sử token AI</h2>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary badges (current page) */}
      {!loading && transactions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium">
              +{totalReceived.toLocaleString()} token nhận
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-sm">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-red-700 font-medium">
              -{totalSpent.toLocaleString()} token dùng
            </span>
          </div>
          {pagination && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
              <FileText className="w-4 h-4" />
              {pagination.total} giao dịch
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Coins className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const meta = TYPE_META[tx.transaction_type] ?? {
              label: tx.transaction_type,
              icon: Coins,
              color: "text-slate-700",
              bg: "bg-slate-50",
              border: "border-slate-200",
            };
            const Icon = meta.icon;
            const isDebit = tx.amount < 0;

            return (
              <div
                key={tx.transaction_id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${meta.border} ${meta.bg} transition-all`}
              >
                {/* Type icon */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${meta.bg} border ${meta.border}`}
                >
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${meta.color}`}>
                    {meta.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(tx.created_at)}
                    {tx.reference_id && (
                      <span className="ml-2 text-slate-400">
                        #{tx.reference_id}
                      </span>
                    )}
                  </p>
                </div>

                {/* Amount */}
                <div
                  className={`text-base font-bold tabular-nums ${
                    isDebit ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isDebit ? "−" : "+"}
                  {Math.abs(tx.amount).toLocaleString()}
                  <span className="text-xs font-normal ml-1 opacity-70">
                    token
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Trang {pagination.page} / {pagination.pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.pages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenTransactions;

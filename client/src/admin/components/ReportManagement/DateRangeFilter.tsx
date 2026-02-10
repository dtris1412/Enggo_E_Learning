import { Calendar } from "lucide-react";
import { useState } from "react";

interface DateRangeFilterProps {
  onFilterChange: (filters: { from_date?: string; to_date?: string }) => void;
  className?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onFilterChange,
  className = "",
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onFilterChange({
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    onFilterChange({});
  };

  const getQuickDateRange = (type: "today" | "week" | "month" | "year") => {
    const today = new Date();
    const from = new Date();

    switch (type) {
      case "today":
        from.setHours(0, 0, 0, 0);
        break;
      case "week":
        from.setDate(today.getDate() - 7);
        break;
      case "month":
        from.setMonth(today.getMonth() - 1);
        break;
      case "year":
        from.setFullYear(today.getFullYear() - 1);
        break;
    }

    const fromStr = from.toISOString().split("T")[0];
    const toStr = today.toISOString().split("T")[0];

    setFromDate(fromStr);
    setToDate(toStr);
    onFilterChange({
      from_date: fromStr,
      to_date: toStr,
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
      >
        <Calendar size={18} />
        <span>
          {fromDate || toDate
            ? `${fromDate || "..."} - ${toDate || "..."}`
            : "Lọc theo ngày"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <h3 className="mb-3 font-medium text-gray-900">
            Chọn khoảng thời gian
          </h3>

          {/* Quick select buttons */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            <button
              onClick={() => getQuickDateRange("today")}
              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-blue-50"
            >
              Hôm nay
            </button>
            <button
              onClick={() => getQuickDateRange("week")}
              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-blue-50"
            >
              7 ngày
            </button>
            <button
              onClick={() => getQuickDateRange("month")}
              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-blue-50"
            >
              30 ngày
            </button>
            <button
              onClick={() => getQuickDateRange("year")}
              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-blue-50"
            >
              1 năm
            </button>
          </div>

          {/* Custom date inputs */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Từ ngày
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Xóa
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DateRangeFilter;

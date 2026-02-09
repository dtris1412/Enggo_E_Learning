import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../shared/components/Toast/Toast";
import { useReport } from "../contexts/reportContext";

interface ExportButtonProps {
  type:
    | "users"
    | "courses"
    | "lessons"
    | "exams"
    | "blogs"
    | "documents"
    | "roadmaps";
  filters?: any;
  label?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  type,
  filters = {},
  label = "Xuất Excel",
  className = "",
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { quickExport } = useReport();

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await quickExport(type, filters);

      if (!blob) {
        showToast("error", "Lỗi khi xuất file");
        return;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("success", "Xuất file thành công!");
    } catch (error: any) {
      console.error("Export error:", error);
      showToast("error", "Lỗi khi xuất file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 ${className}`}
    >
      <Download size={18} />
      {loading ? "Đang xuất..." : label}
    </button>
  );
};

export default ExportButton;

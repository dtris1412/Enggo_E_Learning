import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Report {
  report_id: number;
  report_name: string;
  report_type: string;
  report_content: string;
  file_path: string;
  file_format: string;
  filters: string;
  created_at: string;
  updated_at?: string;
  user?: {
    user_id: number;
    user_name: string;
    user_email: string;
    avatar?: string;
  };
}

interface ReportPaginationResult {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ReportContextType {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  fetchReportsPaginated: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    report_type?: string;
    sortBy?: string;
    order?: string;
  }) => Promise<void>;
  getReportById: (report_id: number) => Promise<Report | null>;
  generateReport: (data: {
    report_name: string;
    report_type: string;
    filters?: any;
  }) => Promise<boolean>;
  downloadReport: (report_id: number, report_name: string) => Promise<boolean>;
  deleteReport: (report_id: number) => Promise<boolean>;
  quickExport: (type: string, filters?: any) => Promise<Blob | null>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchReportsPaginated = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      report_type?: string;
      sortBy?: string;
      order?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.report_type)
          queryParams.append("report_type", params.report_type);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.order) queryParams.append("order", params.order);

        const response = await fetch(
          `${API_URL}/admin/reports/paginated?${queryParams.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch reports");
        }

        if (result.success) {
          setReports(result.data.reports || []);
          setPagination(result.data.pagination);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getReportById = useCallback(async (report_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/reports/${report_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch report");
      }

      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch report");
      console.error("Error fetching report:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = async (data: {
    report_name: string;
    report_type: string;
    filters?: any;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/reports/generate`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate report");
      console.error("Error generating report:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (
    report_id: number,
    report_name: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/admin/reports/${report_id}/download`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Failed to download report");
        } catch {
          throw new Error("Failed to download report");
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report_name}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to download report");
      console.error("Error downloading report:", err);
      return false;
    }
  };

  const deleteReport = async (report_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/reports/${report_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete report");
      console.error("Error deleting report:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const quickExport = async (
    type: string,
    filters?: any,
  ): Promise<Blob | null> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (filters[key] !== undefined && filters[key] !== "") {
            queryParams.append(key, filters[key].toString());
          }
        });
      }

      const response = await fetch(
        `${API_URL}/admin/${type}/export?${queryParams.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Failed to export");
        } catch {
          throw new Error("Failed to export");
        }
      }

      return await response.blob();
    } catch (err: any) {
      setError(err.message || "Failed to export");
      console.error("Error exporting:", err);
      return null;
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        pagination,
        loading,
        error,
        fetchReportsPaginated,
        getReportById,
        generateReport,
        downloadReport,
        deleteReport,
        quickExport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

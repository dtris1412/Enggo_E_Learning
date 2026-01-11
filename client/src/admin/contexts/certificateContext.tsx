import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Certificate {
  certificate_id: number;
  certificate_name: string;
  description: string;
  total_score: number;
  certificate_status: boolean;
  created_at: string;
}

interface CertificateContextType {
  certificates: Certificate[];
  totalCertificates: number;
  loading: boolean;
  error: string | null;
  fetchCertificates: (
    search?: string,
    limit?: number,
    page?: number,
    certificate_status?: boolean
  ) => Promise<void>;
  createCertificate: (
    certificate_name: string,
    description: string,
    total_score: number
  ) => Promise<boolean>;
  updateCertificate: (
    certificate_id: number,
    certificate_name: string,
    description: string,
    total_score: number
  ) => Promise<boolean>;
  lockCertificate: (certificate_id: number) => Promise<boolean>;
  unlockCertificate: (certificate_id: number) => Promise<boolean>;
}

const CertificateContext = createContext<CertificateContextType | undefined>(
  undefined
);

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificate must be used within a CertificateProvider");
  }
  return context;
};

interface CertificateProviderProps {
  children: ReactNode;
}

export const CertificateProvider: React.FC<CertificateProviderProps> = ({
  children,
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No access token found in localStorage");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchCertificates = useCallback(
    async (
      search: string = "",
      limit: number = 10,
      page: number = 1,
      certificate_status?: boolean
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          search,
          limit: limit.toString(),
          page: page.toString(),
        });

        if (certificate_status !== undefined) {
          params.append("certificate_status", certificate_status.toString());
        }

        const response = await fetch(
          `${apiUrl}/admin/certificates/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (data.success) {
          setCertificates(data.data.certificates);
          setTotalCertificates(data.data.totalCertificates);
        } else {
          setError(data.message || "Failed to fetch certificates");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch certificates");
        console.error("Fetch certificates error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCertificate = useCallback(
    async (
      certificate_name: string,
      description: string,
      total_score: number
    ): Promise<boolean> => {
      try {
        const response = await fetch(`${apiUrl}/admin/certificates`, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            certificate_name,
            description,
            total_score,
          }),
        });

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCertificates();
          return true;
        }
        setError(data.message || "Failed to create certificate");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to create certificate");
        console.error("Create certificate error:", err);
        return false;
      }
    },
    [fetchCertificates]
  );

  const updateCertificate = useCallback(
    async (
      certificate_id: number,
      certificate_name: string,
      description: string,
      total_score: number
    ): Promise<boolean> => {
      try {
        const response = await fetch(
          `${apiUrl}/admin/certificates/${certificate_id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({
              certificate_name,
              description,
              total_score,
            }),
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCertificates();
          return true;
        }
        setError(data.message || "Failed to update certificate");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to update certificate");
        console.error("Update certificate error:", err);
        return false;
      }
    },
    [fetchCertificates]
  );

  const lockCertificate = useCallback(
    async (certificate_id: number): Promise<boolean> => {
      try {
        const response = await fetch(
          `${apiUrl}/admin/certificates/${certificate_id}/lock`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCertificates();
          return true;
        }
        setError(data.message || "Failed to lock certificate");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to lock certificate");
        console.error("Lock certificate error:", err);
        return false;
      }
    },
    [fetchCertificates]
  );

  const unlockCertificate = useCallback(
    async (certificate_id: number): Promise<boolean> => {
      try {
        const response = await fetch(
          `${apiUrl}/admin/certificates/${certificate_id}/unlock`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCertificates();
          return true;
        }
        setError(data.message || "Failed to unlock certificate");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to unlock certificate");
        console.error("Unlock certificate error:", err);
        return false;
      }
    },
    [fetchCertificates]
  );

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        totalCertificates,
        loading,
        error,
        fetchCertificates,
        createCertificate,
        updateCertificate,
        lockCertificate,
        unlockCertificate,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
};

/**
 * Format a number as Vietnamese currency
 * @param value - The number or string to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "1.000.000 VNĐ")
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  options?: {
    showCurrency?: boolean;
    decimals?: number;
  },
): string => {
  const { showCurrency = true, decimals = 0 } = options || {};

  if (value === null || value === undefined || value === "") {
    return showCurrency ? "0 VNĐ" : "0";
  }

  // Convert string to number if needed
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if conversion was successful
  if (isNaN(numValue)) {
    return showCurrency ? "0 VNĐ" : "0";
  }

  const formatted = numValue.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showCurrency ? `${formatted} VNĐ` : formatted;
};

/**
 * Format a date string to Vietnamese date format
 * @param dateString - The date string to format
 * @param options - Optional formatting options
 * @returns Formatted date string (e.g., "26/01/2026")
 */
export const formatDate = (
  dateString: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  return date.toLocaleDateString("vi-VN", options);
};

/**
 * Format a number with Vietnamese locale
 * @param value - The number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  decimals: number = 0,
): string => {
  if (value === null || value === undefined) return "0";

  return value.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

/**
 * Format duration in months to readable string
 * @param months - Duration in months
 * @returns Formatted duration string
 */
export const formatDuration = (months: number): string => {
  if (months < 1) return "Dưới 1 tháng";
  if (months === 1) return "1 tháng";
  if (months < 12) return `${months} tháng`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? "1 năm" : `${years} năm`;
  }

  return `${years} năm ${remainingMonths} tháng`;
};

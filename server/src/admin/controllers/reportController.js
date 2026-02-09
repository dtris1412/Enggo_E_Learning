import reportService from "../services/reportService.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy danh sách báo cáo có phân trang
const getReportsPaginated = async (req, res) => {
  try {
    const { page, limit, search, report_type, sortBy, order } = req.query;

    const result = await reportService.getReportsPaginated({
      page,
      limit,
      search,
      report_type,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get reports",
      error: error.message,
    });
  }
};

// Lấy báo cáo theo ID
const getReportById = async (req, res) => {
  try {
    const { report_id } = req.params;

    const report = await reportService.getReportById(report_id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report retrieved successfully",
      data: report,
    });
  } catch (error) {
    console.error("Get report error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get report",
      error: error.message,
    });
  }
};

// Tạo báo cáo mới và xuất Excel
const generateReport = async (req, res) => {
  try {
    const { report_name, report_type, filters } = req.body;
    const user_id = req.user.user_id; // Từ authMiddleware

    // Validate required fields
    if (!report_name || !report_type) {
      return res.status(400).json({
        success: false,
        message: "Report name and report type are required",
      });
    }

    // Validate report_type
    const validTypes = [
      "users",
      "courses",
      "lessons",
      "exams",
      "blogs",
      "documents",
      "roadmaps",
    ];
    if (!validTypes.includes(report_type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid report type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const report = await reportService.generateReport({
      report_name,
      report_type,
      filters: filters || {},
      user_id,
    });

    return res.status(201).json({
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Generate report error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

// Download file báo cáo
const downloadReport = async (req, res) => {
  try {
    const { report_id } = req.params;

    const report = await reportService.getReportById(report_id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (!report.file_path) {
      return res.status(404).json({
        success: false,
        message: "Report file not found",
      });
    }

    const filePath = path.join(__dirname, "../../../", report.file_path);

    return res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to download report",
          error: err.message,
        });
      }
    });
  } catch (error) {
    console.error("Download report error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download report",
      error: error.message,
    });
  }
};

// Xóa báo cáo
const deleteReport = async (req, res) => {
  try {
    const { report_id } = req.params;

    await reportService.deleteReport(report_id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete report",
      error: error.message,
    });
  }
};

export {
  getReportsPaginated,
  getReportById,
  generateReport,
  downloadReport,
  deleteReport,
};

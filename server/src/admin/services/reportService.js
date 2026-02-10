import db from "../../models/index.js";
import { Op } from "sequelize";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục reports nếu chưa tồn tại
const REPORTS_DIR = path.join(__dirname, "../../../upload/reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Lấy danh sách báo cáo có phân trang
const getReportsPaginated = async ({
  page = 1,
  limit = 10,
  search = "",
  report_type = "",
  sortBy = "created_at",
  order = "DESC",
}) => {
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Search theo report_name
  if (search) {
    whereClause.report_name = { [Op.like]: `%${search}%` };
  }

  // Filter theo report_type
  if (report_type) {
    whereClause.report_type = report_type;
  }

  const { count, rows } = await db.Report.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, order]],
  });

  return {
    reports: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy báo cáo theo ID
const getReportById = async (report_id) => {
  const report = await db.Report.findOne({
    where: { report_id },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
  });

  return report;
};

// Hàm helper để format dữ liệu users cho Excel
const formatUsersData = async (filters = {}) => {
  const whereClause = {};

  if (filters.user_status !== undefined) {
    whereClause.user_status = filters.user_status;
  }

  const users = await db.User.findAll({
    where: whereClause,
    order: [["created_at", "DESC"]],
  });

  return users.map((user) => ({
    ID: user.user_id,
    "Tên đăng nhập": user.user_name || "",
    "Họ và tên": user.full_name || "",
    Email: user.user_email || "",
    "Số điện thoại": user.user_phone || "",
    "Địa chỉ": user.user_address || "",
    Avatar: user.avatar || "",
    "Vai trò": user.role === 1 ? "Admin" : user.role === 2 ? "User" : "Unknown",
    "Cấp độ": user.user_level || "",
    "Trạng thái": user.user_status ? "Hoạt động" : "Khóa",
    "Ngày tạo": user.created_at
      ? new Date(user.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": user.updated_at
      ? new Date(user.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Hàm helper để format dữ liệu courses cho Excel
const formatCoursesData = async (filters = {}) => {
  const whereClause = {};

  if (filters.course_status !== undefined) {
    whereClause.course_status = filters.course_status;
  }

  const courses = await db.Course.findAll({
    where: whereClause,
    order: [["created_at", "DESC"]],
  });

  return courses.map((course) => ({
    ID: course.course_id,
    "Tiêu đề khóa học": course.course_title || "",
    "Mô tả": course.description || "",
    "Cấp độ": course.course_level || "",
    "Mục tiêu": course.course_aim || "",
    "Thời lượng ước tính (giờ)": course.estimate_duration || 0,
    "Thẻ tag": course.tag || "",
    "Giá (VND)": course.price || 0,
    "Miễn phí": course.is_free ? "Có" : "Không",
    "Trạng thái": course.course_status ? "Hoạt động" : "Khóa",
    "Ngày tạo": course.created_at
      ? new Date(course.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": course.updated_at
      ? new Date(course.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Hàm helper để format dữ liệu lessons cho Excel
const formatLessonsData = async (filters = {}) => {
  const whereClause = {};

  if (filters.lesson_status !== undefined) {
    whereClause.lesson_status = filters.lesson_status;
  }

  const lessons = await db.Lesson.findAll({
    where: whereClause,
    include: [
      {
        model: db.Skill,
        attributes: ["skill_id", "skill_name"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return lessons.map((lesson) => ({
    ID: lesson.lesson_id,
    "Tiêu đề bài học": lesson.lesson_title || "",
    "Loại bài học": lesson.lesson_type || "",
    "Cấp độ khó": lesson.difficulty_level || "",
    "Nội dung": lesson.lesson_content
      ? lesson.lesson_content.substring(0, 200) + "..."
      : "",
    "Định dạng thi": lesson.is_exam_format ? "Có" : "Không",
    "Thời gian ước tính (phút)": lesson.estimated_time || 0,
    "Kỹ năng": lesson.Skill?.skill_name || "",
    "Trạng thái": lesson.lesson_status ? "Hoạt động" : "Khóa",
    "Ngày tạo": lesson.created_at
      ? new Date(lesson.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": lesson.updated_at
      ? new Date(lesson.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Hàm helper để format dữ liệu exams cho Excel
const formatExamsData = async (filters = {}) => {
  const whereClause = {};

  if (filters.exam_type) {
    whereClause.exam_type = filters.exam_type;
  }

  const exams = await db.Exam.findAll({
    where: whereClause,
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return exams.map((exam) => ({
    ID: exam.exam_id,
    "Tiêu đề đề thi": exam.exam_title || "",
    "Thời gian thi (phút)": exam.exam_duration || 0,
    "Mã đề thi": exam.exam_code || "",
    Năm: exam.year || "",
    "Chứng chỉ": exam.Certificate?.certificate_name || "",
    "Loại đề thi": exam.exam_type || "",
    Nguồn: exam.source || "",
    "Tổng số câu hỏi": exam.total_questions || 0,
    "Ngày tạo": exam.created_at
      ? new Date(exam.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": exam.updated_at
      ? new Date(exam.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Hàm helper để format dữ liệu blogs cho Excel
const formatBlogsData = async (filters = {}) => {
  const whereClause = {};

  if (filters.blog_status) {
    whereClause.blog_status = filters.blog_status;
  }

  const blogs = await db.Blog.findAll({
    where: whereClause,
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "full_name"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return blogs.map((blog) => ({
    ID: blog.blog_id,
    "Tiêu đề": blog.blog_title || "",
    Slug: blog.slug || "",
    "Tóm tắt": blog.excerpt || "",
    "Nội dung": blog.blog_content
      ? blog.blog_content.substring(0, 200) + "..."
      : "",
    "Danh mục": blog.category || "",
    "Ảnh thumbnail": blog.blog_thumbnail || "",
    "Tác giả ID": blog.user_id || "",
    "Tác giả": blog.User?.full_name || blog.User?.user_name || "",
    "Lượt xem": blog.views_count || 0,
    "Trạng thái":
      blog.blog_status === "published"
        ? "Đã xuất bản"
        : blog.blog_status === "draft"
          ? "Nháp"
          : "Ẩn",
    "Ngày tạo": blog.created_at
      ? new Date(blog.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": blog.updated_at
      ? new Date(blog.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Hàm helper để format dữ liệu documents cho Excel
const formatDocumentsData = async (filters = {}) => {
  const whereClause = {};

  if (filters.document_type) {
    whereClause.document_type = filters.document_type;
  }

  const documents = await db.Document.findAll({
    where: whereClause,
    order: [["created_at", "DESC"]],
  });

  return documents.map((doc) => ({
    ID: doc.document_id,
    "Tên tài liệu": doc.document_name || "",
    "Mô tả": doc.document_description || "",
    "Loại tài liệu": doc.document_type || "",
    URL: doc.document_url || "",
    "Loại file": doc.file_type || "",
    "Kích thước": doc.document_size || "",
    "Ngày tạo": doc.created_at
      ? new Date(doc.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": doc.updated_at
      ? new Date(doc.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Hàm helper để format dữ liệu roadmaps cho Excel
const formatRoadmapsData = async (filters = {}) => {
  const whereClause = {};

  if (filters.roadmap_status !== undefined) {
    whereClause.roadmap_status = filters.roadmap_status;
  }

  if (filters.roadmap_level) {
    whereClause.roadmap_level = filters.roadmap_level;
  }

  const roadmaps = await db.Roadmap.findAll({
    where: whereClause,
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return roadmaps.map((roadmap) => ({
    ID: roadmap.roadmap_id,
    "Tiêu đề lộ trình": roadmap.roadmap_title || "",
    "Mô tả": roadmap.roadmap_description || "",
    "Mục tiêu": roadmap.roadmap_aim || "",
    "Cấp độ": roadmap.roadmap_level || "",
    "Thời lượng ước tính (giờ)": roadmap.estimated_duration || 0,
    "Chứng chỉ": roadmap.Certificate?.certificate_name || "",
    "Giảm giá (%)": roadmap.discount_percent || 0,
    "Giá (VND)": roadmap.roadmap_price || 0,
    "Trạng thái": roadmap.roadmap_status ? "Hoạt động" : "Khóa",
    "Ngày tạo": roadmap.created_at
      ? new Date(roadmap.created_at).toLocaleString("vi-VN")
      : "",
    "Ngày cập nhật": roadmap.updated_at
      ? new Date(roadmap.updated_at).toLocaleString("vi-VN")
      : "",
  }));
};

// Tạo file Excel từ dữ liệu
const createExcelFile = async (data, reportName, reportType) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Thêm tiêu đề
  worksheet.addRow([reportName]);
  worksheet.mergeCells("A1:G1");
  worksheet.getCell("A1").font = { size: 16, bold: true };
  worksheet.getCell("A1").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // Thêm thông tin báo cáo
  worksheet.addRow([`Loại báo cáo: ${reportType}`]);
  worksheet.addRow([`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`]);
  worksheet.addRow([`Tổng số bản ghi: ${data.length}`]);
  worksheet.addRow([]); // Dòng trống

  if (data.length > 0) {
    // Thêm header
    const headers = Object.keys(data[0]);
    const headerRow = worksheet.addRow(headers);

    // Style cho header
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Thêm dữ liệu
    data.forEach((item) => {
      worksheet.addRow(Object.values(item));
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        maxLength = Math.max(maxLength, cellLength);
      });
      column.width = Math.min(maxLength + 2, 50);
    });

    // Thêm borders cho bảng dữ liệu
    const dataStartRow = 6; // Dòng bắt đầu của header
    const dataEndRow = dataStartRow + data.length;
    for (let row = dataStartRow; row <= dataEndRow; row++) {
      for (let col = 1; col <= headers.length; col++) {
        worksheet.getCell(row, col).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }
  }

  // Lưu file
  const timestamp = Date.now();
  const fileName = `${reportType}_${timestamp}.xlsx`;
  const filePath = path.join(REPORTS_DIR, fileName);

  await workbook.xlsx.writeFile(filePath);

  return {
    fileName,
    filePath: `/upload/reports/${fileName}`,
  };
};

// Tạo báo cáo mới và xuất Excel
const generateReport = async ({
  report_name,
  report_type,
  filters = {},
  user_id,
}) => {
  let data = [];
  let reportContent = "";

  // Lấy dữ liệu theo loại báo cáo
  switch (report_type) {
    case "users":
      data = await formatUsersData(filters);
      reportContent = `Báo cáo người dùng - Tổng: ${data.length}`;
      break;

    case "courses":
      data = await formatCoursesData(filters);
      reportContent = `Báo cáo khóa học - Tổng: ${data.length}`;
      break;

    case "lessons":
      data = await formatLessonsData(filters);
      reportContent = `Báo cáo bài học - Tổng: ${data.length}`;
      break;

    case "exams":
      data = await formatExamsData(filters);
      reportContent = `Báo cáo đề thi - Tổng: ${data.length}`;
      break;

    case "blogs":
      data = await formatBlogsData(filters);
      reportContent = `Báo cáo tin tức - Tổng: ${data.length}`;
      break;

    case "documents":
      data = await formatDocumentsData(filters);
      reportContent = `Báo cáo tài liệu - Tổng: ${data.length}`;
      break;

    case "roadmaps":
      data = await formatRoadmapsData(filters);
      reportContent = `Báo cáo lộ trình - Tổng: ${data.length}`;
      break;

    default:
      throw new Error("Invalid report type");
  }

  // Tạo file Excel
  const { fileName, filePath } = await createExcelFile(
    data,
    report_name,
    report_type,
  );

  // Lưu thông tin báo cáo vào DB
  const report = await db.Report.create({
    report_name,
    report_type,
    report_content: reportContent,
    file_path: filePath,
    file_format: "excel",
    filters: JSON.stringify(filters),
    user_id,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return report;
};

// Xóa báo cáo
const deleteReport = async (report_id) => {
  const report = await db.Report.findByPk(report_id);

  if (!report) {
    throw new Error("Report not found");
  }

  // Xóa file Excel nếu tồn tại
  if (report.file_path) {
    const fullPath = path.join(__dirname, "../../../", report.file_path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  // Xóa record trong DB
  await report.destroy();

  return { message: "Report deleted successfully" };
};

export default {
  getReportsPaginated,
  getReportById,
  generateReport,
  deleteReport,
};

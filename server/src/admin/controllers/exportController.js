import excelExportService from "../../shared/services/excelExportService.js";
import db from "../../models/index.js";
import { Op } from "sequelize";

// Export Courses to Excel
const exportCoursesToExcel = async (req, res) => {
  try {
    const { course_status, search } = req.query;
    const whereClause = {};

    if (course_status !== undefined) {
      whereClause.course_status =
        course_status === "true" || course_status === true;
    }

    if (search) {
      whereClause.course_title = { [Op.like]: `%${search}%` };
    }

    const courses = await db.Course.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "course_id", width: 10 },
      { header: "Tiêu đề khóa học", key: "course_title", width: 40 },
      { header: "Mô tả", key: "description", width: 50 },
      { header: "Cấp độ", key: "course_level", width: 15 },
      { header: "Mục tiêu", key: "course_aim", width: 40 },
      {
        header: "Thời lượng ước tính (giờ)",
        key: "estimate_duration",
        width: 25,
      },
      { header: "Thẻ tag", key: "tag", width: 20 },
      { header: "Giá (VND)", key: "price", width: 15 },
      { header: "Miễn phí", key: "is_free", width: 12 },
      { header: "Trạng thái", key: "course_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = courses.map((course) => ({
      course_id: course.course_id,
      course_title: course.course_title || "",
      description: course.description || "",
      course_level: course.course_level || "",
      course_aim: course.course_aim || "",
      estimate_duration: course.estimate_duration || 0,
      tag: course.tag || "",
      price: course.price || 0,
      is_free: course.is_free ? "Có" : "Không",
      course_status: course.course_status ? "Hoạt động" : "Khóa",
      created_at: course.created_at
        ? new Date(course.created_at).toLocaleString("vi-VN")
        : "",
    }));

    excelExportService.addWorksheet(workbook, "Courses", columns, data);

    const filename = `courses_${Date.now()}.xlsx`;
    await excelExportService.writeToResponse(workbook, res, filename);
  } catch (err) {
    console.error("Error in export courses:", err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};

// Export Lessons to Excel
const exportLessonsToExcel = async (req, res) => {
  try {
    const { lesson_status, search } = req.query;
    const whereClause = {};

    if (lesson_status !== undefined) {
      whereClause.lesson_status =
        lesson_status === "true" || lesson_status === true;
    }

    if (search) {
      whereClause.lesson_title = { [Op.like]: `%${search}%` };
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

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "lesson_id", width: 10 },
      { header: "Tiêu đề bài học", key: "lesson_title", width: 40 },
      { header: "Loại bài học", key: "lesson_type", width: 20 },
      { header: "Cấp độ khó", key: "difficulty_level", width: 15 },
      { header: "Nội dung", key: "lesson_content", width: 50 },
      { header: "Định dạng thi", key: "is_exam_format", width: 15 },
      { header: "Thời gian ước tính (phút)", key: "estimated_time", width: 25 },
      { header: "Kỹ năng", key: "skill_name", width: 20 },
      { header: "Trạng thái", key: "lesson_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = lessons.map((lesson) => ({
      lesson_id: lesson.lesson_id,
      lesson_title: lesson.lesson_title || "",
      lesson_type: lesson.lesson_type || "",
      difficulty_level: lesson.difficulty_level || "",
      lesson_content: lesson.lesson_content
        ? lesson.lesson_content.substring(0, 200) + "..."
        : "",
      is_exam_format: lesson.is_exam_format ? "Có" : "Không",
      estimated_time: lesson.estimated_time || 0,
      skill_name: lesson.Skill?.skill_name || "",
      lesson_status: lesson.lesson_status ? "Hoạt động" : "Khóa",
      created_at: lesson.created_at
        ? new Date(lesson.created_at).toLocaleString("vi-VN")
        : "",
    }));

    excelExportService.addWorksheet(workbook, "Lessons", columns, data);

    const filename = `lessons_${Date.now()}.xlsx`;
    await excelExportService.writeToResponse(workbook, res, filename);
  } catch (err) {
    console.error("Error in export lessons:", err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};

// Export Exams to Excel
const exportExamsToExcel = async (req, res) => {
  try {
    const { exam_type, search } = req.query;
    const whereClause = {};

    if (exam_type) {
      whereClause.exam_type = exam_type;
    }

    if (search) {
      whereClause.exam_title = { [Op.like]: `%${search}%` };
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

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "exam_id", width: 10 },
      { header: "Tiêu đề đề thi", key: "exam_title", width: 40 },
      { header: "Thời gian thi (phút)", key: "exam_duration", width: 20 },
      { header: "Mã đề thi", key: "exam_code", width: 15 },
      { header: "Năm", key: "year", width: 10 },
      { header: "Chứng chỉ", key: "certificate_name", width: 30 },
      { header: "Loại đề thi", key: "exam_type", width: 15 },
      { header: "Nguồn", key: "source", width: 25 },
      { header: "Tổng số câu hỏi", key: "total_questions", width: 18 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = exams.map((exam) => ({
      exam_id: exam.exam_id,
      exam_title: exam.exam_title || "",
      exam_duration: exam.exam_duration || 0,
      exam_code: exam.exam_code || "",
      year: exam.year || "",
      certificate_name: exam.Certificate?.certificate_name || "",
      exam_type: exam.exam_type || "",
      source: exam.source || "",
      total_questions: exam.total_questions || 0,
      created_at: exam.created_at
        ? new Date(exam.created_at).toLocaleString("vi-VN")
        : "",
    }));

    excelExportService.addWorksheet(workbook, "Exams", columns, data);

    const filename = `exams_${Date.now()}.xlsx`;
    await excelExportService.writeToResponse(workbook, res, filename);
  } catch (err) {
    console.error("Error in export exams:", err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};

// Export Blogs to Excel
const exportBlogsToExcel = async (req, res) => {
  try {
    const { blog_status, search, category } = req.query;
    const whereClause = {};

    if (blog_status) {
      whereClause.blog_status = blog_status;
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause[Op.or] = [
        { blog_title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
      ];
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

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "blog_id", width: 10 },
      { header: "Tiêu đề", key: "blog_title", width: 40 },
      { header: "Slug", key: "slug", width: 40 },
      { header: "Tóm tắt", key: "excerpt", width: 50 },
      { header: "Danh mục", key: "category", width: 20 },
      { header: "Ảnh thumbnail", key: "blog_thumbnail", width: 50 },
      { header: "Tác giả", key: "author", width: 25 },
      { header: "Lượt xem", key: "views_count", width: 12 },
      { header: "Trạng thái", key: "blog_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = blogs.map((blog) => ({
      blog_id: blog.blog_id,
      blog_title: blog.blog_title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      category: blog.category || "",
      blog_thumbnail: blog.blog_thumbnail || "",
      author: blog.User?.full_name || blog.User?.user_name || "",
      views_count: blog.views_count || 0,
      blog_status:
        blog.blog_status === "published"
          ? "Đã xuất bản"
          : blog.blog_status === "draft"
            ? "Nháp"
            : "Ẩn",
      created_at: blog.created_at
        ? new Date(blog.created_at).toLocaleString("vi-VN")
        : "",
    }));

    excelExportService.addWorksheet(workbook, "Blogs", columns, data);

    const filename = `blogs_${Date.now()}.xlsx`;
    await excelExportService.writeToResponse(workbook, res, filename);
  } catch (err) {
    console.error("Error in export blogs:", err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};

// Export Documents to Excel
const exportDocumentsToExcel = async (req, res) => {
  try {
    const { search, document_type } = req.query;
    const whereClause = {};

    if (search) {
      whereClause.document_name = { [Op.like]: `%${search}%` };
    }

    if (document_type) {
      whereClause.document_type = document_type;
    }

    const documents = await db.Document.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "document_id", width: 10 },
      { header: "Tên tài liệu", key: "document_name", width: 40 },
      { header: "Mô tả", key: "document_description", width: 50 },
      { header: "Loại tài liệu", key: "document_type", width: 20 },
      { header: "URL", key: "document_url", width: 50 },
      { header: "Loại file", key: "file_type", width: 15 },
      { header: "Kích thước", key: "document_size", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = documents.map((doc) => ({
      document_id: doc.document_id,
      document_name: doc.document_name || "",
      document_description: doc.document_description || "",
      document_type: doc.document_type || "",
      document_url: doc.document_url || "",
      file_type: doc.file_type || "",
      document_size: doc.document_size || "",
      created_at: doc.created_at
        ? new Date(doc.created_at).toLocaleString("vi-VN")
        : "",
    }));

    excelExportService.addWorksheet(workbook, "Documents", columns, data);

    const filename = `documents_${Date.now()}.xlsx`;
    await excelExportService.writeToResponse(workbook, res, filename);
  } catch (err) {
    console.error("Error in export documents:", err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};

// Export Roadmaps to Excel
const exportRoadmapsToExcel = async (req, res) => {
  try {
    const { roadmap_status, search, roadmap_level } = req.query;
    const whereClause = {};

    if (roadmap_status !== undefined) {
      whereClause.roadmap_status =
        roadmap_status === "true" || roadmap_status === true;
    }

    if (roadmap_level) {
      whereClause.roadmap_level = roadmap_level;
    }

    if (search) {
      whereClause.roadmap_title = { [Op.like]: `%${search}%` };
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

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "roadmap_id", width: 10 },
      { header: "Tiêu đề lộ trình", key: "roadmap_title", width: 40 },
      { header: "Mô tả", key: "roadmap_description", width: 50 },
      { header: "Mục tiêu", key: "roadmap_aim", width: 40 },
      { header: "Cấp độ", key: "roadmap_level", width: 15 },
      {
        header: "Thời lượng ước tính (giờ)",
        key: "estimated_duration",
        width: 25,
      },
      { header: "Chứng chỉ", key: "certificate_name", width: 30 },
      { header: "Giảm giá (%)", key: "discount_percent", width: 15 },
      { header: "Giá (VND)", key: "roadmap_price", width: 15 },
      { header: "Trạng thái", key: "roadmap_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = roadmaps.map((roadmap) => ({
      roadmap_id: roadmap.roadmap_id,
      roadmap_title: roadmap.roadmap_title || "",
      roadmap_description: roadmap.roadmap_description || "",
      roadmap_aim: roadmap.roadmap_aim || "",
      roadmap_level: roadmap.roadmap_level || "",
      estimated_duration: roadmap.estimated_duration || 0,
      certificate_name: roadmap.Certificate?.certificate_name || "",
      discount_percent: roadmap.discount_percent || 0,
      roadmap_price: roadmap.roadmap_price || 0,
      roadmap_status: roadmap.roadmap_status ? "Hoạt động" : "Khóa",
      created_at: roadmap.created_at
        ? new Date(roadmap.created_at).toLocaleString("vi-VN")
        : "",
    }));

    excelExportService.addWorksheet(workbook, "Roadmaps", columns, data);

    const filename = `roadmaps_${Date.now()}.xlsx`;
    await excelExportService.writeToResponse(workbook, res, filename);
  } catch (err) {
    console.error("Error in export roadmaps:", err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};

export {
  exportCoursesToExcel,
  exportLessonsToExcel,
  exportExamsToExcel,
  exportBlogsToExcel,
  exportDocumentsToExcel,
  exportRoadmapsToExcel,
};

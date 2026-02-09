import excelExportService from "../../shared/services/excelExportService.js";
import db from "../../models/index.js";
import { Op } from "sequelize";

// Export Courses to Excel
const exportCoursesToExcel = async (req, res) => {
  try {
    const { course_status, search } = req.query;
    const whereClause = {};

    if (course_status) {
      whereClause.course_status = course_status;
    }

    if (search) {
      whereClause.course_name = { [Op.like]: `%${search}%` };
    }

    const courses = await db.Course.findAll({
      where: whereClause,
      include: [
        {
          model: db.Certificate,
          attributes: ["certificate_id", "certificate_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "course_id", width: 10 },
      { header: "Tên khóa học", key: "course_name", width: 40 },
      { header: "Mô tả", key: "course_description", width: 50 },
      { header: "Chứng chỉ", key: "certificate_name", width: 30 },
      { header: "Trạng thái", key: "course_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = courses.map((course) => ({
      course_id: course.course_id,
      course_name: course.course_name,
      course_description: course.course_description || "",
      certificate_name: course.Certificate?.certificate_name || "",
      course_status: course.course_status,
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

    if (lesson_status) {
      whereClause.lesson_status = lesson_status;
    }

    if (search) {
      whereClause.lesson_name = { [Op.like]: `%${search}%` };
    }

    const lessons = await db.Lesson.findAll({
      where: whereClause,
      include: [
        {
          model: db.Skill,
          attributes: ["skill_id", "skill_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "lesson_id", width: 10 },
      { header: "Tên bài học", key: "lesson_name", width: 40 },
      { header: "Mô tả", key: "lesson_description", width: 50 },
      { header: "Kỹ năng", key: "skill_name", width: 20 },
      { header: "Trạng thái", key: "lesson_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = lessons.map((lesson) => ({
      lesson_id: lesson.lesson_id,
      lesson_name: lesson.lesson_name,
      lesson_description: lesson.lesson_description || "",
      skill_name: lesson.Skill?.skill_name || "",
      lesson_status: lesson.lesson_status,
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
    const { exam_status, search } = req.query;
    const whereClause = {};

    if (exam_status) {
      whereClause.exam_status = exam_status;
    }

    if (search) {
      whereClause.exam_name = { [Op.like]: `%${search}%` };
    }

    const exams = await db.Exam.findAll({
      where: whereClause,
      include: [
        {
          model: db.Skill,
          attributes: ["skill_id", "skill_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "exam_id", width: 10 },
      { header: "Tên đề thi", key: "exam_name", width: 40 },
      { header: "Mô tả", key: "exam_description", width: 50 },
      { header: "Kỹ năng", key: "skill_name", width: 20 },
      { header: "Thời gian (phút)", key: "duration", width: 15 },
      { header: "Trạng thái", key: "exam_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = exams.map((exam) => ({
      exam_id: exam.exam_id,
      exam_name: exam.exam_name,
      exam_description: exam.exam_description || "",
      skill_name: exam.Skill?.skill_name || "",
      duration: exam.duration || "",
      exam_status: exam.exam_status,
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
          attributes: ["user_id", "user_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "blog_id", width: 10 },
      { header: "Tiêu đề", key: "blog_title", width: 40 },
      { header: "Tóm tắt", key: "excerpt", width: 50 },
      { header: "Danh mục", key: "category", width: 20 },
      { header: "Tác giả", key: "author", width: 25 },
      { header: "Lượt xem", key: "views_count", width: 12 },
      { header: "Trạng thái", key: "blog_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = blogs.map((blog) => ({
      blog_id: blog.blog_id,
      blog_title: blog.blog_title,
      excerpt: blog.excerpt || "",
      category: blog.category || "",
      author: blog.User?.user_name || "",
      views_count: blog.views_count || 0,
      blog_status: blog.blog_status,
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
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause.document_name = { [Op.like]: `%${search}%` };
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
      { header: "URL", key: "document_url", width: 50 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = documents.map((doc) => ({
      document_id: doc.document_id,
      document_name: doc.document_name,
      document_description: doc.document_description || "",
      document_url: doc.document_url || "",
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
    const { roadmap_status, search } = req.query;
    const whereClause = {};

    if (roadmap_status) {
      whereClause.roadmap_status = roadmap_status;
    }

    if (search) {
      whereClause.roadmap_name = { [Op.like]: `%${search}%` };
    }

    const roadmaps = await db.Roadmap.findAll({
      where: whereClause,
      include: [
        {
          model: db.Skill,
          attributes: ["skill_id", "skill_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const workbook = excelExportService.createWorkbook();

    const columns = [
      { header: "ID", key: "roadmap_id", width: 10 },
      { header: "Tên lộ trình", key: "roadmap_name", width: 40 },
      { header: "Mô tả", key: "roadmap_description", width: 50 },
      { header: "Kỹ năng", key: "skill_name", width: 20 },
      { header: "Trạng thái", key: "roadmap_status", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
    ];

    const data = roadmaps.map((roadmap) => ({
      roadmap_id: roadmap.roadmap_id,
      roadmap_name: roadmap.roadmap_name,
      roadmap_description: roadmap.roadmap_description || "",
      skill_name: roadmap.Skill?.skill_name || "",
      roadmap_status: roadmap.roadmap_status,
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

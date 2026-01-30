import blogService from "../services/blogService.js";
import uploadService from "../../shared/services/uploadService.js";
import viewTracker from "../../shared/services/viewTracker.js";

// Lấy danh sách blogs có phân trang
const getBlogsPaginated = async (req, res) => {
  try {
    const { page, limit, search, status, category, sortBy, order } = req.query;

    const result = await blogService.getBlogsPaginated({
      page,
      limit,
      search,
      status,
      category,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get blogs",
      error: error.message,
    });
  }
};

// Lấy blog theo ID
const getBlogById = async (req, res) => {
  try {
    const { blog_id } = req.params;

    const blog = await blogService.getBlogById(blog_id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get blog",
      error: error.message,
    });
  }
};

// Lấy blog theo slug (SEO-friendly)
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await blogService.getBlogBySlug(slug);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Chỉ tăng view cho blog đã published
    if (blog.blog_status === "published") {
      // Check xem user đã view trong 24h chưa (dựa vào IP/User-Agent)
      const canIncrement = viewTracker.trackView(req, blog.blog_id);

      if (canIncrement) {
        await blogService.incrementViewsCount(blog.blog_id, true);
        // Refresh blog data để có view count mới
        const updatedBlog = await blogService.getBlogBySlug(slug);
        return res.status(200).json({
          success: true,
          message: "Blog retrieved successfully",
          data: updatedBlog,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get blog",
      error: error.message,
    });
  }
};

// Tạo blog mới
const createBlog = async (req, res) => {
  try {
    const { blog_title, excerpt, blog_content, blog_status, category } =
      req.body;
    const user_id = req.user.user_id; // Từ authMiddleware

    // Validate required fields
    if (!blog_title || !excerpt || !blog_content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, content, and category are required",
      });
    }

    // Validate category
    const validCategories = [
      "Mẹo học tập",
      "TOEIC",
      "IELTS",
      "Ngữ pháp",
      "Từ vựng",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category. Must be one of: Mẹo học tập, TOEIC, IELTS, Ngữ pháp, Từ vựng",
      });
    }

    // Upload thumbnail nếu có
    let blog_thumbnail = null;
    if (req.file) {
      const uploadResult = await uploadService.uploadBlogThumbnail(req.file);
      blog_thumbnail = uploadResult.url;
    }

    const blog = await blogService.createBlog({
      blog_title,
      excerpt,
      blog_content, // Markdown
      blog_thumbnail,
      category,
      blog_status: blog_status || "draft",
      user_id,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// Cập nhật blog
const updateBlog = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const { blog_title, excerpt, blog_content, blog_status, category } =
      req.body;

    const updateData = {};

    if (blog_title) updateData.blog_title = blog_title;
    if (excerpt) updateData.excerpt = excerpt;
    if (blog_content) updateData.blog_content = blog_content;
    if (blog_status) updateData.blog_status = blog_status;

    // Validate and update category
    if (category) {
      const validCategories = [
        "Mẹo học tập",
        "TOEIC",
        "IELTS",
        "Ngữ pháp",
        "Từ vựng",
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category. Must be one of: Mẹo học tập, TOEIC, IELTS, Ngữ pháp, Từ vựng",
        });
      }
      updateData.category = category;
    }

    // Upload thumbnail mới nếu có
    if (req.file) {
      const uploadResult = await uploadService.uploadBlogThumbnail(req.file);
      updateData.blog_thumbnail = uploadResult.url;

      // TODO: Xóa thumbnail cũ từ Cloudinary nếu cần
    }

    const blog = await blogService.updateBlog(blog_id, updateData);

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update blog",
      error: error.message,
    });
  }
};

// Thay đổi trạng thái blog
const updateBlogStatus = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const { blog_status } = req.body;

    if (
      !blog_status ||
      !["draft", "published", "hidden"].includes(blog_status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog status. Must be: draft, published, or hidden",
      });
    }

    const blog = await blogService.updateBlogStatus(blog_id, blog_status);

    return res.status(200).json({
      success: true,
      message: "Blog status updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update blog status",
      error: error.message,
    });
  }
};

// Xóa blog
const deleteBlog = async (req, res) => {
  try {
    const { blog_id } = req.params;

    await blogService.deleteBlog(blog_id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete blog",
      error: error.message,
    });
  }
};

// Lấy blogs mới nhất (public)
const getLatestBlogs = async (req, res) => {
  try {
    const { limit } = req.query;

    const blogs = await blogService.getLatestBlogs(limit);

    return res.status(200).json({
      success: true,
      message: "Latest blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Get latest blogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get latest blogs",
      error: error.message,
    });
  }
};

// Lấy blogs phổ biến (public)
const getPopularBlogs = async (req, res) => {
  try {
    const { limit } = req.query;

    const blogs = await blogService.getPopularBlogs(limit);

    return res.status(200).json({
      success: true,
      message: "Popular blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Get popular blogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get popular blogs",
      error: error.message,
    });
  }
};

export {
  getBlogsPaginated,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
  getLatestBlogs,
  getPopularBlogs,
};

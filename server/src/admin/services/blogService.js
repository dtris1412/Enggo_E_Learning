import db from "../../models/index.js";
import { Op } from "sequelize";

// Tạo slug từ title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "") // Chỉ giữ chữ, số, space, gạch ngang
    .replace(/\s+/g, "-") // Thay space thành gạch ngang
    .replace(/-+/g, "-") // Loại bỏ gạch ngang trùng
    .replace(/^-+|-+$/g, ""); // Bỏ gạch ngang đầu cuối
};

// Tạo slug unique
const generateUniqueSlug = async (title, excludeBlogId = null) => {
  let slug = generateSlug(title);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const whereClause = { slug };
    if (excludeBlogId) {
      whereClause.blog_id = { [Op.ne]: excludeBlogId };
    }

    const existingBlog = await db.Blog.findOne({ where: whereClause });

    if (!existingBlog) {
      isUnique = true;
    } else {
      slug = `${generateSlug(title)}-${counter}`;
      counter++;
    }
  }

  return slug;
};

// Lấy tất cả blogs (có phân trang, filter, search)
const getBlogsPaginated = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  category = "",
  sortBy = "created_at",
  order = "DESC",
}) => {
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Search theo title hoặc excerpt
  if (search) {
    whereClause[Op.or] = [
      { blog_title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filter theo status
  if (status) {
    whereClause.blog_status = status;
  }
  // Filter theo category
  if (category) {
    whereClause.category = category;
  }

  const { count, rows } = await db.Blog.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, order]],
  });

  return {
    blogs: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy blog theo ID
const getBlogById = async (blog_id) => {
  const blog = await db.Blog.findOne({
    where: { blog_id },
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
  });

  return blog;
};

// Lấy blog theo slug (cho SEO)
const getBlogBySlug = async (slug) => {
  const blog = await db.Blog.findOne({
    where: { slug },
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
  });

  return blog;
};

// Tăng views count (với tracking để tránh spam)
const incrementViewsCount = async (blog_id, shouldIncrement = true) => {
  const blog = await db.Blog.findByPk(blog_id);
  if (!blog) {
    throw new Error("Blog not found");
  }

  // Chỉ tăng view nếu được phép (đã check ở controller)
  if (shouldIncrement) {
    blog.views_count = blog.views_count + 1;
    await blog.save();
  }

  return blog;
};

// Tạo blog mới
const createBlog = async ({
  blog_title,
  excerpt,
  blog_content,
  blog_thumbnail,
  category,
  blog_status,
  user_id,
}) => {
  // Tự động tạo slug từ title
  const slug = await generateUniqueSlug(blog_title);

  const blog = await db.Blog.create({
    blog_title,
    slug,
    excerpt,
    blog_content, // Markdown content
    blog_thumbnail,
    blog_status,
    views_count: 0,
    user_id,
    created_at: new Date(),
    updated_at: new Date(),
    category,
  });

  return blog;
};

// Cập nhật blog
const updateBlog = async (blog_id, data) => {
  const blog = await db.Blog.findByPk(blog_id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Nếu title thay đổi, tạo slug mới
  if (data.blog_title && data.blog_title !== blog.blog_title) {
    data.slug = await generateUniqueSlug(data.blog_title, blog_id);
  }

  data.updated_at = new Date();

  await blog.update(data);

  return blog;
};

// Thay đổi trạng thái blog
const updateBlogStatus = async (blog_id, blog_status) => {
  const blog = await db.Blog.findByPk(blog_id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  blog.blog_status = blog_status;
  blog.updated_at = new Date();
  await blog.save();

  return blog;
};

// Xóa blog (soft delete bằng cách chuyển sang hidden hoặc hard delete)
const deleteBlog = async (blog_id) => {
  const blog = await db.Blog.findByPk(blog_id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Hard delete
  await blog.destroy();

  return { message: "Blog deleted successfully" };
};

// Lấy blogs mới nhất (public API)
const getLatestBlogs = async (limit = 5) => {
  const blogs = await db.Blog.findAll({
    where: { blog_status: "published" },
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "avatar"],
      },
    ],
    limit: parseInt(limit),
    order: [["created_at", "DESC"]],
  });

  return blogs;
};

// Lấy blogs phổ biến (theo views)
const getPopularBlogs = async (limit = 5) => {
  const blogs = await db.Blog.findAll({
    where: { blog_status: "published" },
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "avatar"],
      },
    ],
    limit: parseInt(limit),
    order: [["views_count", "DESC"]],
  });

  return blogs;
};

export default {
  getBlogsPaginated,
  getBlogById,
  getBlogBySlug,
  incrementViewsCount,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
  getLatestBlogs,
  getPopularBlogs,
};

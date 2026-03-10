import db from "../../models/index.js";
import viewTracker from "../../shared/services/viewTracker.js";

const getBlogsPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  category,
  sortBy = "created_at",
  sortOrder = "DESC",
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  const whereConditions = {
    blog_status: "published", // Only show published blogs to users
  };

  if (search && search.trim()) {
    whereConditions[Op.or] = [
      { blog_title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } },
    ];
  }

  if (category) {
    whereConditions.category = category;
  }

  // Validate sortBy field
  const allowedSortFields = [
    "created_at",
    "views_count",
    "blog_title",
    "updated_at",
  ];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  const { count, rows } = await db.Blog.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset: Number(offset),
    order: [[validSortBy, validSortOrder]],
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
    attributes: {
      include: [
        // Count likes for each blog
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM blog_likes
            WHERE blog_likes.blog_id = Blog.blog_id
          )`),
          "likes_count",
        ],
        // Count comments for each blog
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM blog_comments
            WHERE blog_comments.blog_id = Blog.blog_id
          )`),
          "comments_count",
        ],
      ],
    },
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      blogs: rows,
    },
  };
};

const getBlogById = async (blog_id, req, user_id = null) => {
  if (!blog_id) {
    return { success: false, message: "Blog ID is required." };
  }

  const blog = await db.Blog.findByPk(blog_id, {
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
    attributes: {
      include: [
        // Count likes
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM blog_likes
            WHERE blog_likes.blog_id = Blog.blog_id
          )`),
          "likes_count",
        ],
        // Count comments
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM blog_comments
            WHERE blog_comments.blog_id = Blog.blog_id
          )`),
          "comments_count",
        ],
        // Check if current user liked this blog
        ...(user_id
          ? [
              [
                db.Sequelize.literal(`(
                  SELECT COUNT(*) > 0
                  FROM blog_likes
                  WHERE blog_likes.blog_id = Blog.blog_id
                  AND blog_likes.user_id = ${user_id}
                )`),
                "user_liked",
              ],
            ]
          : []),
      ],
    },
  });

  if (!blog) {
    return { success: false, message: "Blog not found." };
  }

  // Only allow viewing published blogs (unless admin - can be added later)
  if (blog.blog_status !== "published") {
    return { success: false, message: "Blog is not available." };
  }

  // Track view and increment count if this is a unique view in 24h
  if (req && viewTracker.trackView(req, `blog_${blog_id}`)) {
    blog.views_count = (blog.views_count || 0) + 1;
    await blog.save();
  }

  return { success: true, data: blog };
};

const getBlogBySlug = async (slug, req, user_id = null) => {
  if (!slug) {
    return { success: false, message: "Blog slug is required." };
  }

  const blog = await db.Blog.findOne({
    where: { slug },
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
    ],
    attributes: {
      include: [
        // Count likes
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM blog_likes
            WHERE blog_likes.blog_id = Blog.blog_id
          )`),
          "likes_count",
        ],
        // Count comments
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM blog_comments
            WHERE blog_comments.blog_id = Blog.blog_id
          )`),
          "comments_count",
        ],
        // Check if current user liked this blog
        ...(user_id
          ? [
              [
                db.Sequelize.literal(`(
                  SELECT COUNT(*) > 0
                  FROM blog_likes
                  WHERE blog_likes.blog_id = Blog.blog_id
                  AND blog_likes.user_id = ${user_id}
                )`),
                "user_liked",
              ],
            ]
          : []),
      ],
    },
  });

  if (!blog) {
    return { success: false, message: "Blog not found." };
  }

  // Only allow viewing published blogs
  if (blog.blog_status !== "published") {
    return { success: false, message: "Blog is not available." };
  }

  // Track view and increment count if this is a unique view in 24h
  if (req && viewTracker.trackView(req, `blog_${blog.blog_id}`)) {
    blog.views_count = (blog.views_count || 0) + 1;
    await blog.save();
  }

  return { success: true, data: blog };
};

export { getBlogsPaginated, getBlogById, getBlogBySlug };

import db from "../../models/index.js";

const toggleLike = async (user_id, blog_id) => {
  if (!user_id || !blog_id) {
    return {
      success: false,
      message: "User ID and Blog ID are required.",
    };
  }

  // Check if blog exists and is published
  const blog = await db.Blog.findByPk(blog_id);
  if (!blog) {
    return { success: false, message: "Blog not found." };
  }

  if (blog.blog_status !== "published") {
    return { success: false, message: "Cannot like unpublished blog." };
  }

  // Check if user already liked this blog
  const existingLike = await db.Blog_Like.findOne({
    where: {
      user_id: user_id,
      blog_id: blog_id,
    },
  });

  if (existingLike) {
    // Unlike - remove the like
    await existingLike.destroy();
    return {
      success: true,
      message: "Blog unliked successfully.",
      data: { liked: false },
    };
  } else {
    // Like - create new like
    const newLike = await db.Blog_Like.create({
      user_id: user_id,
      blog_id: blog_id,
      created_at: new Date(),
    });
    return {
      success: true,
      message: "Blog liked successfully.",
      data: { liked: true, like: newLike },
    };
  }
};

const getLikeCount = async (blog_id) => {
  if (!blog_id) {
    return { success: false, message: "Blog ID is required." };
  }

  const count = await db.Blog_Like.count({
    where: { blog_id: blog_id },
  });

  return {
    success: true,
    data: { blog_id: blog_id, likes_count: count },
  };
};

const checkUserLiked = async (user_id, blog_id) => {
  if (!user_id || !blog_id) {
    return {
      success: false,
      message: "User ID and Blog ID are required.",
    };
  }

  const like = await db.Blog_Like.findOne({
    where: {
      user_id: user_id,
      blog_id: blog_id,
    },
  });

  return {
    success: true,
    data: { liked: !!like },
  };
};

const getBlogLikes = async (blog_id, page = 1, limit = 20) => {
  if (!blog_id) {
    return { success: false, message: "Blog ID is required." };
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await db.Blog_Like.findAndCountAll({
    where: { blog_id: blog_id },
    limit: Number(limit),
    offset: Number(offset),
    order: [["created_at", "DESC"]],
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "avatar"],
      },
    ],
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      likes: rows,
    },
  };
};

export { toggleLike, getLikeCount, checkUserLiked, getBlogLikes };

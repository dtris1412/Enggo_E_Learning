import db from "../../models/index.js";

const getCommentsByBlogId = async (blog_id, page = 1, limit = 20) => {
  if (!blog_id) {
    return { success: false, message: "Blog ID is required." };
  }

  const offset = (Number(page) - 1) * Number(limit);

  // Get only root comments (parent_comment_id is null)
  const { count, rows } = await db.Blog_Comment.findAndCountAll({
    where: {
      blog_id: blog_id,
      parent_comment_id: null,
    },
    limit: Number(limit),
    offset: Number(offset),
    order: [["created_at", "DESC"]],
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "avatar"],
      },
      {
        model: db.Blog_Comment,
        as: "Replies",
        separate: true, // This will run a separate query for replies
        order: [["created_at", "ASC"]],
        include: [
          {
            model: db.User,
            attributes: ["user_id", "user_name", "avatar"],
          },
        ],
      },
    ],
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      comments: rows,
    },
  };
};

const getRepliesByCommentId = async (comment_id, page = 1, limit = 20) => {
  if (!comment_id) {
    return { success: false, message: "Comment ID is required." };
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await db.Blog_Comment.findAndCountAll({
    where: {
      parent_comment_id: comment_id,
    },
    limit: Number(limit),
    offset: Number(offset),
    order: [["created_at", "ASC"]],
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
      replies: rows,
    },
  };
};

const createComment = async (
  user_id,
  blog_id,
  comment_content,
  parent_comment_id = null,
) => {
  if (!user_id || !blog_id || !comment_content) {
    return {
      success: false,
      message: "User ID, Blog ID, and comment content are required.",
    };
  }

  // Validate comment content
  if (comment_content.trim().length < 1) {
    return {
      success: false,
      message: "Comment content cannot be empty.",
    };
  }

  if (comment_content.length > 5000) {
    return {
      success: false,
      message: "Comment content is too long (max 5000 characters).",
    };
  }

  // Check if blog exists and is published
  const blog = await db.Blog.findByPk(blog_id);
  if (!blog) {
    return { success: false, message: "Blog not found." };
  }

  if (blog.blog_status !== "published") {
    return {
      success: false,
      message: "Cannot comment on unpublished blog.",
    };
  }

  // If this is a reply, check if parent comment exists
  if (parent_comment_id) {
    const parentComment = await db.Blog_Comment.findByPk(parent_comment_id);
    if (!parentComment) {
      return { success: false, message: "Parent comment not found." };
    }

    // Ensure parent comment belongs to the same blog
    // Convert both to numbers for proper comparison
    if (Number(parentComment.blog_id) !== Number(blog_id)) {
      return {
        success: false,
        message: "Parent comment does not belong to this blog.",
      };
    }
  }

  // Create the comment
  const newComment = await db.Blog_Comment.create({
    user_id: user_id,
    blog_id: blog_id,
    parent_comment_id: parent_comment_id,
    comment_content: comment_content.trim(),
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Fetch the comment with user info
  const commentWithUser = await db.Blog_Comment.findByPk(
    newComment.blog_comment_id,
    {
      include: [
        {
          model: db.User,
          attributes: ["user_id", "user_name", "avatar"],
        },
      ],
    },
  );

  return {
    success: true,
    message: "Comment created successfully.",
    data: commentWithUser,
  };
};

const updateComment = async (comment_id, user_id, comment_content) => {
  if (!comment_id || !user_id || !comment_content) {
    return {
      success: false,
      message: "Comment ID, User ID, and comment content are required.",
    };
  }

  // Validate comment content
  if (comment_content.trim().length < 1) {
    return {
      success: false,
      message: "Comment content cannot be empty.",
    };
  }

  if (comment_content.length > 5000) {
    return {
      success: false,
      message: "Comment content is too long (max 5000 characters).",
    };
  }

  // Find the comment
  const comment = await db.Blog_Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: "Comment not found." };
  }

  // Check if user is the owner of the comment
  if (comment.user_id !== user_id) {
    return {
      success: false,
      message: "You can only edit your own comments.",
    };
  }

  // Update the comment
  comment.comment_content = comment_content.trim();
  comment.updated_at = new Date();
  await comment.save();

  // Fetch the updated comment with user info
  const updatedComment = await db.Blog_Comment.findByPk(comment_id, {
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "avatar"],
      },
    ],
  });

  return {
    success: true,
    message: "Comment updated successfully.",
    data: updatedComment,
  };
};

const deleteComment = async (comment_id, user_id) => {
  if (!comment_id || !user_id) {
    return {
      success: false,
      message: "Comment ID and User ID are required.",
    };
  }

  // Find the comment
  const comment = await db.Blog_Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: "Comment not found." };
  }

  // Check if user is the owner of the comment
  if (comment.user_id !== user_id) {
    return {
      success: false,
      message: "You can only delete your own comments.",
    };
  }

  // Delete the comment (CASCADE will delete all replies)
  await comment.destroy();

  return {
    success: true,
    message: "Comment deleted successfully.",
  };
};

const getCommentById = async (comment_id) => {
  if (!comment_id) {
    return { success: false, message: "Comment ID is required." };
  }

  const comment = await db.Blog_Comment.findByPk(comment_id, {
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "avatar"],
      },
      {
        model: db.Blog_Comment,
        as: "Replies",
        include: [
          {
            model: db.User,
            attributes: ["user_id", "user_name", "avatar"],
          },
        ],
      },
    ],
  });

  if (!comment) {
    return { success: false, message: "Comment not found." };
  }

  return {
    success: true,
    data: comment,
  };
};

export {
  getCommentsByBlogId,
  getRepliesByCommentId,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
};

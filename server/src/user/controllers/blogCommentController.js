import {
  getCommentsByBlogId as getCommentsByBlogIdService,
  getRepliesByCommentId as getRepliesByCommentIdService,
  createComment as createCommentService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
  getCommentById as getCommentByIdService,
} from "../services/blogCommentService.js";

const getCommentsByBlogId = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await getCommentsByBlogIdService(blog_id, page, limit);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCommentsByBlogId controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getRepliesByCommentId = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await getRepliesByCommentIdService(comment_id, page, limit);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getRepliesByCommentId controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const createComment = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const user_id = req.user.user_id; // From verifyToken middleware
    const { comment_content, parent_comment_id } = req.body;

    const result = await createCommentService(
      user_id,
      blog_id,
      comment_content,
      parent_comment_id,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createComment controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.user_id; // From verifyToken middleware
    const { comment_content } = req.body;

    const result = await updateCommentService(
      comment_id,
      user_id,
      comment_content,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateComment controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.user_id; // From verifyToken middleware

    const result = await deleteCommentService(comment_id, user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteComment controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const result = await getCommentByIdService(comment_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCommentById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export {
  getCommentsByBlogId,
  getRepliesByCommentId,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
};

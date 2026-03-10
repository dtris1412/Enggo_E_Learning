import {
  toggleLike as toggleLikeService,
  getLikeCount as getLikeCountService,
  checkUserLiked as checkUserLikedService,
  getBlogLikes as getBlogLikesService,
} from "../services/blogLikeService.js";

const toggleLike = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const user_id = req.user.user_id; // From verifyToken middleware

    const result = await toggleLikeService(user_id, blog_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in toggleLike controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getLikeCount = async (req, res) => {
  try {
    const { blog_id } = req.params;

    const result = await getLikeCountService(blog_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getLikeCount controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const checkUserLiked = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const user_id = req.user.user_id; // From verifyToken middleware

    const result = await checkUserLikedService(user_id, blog_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in checkUserLiked controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getBlogLikes = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await getBlogLikesService(blog_id, page, limit);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getBlogLikes controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { toggleLike, getLikeCount, checkUserLiked, getBlogLikes };

import {
  getBlogsPaginated as getBlogsPaginatedService,
  getBlogById as getBlogByIdService,
  getBlogBySlug as getBlogBySlugService,
} from "../services/blogService.js";

const getBlogsPaginated = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      category,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await getBlogsPaginatedService(
      search,
      page,
      limit,
      category,
      sortBy,
      sortOrder,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getBlogsPaginated controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const user_id = req.user?.user_id; // Optional - from optionalVerifyToken

    // Pass request object for view tracking
    const result = await getBlogByIdService(blog_id, req, user_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getBlogById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const user_id = req.user?.user_id; // Optional - from optionalVerifyToken

    // Pass request object for view tracking
    const result = await getBlogBySlugService(slug, req, user_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getBlogBySlug controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { getBlogsPaginated, getBlogById, getBlogBySlug };

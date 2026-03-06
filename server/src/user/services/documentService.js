import db from "../../models/index.js";
import viewTracker from "../../shared/services/viewTracker.js";

const getDocumentsPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  document_type,
  access_type,
  sortBy = "created_at",
  sortOrder = "DESC",
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  const whereConditions = {};
  if (search && search.trim()) {
    whereConditions.document_name = { [Op.like]: `%${search}%` };
  }
  if (document_type) {
    whereConditions.document_type = document_type;
  }
  if (access_type) {
    whereConditions.access_type = access_type;
  }

  // Validate sortBy field
  const allowedSortFields = [
    "created_at",
    "download_count",
    "view_count",
    "document_name",
  ];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  const { count, rows } = await db.Document.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset: Number(offset),
    order: [[validSortBy, validSortOrder]],
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      documents: rows,
    },
  };
};

const getDocumentById = async (document_id, req) => {
  if (!document_id) {
    return { success: false, message: "Document ID is required." };
  }

  const document = await db.Document.findByPk(document_id);
  if (!document) {
    return { success: false, message: "Document not found." };
  }

  // Track view and increment count if this is a unique view in 24h
  if (req && viewTracker.trackView(req, `document_${document_id}`)) {
    document.view_count = (document.view_count || 0) + 1;
    await document.save();
  }

  return { success: true, data: document };
};

const incrementDownloadCount = async (document_id, user_id) => {
  if (!document_id) {
    return { success: false, message: "Document ID is required." };
  }

  const document = await db.Document.findByPk(document_id);
  if (!document) {
    return { success: false, message: "Document not found." };
  }

  // Check if document is premium and user has access
  if (document.access_type === "premium") {
    if (!user_id) {
      return {
        success: false,
        message: "Premium content requires login and premium subscription.",
      };
    }

    // Check if user has active premium subscription
    const activeSubscription = await db.User_Subscription.findOne({
      where: {
        user_id: user_id,
        status: "active",
      },
      include: [
        {
          model: db.Subscription_Price,
          as: "Subscription_Price",
          include: [
            {
              model: db.Subscription_Plan,
              as: "Subscription_Plan",
              where: {
                code: "premium",
              },
            },
          ],
        },
      ],
    });

    if (!activeSubscription) {
      return {
        success: false,
        message:
          "This is a premium document. Please upgrade to premium subscription to download.",
      };
    }
  }

  // Increment download count
  document.download_count = (document.download_count || 0) + 1;
  await document.save();

  return { success: true, data: document };
};

export { getDocumentsPaginated, getDocumentById, incrementDownloadCount };

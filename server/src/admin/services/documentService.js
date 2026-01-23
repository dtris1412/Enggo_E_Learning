import { where } from "sequelize";
import db from "../../models/index.js";

const createDocument = async (
  document_type,
  document_name,
  document_description,
  document_url,
  document_size,
  file_type,
) => {
  if (!document_type || !document_name || !document_url) {
    return { success: false, message: "Missing required fields." };
  }

  const existingDocument = await db.Document.findOne({
    where: {
      document_name,
    },
  });
  if (existingDocument) {
    return {
      success: false,
      message: "Document with the same name already exists in this phase.",
    };
  }
  const newDocument = await db.Document.create({
    document_type,
    document_name,
    document_description,
    document_url,
    document_size,
    file_type,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newDocument };
};

const updateDocument = async (
  document_id,
  document_type,
  document_name,
  document_description,
  document_url,
  document_size,
  file_type,
) => {
  if (!document_id) {
    return { success: false, message: "Document ID is required." };
  }
  const document = await db.Document.findByPk(document_id);
  if (!document) {
    return { success: false, message: "Document not found." };
  }
  if (!document_type || !document_name || !document_url) {
    return { success: false, message: "Missing required fields." };
  }
  document.document_type = document_type;
  document.document_name = document_name;
  document.document_description = document_description;
  document.document_url = document_url;
  document.document_size = document_size;
  document.file_type = file_type;
  document.updated_at = new Date();
  await document.save();
  return { success: true, data: document };
};

const getDocumentsPaginated = async (
  search = " ",
  page = 1,
  limit = 10,
  document_type,
  file_type,
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
  if (file_type) {
    whereConditions.file_type = file_type;
  }
  const { count, rows } = await db.Document.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset: Number(offset),
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

const getDocumentById = async (document_id) => {
  if (!document_id) {
    return { success: false, message: "Document ID is required." };
  }
  const document = await db.Document.findByPk(document_id);
  if (!document) {
    return { success: false, message: "Document not found." };
  }
  return { success: true, data: document };
};

const deleteDocument = async (document_id) => {
  if (!document_id) {
    return { success: false, message: "Document ID is required." };
  }
  const document = await db.Document.findByPk(document_id);
  if (!document) {
    return { success: false, message: "Document not found." };
  }
  await document.destroy();
  return { success: true, message: "Document deleted successfully." };
};

export {
  createDocument,
  updateDocument,
  getDocumentsPaginated,
  getDocumentById,
  deleteDocument,
};

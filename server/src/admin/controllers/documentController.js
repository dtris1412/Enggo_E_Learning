import {
  createDocument as createDocumentService,
  updateDocument as updateDocumentService,
  getDocumentsPaginated as getDocumentsPaginatedService,
  getDocumentById as getDocumentByIdService,
  deleteDocument as deleteDocumentService,
} from "../services/documentService.js";

const createDocument = async (req, res) => {
  try {
    const {
      document_name,
      document_type,
      document_description,
      document_url,
      document_size,
      file_type,
    } = req.body;
    const result = await createDocumentService(
      document_type,
      document_name,
      document_description,
      document_url,
      document_size,
      file_type,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createDocument controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const {
      document_name,
      document_type,
      document_description,
      document_url,
      document_size,
      file_type,
    } = req.body;
    const result = await updateDocumentService(
      document_id,
      document_type,
      document_name,
      document_description,
      document_url,
      document_size,
      file_type,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateDocument controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getDocumentsPaginated = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      document_type,
      file_type,
    } = req.query;
    const result = await getDocumentsPaginatedService(
      search,
      page,
      limit,
      document_type,
      file_type,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getDocumentsPaginated controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const { document_id } = req.params;
    const result = await getDocumentByIdService(document_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getDocumentById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const result = await deleteDocumentService(document_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteDocument controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
export {
  createDocument,
  updateDocument,
  getDocumentsPaginated,
  getDocumentById,
  deleteDocument,
};

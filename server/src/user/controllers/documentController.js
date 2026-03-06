import {
  getDocumentsPaginated as getDocumentsPaginatedService,
  getDocumentById as getDocumentByIdService,
  incrementDownloadCount as incrementDownloadCountService,
} from "../services/documentService.js";

const getDocumentsPaginated = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      document_type,
      access_type,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await getDocumentsPaginatedService(
      search,
      page,
      limit,
      document_type,
      access_type,
      sortBy,
      sortOrder,
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

    // Pass request object for view tracking
    const result = await getDocumentByIdService(document_id, req);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getDocumentById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { document_id } = req.params;

    // Increment download count
    const result = await incrementDownloadCountService(document_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    // Return document data with URL for download
    res.status(200).json({
      success: true,
      message: "Document ready for download",
      data: {
        document_id: result.data.document_id,
        document_name: result.data.document_name,
        document_url: result.data.document_url,
        file_type: result.data.file_type,
        document_size: result.data.document_size,
      },
    });
  } catch (err) {
    console.error("Error in downloadDocument controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { getDocumentsPaginated, getDocumentById, downloadDocument };

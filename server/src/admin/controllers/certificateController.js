import {
  createCertificate as createCertificateService,
  updateCertificateById as updateCertificateByIdService,
  lockCertificate as lockCertificateService,
  unlockCertificate as unlockCertificateService,
  getCertificatesPaginated as getCertificatesPaginatedService,
  getCertificateById as getCertificateByIdService,
} from "../services/certificateService.js";

const createCertificate = async (req, res) => {
  try {
    const { certificate_name, description, total_score, certificate_status } =
      req.body;
    const newCertificate = await createCertificateService(
      certificate_name,
      description,
      total_score,
      certificate_status
    );
    if (!newCertificate.success) {
      return res.status(400).json(newCertificate);
    }
    res.status(201).json(newCertificate);
  } catch (err) {
    console.error("Error in createCertificate:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateCertificateById = async (req, res) => {
  try {
    const { certificate_id } = req.params;
    const { certificate_name, description, total_score } = req.body;
    const updatedCertificate = await updateCertificateByIdService(
      certificate_id,
      certificate_name,
      description,
      total_score
    );
    if (!updatedCertificate.success) {
      return res.status(400).json(updatedCertificate);
    }
    res.status(200).json(updatedCertificate);
  } catch (err) {
    console.error("Error in updateCertificateById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const lockCertificate = async (req, res) => {
  try {
    const { certificate_id } = req.params;
    const result = await lockCertificateService(certificate_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in lockCertificate:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const unlockCertificate = async (req, res) => {
  try {
    const { certificate_id } = req.params;
    const result = await unlockCertificateService(certificate_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in unlockCertificate:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getCertificatesPaginated = async (req, res) => {
  try {
    const { search, limit, page, certificate_status } = req.query;
    const result = await getCertificatesPaginatedService(
      search,
      limit,
      page,
      certificate_status
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCertificatesPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const { certificate_id } = req.params;
    const result = await getCertificateByIdService(certificate_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCertificateById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export {
  createCertificate,
  updateCertificateById,
  lockCertificate,
  unlockCertificate,
  getCertificatesPaginated,
  getCertificateById,
};

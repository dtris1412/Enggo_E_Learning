import {
  createCertificateSkill as createCertificateSkillService,
  updateCertificateSkill as updateCertificateSkillService,
  getCertificateSkillsPaginated as getCertificateSkillsPaginatedService,
  getCertificateSkillById as getCertificateSkillByIdService,
  deleteCertificateSkill as deleteCertificateSkillService,
} from "../services/certificate_skill.js";

const getCertificateSkillsPaginated = async (req, res) => {
  try {
    const { certificate_id, limit, page } = req.query;
    const result = await getCertificateSkillsPaginatedService(
      certificate_id,
      limit,
      page
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving certificate-skill associations:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getCertificateSkillById = async (req, res) => {
  try {
    const { certificate_skill_id } = req.params;
    const result = await getCertificateSkillByIdService(certificate_skill_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving certificate-skill association by ID:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const createCertificateSkill = async (req, res) => {
  try {
    const { certificate_id, skill_id, weight, description } = req.body;
    const result = await createCertificateSkillService(
      certificate_id,
      skill_id,
      weight,
      description
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating certificate-skill association:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const updateCertificateSkill = async (req, res) => {
  try {
    const { certificate_skill_id } = req.params;
    const { skill_id, certificate_id, weight, description } = req.body;
    const result = await updateCertificateSkillService(
      certificate_skill_id,
      skill_id,
      certificate_id,
      weight,
      description
    );
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating certificate-skill association:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const deleteCertificateSkill = async (req, res) => {
  try {
    const { certificate_skill_id } = req.params;
    const result = await deleteCertificateSkillService(certificate_skill_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting certificate-skill association:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export {
  createCertificateSkill,
  updateCertificateSkill,
  getCertificateSkillsPaginated,
  getCertificateSkillById,
  deleteCertificateSkill,
};

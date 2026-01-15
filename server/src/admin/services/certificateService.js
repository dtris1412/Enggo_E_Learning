import db from "../../models/index.js";

const createCertificate = async (
  certificate_name,
  description,
  total_score
) => {
  if (!certificate_name || !description || !total_score) {
    return { success: false, message: "All fields are required." };
  }
  const newCertificate = await db.Certificate.create({
    certificate_name,
    description,
    certificate_status: true,
    total_score,

    created_at: new Date(),
  });
  return {
    success: true,
    message: "Certificate created successfully",
    data: newCertificate,
  };
};

const updateCertificateById = async (
  certificate_id,
  certificate_name,
  description,
  total_score
) => {
  if (!certificate_id) {
    return { success: false, message: "Certificate ID is required." };
  }
  const certificate = await db.Certificate.findByPk(certificate_id);
  if (!certificate) {
    return { success: false, message: "Certificate not found." };
  }
  certificate.certificate_name =
    certificate_name || certificate.certificate_name;
  certificate.description = description || certificate.description;
  certificate.total_score = total_score || certificate.total_score;
  await certificate.save();
  return {
    success: true,
    message: "Certificate updated successfully",
    data: certificate,
  };
};

const lockCertificate = async (certificate_id) => {
  if (!certificate_id) {
    return { success: false, message: "Certificate ID is required." };
  }
  const certificate = await db.Certificate.findByPk(certificate_id);
  if (!certificate) {
    return { success: false, message: "Certificate not found." };
  }
  certificate.certificate_status = false;
  await certificate.save();
  return {
    success: true,
    message: "Certificate locked successfully",
    data: certificate,
  };
};
const unlockCertificate = async (certificate_id) => {
  if (!certificate_id) {
    return { success: false, message: "Certificate ID is required." };
  }
  const certificate = await db.Certificate.findByPk(certificate_id);
  if (!certificate) {
    return { success: false, message: "Certificate not found." };
  }
  certificate.certificate_status = true;
  await certificate.save();
  return {
    success: true,
    message: "Certificate unlocked successfully",
    data: certificate,
  };
};

const getCertificatesPaginated = async (
  search = "",
  limit = 10,
  page = 1,
  certificate_status
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  // Xây dựng điều kiện where
  const whereConditions = {};

  if (search) {
    whereConditions[Op.or] = [{ certificate_name: { [Op.substring]: search } }];
  }
  // Filter theo certificate_status
  if (certificate_status !== undefined && certificate_status !== "") {
    whereConditions.certificate_status =
      certificate_status === "true" || certificate_status === true;
  }
  //Đếm tổng số certificate
  const totalCertificates = await db.Certificate.count({
    where: whereConditions,
  });
  //Lấy danh sách certificate với phân trang
  const certificates = await db.Certificate.findAll({
    where: whereConditions,
    include: [
      {
        model: db.Certificate_Skill,
        as: "Certificate_Skills",
        attributes: [
          "certificate_skill_id",
          "skill_id",
          "weight",
          "description",
        ],
        include: [
          {
            model: db.Skill,
            attributes: ["skill_id", "skill_name"],
          },
        ],
      },
    ],
    limit: Number(limit),
    offset,
    order: [["certificate_id", "ASC"]],
  });
  return {
    success: true,
    message: "Certificates retrieved successfully",
    data: {
      totalCertificates,
      certificates,
    },
  };
};

const getCertificateById = async (certificate_id) => {
  if (!certificate_id) {
    return { success: false, message: "Certificate ID is required." };
  }
  const certificate = await db.Certificate.findByPk(certificate_id, {
    include: [
      {
        model: db.Certificate_Skill,
        as: "Certificate_Skills",
        attributes: [
          "certificate_skill_id",
          "skill_id",
          "weight",
          "description",
        ],
        include: [
          {
            model: db.Skill,
            attributes: ["skill_id", "skill_name"],
          },
        ],
      },
    ],
  });
  if (!certificate) {
    return { success: false, message: "Certificate not found." };
  }
  return {
    success: true,
    message: "Certificate retrieved successfully",
    data: certificate,
  };
};
export {
  createCertificate,
  updateCertificateById,
  lockCertificate,
  unlockCertificate,
  getCertificatesPaginated,
  getCertificateById,
};

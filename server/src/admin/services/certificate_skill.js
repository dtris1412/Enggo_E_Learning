import db from "../../models/index.js";

const createCertificateSkill = async (
  certificate_id,
  skill_id,
  weight = 1.0,
  description = null
) => {
  if (!certificate_id || !skill_id) {
    return {
      success: false,
      message: "Certificate ID and Skill ID are required.",
    };
  }

  // Kiểm tra certificate có tồn tại không
  const certificate = await db.Certificate.findByPk(certificate_id);
  if (!certificate) {
    return {
      success: false,
      message: "Certificate not found.",
    };
  }

  // Kiểm tra skill có tồn tại không
  const skill = await db.Skill.findByPk(skill_id);
  if (!skill) {
    return {
      success: false,
      message: "Skill not found.",
    };
  }

  const existingAssociation = await db.Certificate_Skill.findOne({
    where: { certificate_id, skill_id },
  });
  if (existingAssociation) {
    return {
      success: false,
      message: "This skill is already associated with the certificate.",
    };
  }
  const newAssociation = await db.Certificate_Skill.create({
    certificate_id,
    skill_id,
    weight,
    description,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return {
    success: true,
    message: "Skill associated with certificate successfully",
    data: newAssociation,
  };
};

const updateCertificateSkill = async (
  certificate_skill_id,
  skill_id,
  certificate_id,
  weight,
  description
) => {
  const association = await db.Certificate_Skill.findByPk(certificate_skill_id);
  if (!association) {
    return {
      success: false,
      message: "Certificate-Skill association not found.",
    };
  }

  // Nếu cập nhật skill_id, kiểm tra skill có tồn tại không
  if (skill_id && skill_id !== association.skill_id) {
    const skill = await db.Skill.findByPk(skill_id);
    if (!skill) {
      return {
        success: false,
        message: "Skill not found.",
      };
    }
  }

  // Nếu cập nhật certificate_id, kiểm tra certificate có tồn tại không
  if (certificate_id && certificate_id !== association.certificate_id) {
    const certificate = await db.Certificate.findByPk(certificate_id);
    if (!certificate) {
      return {
        success: false,
        message: "Certificate not found.",
      };
    }
  }

  association.skill_id = skill_id || association.skill_id;
  association.certificate_id = certificate_id || association.certificate_id;
  association.weight = weight !== undefined ? weight : association.weight;
  association.description =
    description !== undefined ? description : association.description;
  association.updated_at = new Date();
  await association.save();
  return {
    success: true,
    message: "Certificate-Skill association updated successfully.",
    data: association,
  };
};

const getCertificateSkillsPaginated = async (
  certificate_id,
  limit = 10,
  page = 1
) => {
  const offset = (Number(page) - 1) * Number(limit);

  const whereConditions = {};
  if (certificate_id) {
    whereConditions.certificate_id = certificate_id;
  }

  const { count, rows } = await db.Certificate_Skill.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name", "description"],
      },
      {
        model: db.Skill,
        attributes: ["skill_id", "skill_name"],
      },
    ],
    limit: Number(limit),
    offset,
    order: [["created_at", "ASC"]],
  });

  return {
    success: true,
    message: "Certificate-Skill associations retrieved successfully",
    data: {
      certificateSkills: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    },
  };
};

const getCertificateSkillById = async (certificate_skill_id) => {
  const association = await db.Certificate_Skill.findByPk(
    certificate_skill_id,
    {
      include: [
        {
          model: db.Certificate,
          attributes: ["certificate_id", "certificate_name", "description"],
        },
        {
          model: db.Skill,
          attributes: ["skill_id", "skill_name"],
        },
      ],
    }
  );

  if (!association) {
    return {
      success: false,
      message: "Certificate-Skill association not found.",
    };
  }

  return {
    success: true,
    message: "Certificate-Skill association retrieved successfully",
    data: association,
  };
};

const deleteCertificateSkill = async (certificate_skill_id) => {
  const association = await db.Certificate_Skill.findByPk(certificate_skill_id);
  if (!association) {
    return {
      success: false,
      message: "Certificate-Skill association not found.",
    };
  }

  await association.destroy();
  return {
    success: true,
    message: "Certificate-Skill association deleted successfully.",
  };
};

export {
  createCertificateSkill,
  updateCertificateSkill,
  getCertificateSkillsPaginated,
  getCertificateSkillById,
  deleteCertificateSkill,
};

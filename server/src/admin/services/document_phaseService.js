import db from "../../models/index.js";

const createDocumentPhase = async (phase_id, document_id, order_index) => {
  if (!phase_id || !document_id) {
    return { success: false, message: "Missing required fields." };
  }
  const existingDocumentPhase = await db.Document_Phase.findOne({
    where: { phase_id, document_id },
  });
  if (existingDocumentPhase) {
    return {
      success: false,
      message: "Document already added to this phase.",
    };
  }
  const newDocumentPhase = await db.Document_Phase.create({
    phase_id,
    document_id,
    order_index: order_index || 0,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newDocumentPhase };
};

const updateDocumentPhase = async (document_phase_id, order_index) => {
  if (!document_phase_id) {
    return { success: false, message: "Document_Phase ID is required." };
  }
  const documentPhase = await db.Document_Phase.findByPk(document_phase_id);
  if (!documentPhase) {
    return { success: false, message: "Document_Phase not found." };
  }
  if (order_index !== undefined) {
    documentPhase.order_index = order_index;
  }
  documentPhase.updated_at = new Date();
  await documentPhase.save();
  return { success: true, data: documentPhase };
};

const deleteDocumentPhase = async (document_phase_id) => {
  if (!document_phase_id) {
    return { success: false, message: "Document_Phase ID is required." };
  }
  const documentPhase = await db.Document_Phase.findByPk(document_phase_id);
  if (!documentPhase) {
    return { success: false, message: "Document_Phase not found." };
  }
  await documentPhase.destroy();
  return { success: true, message: "Document_Phase deleted successfully." };
};

const getDocumentPhases = async (phase_id) => {
  if (!phase_id) {
    return { success: false, message: "Phase ID is required." };
  }
  const documentPhases = await db.Document_Phase.findAll({
    where: { phase_id },
    include: [{ model: db.Document }],
  });
  return { success: true, data: documentPhases };
};

export {
  createDocumentPhase,
  updateDocumentPhase,
  deleteDocumentPhase,
  getDocumentPhases,
};

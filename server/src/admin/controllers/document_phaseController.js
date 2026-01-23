import {
  createDocumentPhase as createDocumentPhaseService,
  updateDocumentPhase as updateDocumentPhaseService,
  deleteDocumentPhase as deleteDocumentPhaseService,
  getDocumentPhases as getDocumentPhasesService,
} from "../services/document_phaseService.js";

const createDocumentPhase = async (req, res) => {
  try {
    const { phase_id } = req.params;
    const { document_id, order_index } = req.body;
    const result = await createDocumentPhaseService(
      phase_id,
      document_id,
      order_index,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createDocumentPhase:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateDocumentPhase = async (req, res) => {
  try {
    const { document_phase_id } = req.params;
    const { order_index } = req.body;
    const result = await updateDocumentPhaseService(
      document_phase_id,
      order_index,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateDocumentPhase:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteDocumentPhase = async (req, res) => {
  try {
    const { document_phase_id } = req.params;
    const result = await deleteDocumentPhaseService(document_phase_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteDocumentPhase:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getDocumentPhases = async (req, res) => {
  try {
    const { phase_id } = req.params;
    const result = await getDocumentPhasesService(phase_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getDocumentPhases:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createDocumentPhase,
  updateDocumentPhase,
  deleteDocumentPhase,
  getDocumentPhases,
};

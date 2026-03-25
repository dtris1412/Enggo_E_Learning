import React, { useState, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  ClipboardPaste,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react";
import { useExam } from "../../contexts/examContext";
import {
  ExamType,
  getQuestionTypesByExamType,
} from "../../constants/questionTypes";

interface BulkQuestion {
  id: string;
  question_content: string;
  explanation: string;
  order: string;
  image_url: string;
  score: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  question_type: string;
}

interface BulkQuestionImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  containerId: number;
  containerName: string;
  onImportSuccess: () => void;
  examType?: ExamType;
}

const BulkQuestionImportModal: React.FC<BulkQuestionImportModalProps> = ({
  isOpen,
  onClose,
  containerId,
  containerName,
  onImportSuccess,
  examType,
}) => {
  const { uploadExamImages } = useExam();
  const questionTypeOptions = getQuestionTypesByExamType(examType);
  const defaultQuestionType =
    questionTypeOptions[0]?.value ?? "reading_multiple_choice";

  const [questions, setQuestions] = useState<BulkQuestion[]>([
    {
      id: Date.now().toString(),
      question_content: "",
      explanation: "",
      order: "1",
      image_url: "",
      score: "1.0",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
      question_type: defaultQuestionType,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showPasteHelp, setShowPasteHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map());
  const tableRef = useRef<HTMLDivElement>(null);

  const addQuestion = () => {
    const lastOrder =
      questions.length > 0
        ? parseInt(questions[questions.length - 1].order) || questions.length
        : 0;
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question_content: "",
        explanation: "",
        order: (lastOrder + 1).toString(),
        image_url: "",
        score: "1.0",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        question_type: defaultQuestionType,
      },
    ]);
  };

  const addMultipleRows = (count: number) => {
    const lastOrder =
      questions.length > 0
        ? parseInt(questions[questions.length - 1].order) || questions.length
        : 0;
    const newRows = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}_${Math.random()}`,
      question_content: "",
      explanation: "",
      order: (lastOrder + i + 1).toString(),
      question_type: defaultQuestionType,
      image_url: "",
      score: "1.0",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
    }));
    setQuestions([...questions, ...newRows]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
    // Remove associated image file
    const newImageFiles = new Map(imageFiles);
    newImageFiles.delete(id);
    setImageFiles(newImageFiles);
  };

  const updateQuestion = (
    id: string,
    field: keyof BulkQuestion,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const handleImageUpload = (id: string, file: File) => {
    console.log(
      `Selecting file for question ${id}:`,
      file.name,
      `(${(file.size / 1024).toFixed(1)}KB)`,
    );

    // Validate file size (10MB limit for Cloudinary free plan)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB (10,485,760 bytes)
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSizeInKB = (file.size / 1024).toFixed(1);

    if (file.size > maxSizeInBytes) {
      console.error(
        `File too large: ${file.name} (${file.size} bytes > ${maxSizeInBytes} bytes)`,
      );
      alert(
        `❌ File "${file.name}" quá lớn!\n\nKích thước: ${fileSizeInMB}MB (${file.size.toLocaleString()} bytes)\nTối đa: 10MB (10,485,760 bytes)\n\nVui lòng chọn ảnh nhỏ hơn hoặc nén ảnh trước khi upload.`,
      );
      // Clear the file input
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.value = "";
        }
      });
      return;
    }

    console.log(`✅ File size OK: ${fileSizeInKB}KB`);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert(
        `❌ File "${file.name}" không đúng định dạng!\n\nChỉ chấp nhận: JPG, JPEG, PNG, WEBP`,
      );
      return;
    }

    const newImageFiles = new Map(imageFiles);
    newImageFiles.set(id, file);
    setImageFiles(newImageFiles);
  };

  const handleRemoveImage = (id: string) => {
    const newImageFiles = new Map(imageFiles);
    newImageFiles.delete(id);
    setImageFiles(newImageFiles);
    // Also clear the image_url field
    updateQuestion(id, "image_url", "");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Xử lý paste từ clipboard (hỗ trợ Excel, Google Sheets)
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split("\n").filter((row) => row.trim());

      if (rows.length === 0) {
        alert("Clipboard trống!");
        return;
      }

      const parsedData = rows.map((row, index) => {
        // Hỗ trợ tab-separated (Excel) hoặc comma-separated
        const cells = row.includes("\t") ? row.split("\t") : row.split(",");

        return {
          id: `${Date.now()}_${Math.random()}`,
          question_content: (cells[0] || "").trim().replace(/^"|"$/g, ""), // Remove quotes
          explanation: (cells[1] || "").trim().replace(/^"|"$/g, ""),
          order: (cells[2] || (index + 1).toString()).trim(),
          image_url: (cells[3] || "").trim().replace(/^"|"$/g, ""),
          score: (cells[4] || "1.0").trim(),
          option_a: (cells[5] || "").trim().replace(/^"|"$/g, ""),
          option_b: (cells[6] || "").trim().replace(/^"|"$/g, ""),
          option_c: (cells[7] || "").trim().replace(/^"|"$/g, ""),
          option_d: (cells[8] || "").trim().replace(/^"|"$/g, ""),
          correct_answer: (cells[9] || "").trim().toUpperCase(),
          question_type:
            (cells[10] || defaultQuestionType).trim().replace(/^"|"$/g, "") ||
            defaultQuestionType,
        } as BulkQuestion;
      });

      // Thay thế tất cả rows hiện tại bằng data mới
      setQuestions(parsedData);
      setError(null);
      alert(`✅ Đã paste ${parsedData.length} câu hỏi từ clipboard!`);
    } catch (error) {
      console.error("Error pasting:", error);
      alert(
        "❌ Không thể paste từ clipboard. Vui lòng cho phép quyền truy cập clipboard.",
      );
    }
  };

  // Export template CSV
  const downloadTemplate = () => {
    const defaultType =
      questionTypeOptions[0]?.value ?? "reading_multiple_choice";
    const csvContent = `Question Content,Explanation,Order,Image URL,Score,Option A,Option B,Option C,Option D,Correct Answer,Question Type
"What is the capital of France?","Paris is the capital and largest city of France.",1,,1.0,London,Paris,Berlin,Madrid,B,${defaultType}
"Which planet is known as the Red Planet?","Mars is called the Red Planet because of its reddish appearance.",2,,1.0,Venus,Mars,Jupiter,Saturn,B,${defaultType}
"What is 2 + 2?","Basic arithmetic: 2 plus 2 equals 4.",3,,1.0,3,4,5,6,B,${defaultType}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bulk_questions_template.csv";
    link.click();
  };

  const validate = () => {
    const errors: string[] = [];

    questions.forEach((q, index) => {
      const rowNum = index + 1;

      if (!q.question_content.trim()) {
        errors.push(`Hàng ${rowNum}: Thiếu nội dung câu hỏi`);
      }

      if (!q.order || isNaN(parseInt(q.order))) {
        errors.push(`Hàng ${rowNum}: Thứ tự phải là số`);
      }

      if (!q.option_a.trim() || !q.option_b.trim()) {
        errors.push(`Hàng ${rowNum}: Phải có ít nhất 2 đáp án (A và B)`);
      }

      const validAnswers = ["A", "B", "C", "D"];
      if (!validAnswers.includes(q.correct_answer.toUpperCase())) {
        errors.push(`Hàng ${rowNum}: Đáp án đúng phải là A, B, C hoặc D`);
      }

      // Check if correct answer option exists
      const correctOpt = q.correct_answer.toUpperCase();
      if (correctOpt === "A" && !q.option_a.trim()) {
        errors.push(`Hàng ${rowNum}: Đáp án đúng là A nhưng Option A trống`);
      }
      if (correctOpt === "B" && !q.option_b.trim()) {
        errors.push(`Hàng ${rowNum}: Đáp án đúng là B nhưng Option B trống`);
      }
      if (correctOpt === "C" && !q.option_c.trim()) {
        errors.push(`Hàng ${rowNum}: Đáp án đúng là C nhưng Option C trống`);
      }
      if (correctOpt === "D" && !q.option_d.trim()) {
        errors.push(`Hàng ${rowNum}: Đáp án đúng là D nhưng Option D trống`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Validate image files before upload
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const oversizedFiles: string[] = [];

    imageFiles.forEach((file) => {
      if (file.size > maxSizeInBytes) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        oversizedFiles.push(`${file.name} (${fileSizeInMB}MB)`);
      }
    });

    if (oversizedFiles.length > 0) {
      setError(
        `❌ Các file ảnh sau quá lớn (tối đa 10MB):\n${oversizedFiles.join("\n")}\n\nVui lòng xóa và chọn lại file nhỏ hơn.`,
      );
      return;
    }

    setLoading(true);
    try {
      // Upload all images first
      const imageUrlMap = new Map<string, string>();

      if (imageFiles.size > 0) {
        console.log(
          "Uploading images:",
          Array.from(imageFiles.values()).map(
            (f) => `${f.name} (${(f.size / 1024).toFixed(1)}KB)`,
          ),
        );
        const filesToUpload = Array.from(imageFiles.values());

        console.log("Calling uploadExamImages...");
        const uploadedUrls = await uploadExamImages(filesToUpload);
        console.log("Upload result:", uploadedUrls);

        if (!uploadedUrls || uploadedUrls.length === 0) {
          console.error("Upload failed: received null or empty array");
          setError(
            "❌ Lỗi khi upload ảnh!\n\nCó thể do:\n- File quá lớn (server reject)\n- Lỗi kết nối mạng\n- Token hết hạn\n\nVui lòng:\n1. Kiểm tra Console (F12) để xem lỗi chi tiết\n2. Refresh trang và đăng nhập lại\n3. Thử upload lại",
          );
          setLoading(false);
          return;
        }

        if (uploadedUrls.length === filesToUpload.length) {
          // Map question IDs to their uploaded image URLs
          let urlIndex = 0;
          imageFiles.forEach((_, questionId) => {
            imageUrlMap.set(questionId, uploadedUrls[urlIndex]);
            urlIndex++;
          });
        } else {
          setError(
            `Chỉ upload được ${uploadedUrls.length}/${filesToUpload.length} ảnh. Vui lòng thử lại.`,
          );
          setLoading(false);
          return;
        }
      }

      // Convert to API format
      const questionsData = questions.map((q) => {
        const options = [];

        if (q.option_a.trim()) {
          options.push({
            label: "A",
            content: q.option_a.trim(),
            is_correct: q.correct_answer.toUpperCase() === "A",
            order_index: 1,
          });
        }
        if (q.option_b.trim()) {
          options.push({
            label: "B",
            content: q.option_b.trim(),
            is_correct: q.correct_answer.toUpperCase() === "B",
            order_index: 2,
          });
        }
        if (q.option_c.trim()) {
          options.push({
            label: "C",
            content: q.option_c.trim(),
            is_correct: q.correct_answer.toUpperCase() === "C",
            order_index: 3,
          });
        }
        if (q.option_d.trim()) {
          options.push({
            label: "D",
            content: q.option_d.trim(),
            is_correct: q.correct_answer.toUpperCase() === "D",
            order_index: 4,
          });
        }

        // Use uploaded image URL if available, otherwise use the input URL
        const finalImageUrl =
          imageUrlMap.get(q.id) || q.image_url.trim() || null;

        return {
          question_content: q.question_content.trim(),
          explanation: q.explanation.trim() || null,
          order: parseInt(q.order) || 1,
          image_url: finalImageUrl,
          score: parseFloat(q.score) || 1.0,
          question_type: q.question_type || defaultQuestionType,
          options,
        };
      });

      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/admin/container-questions/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          container_id: containerId,
          questions: questionsData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Đã thêm ${result.data.length} câu hỏi thành công!`);
        onImportSuccess();
        onClose();
      } else {
        setError(result.message || "Import thất bại");
      }
    } catch (error) {
      console.error("Error importing questions:", error);
      setError("Lỗi khi import câu hỏi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[95vw] w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Import Nhiều Câu Hỏi</h2>
              <p className="text-blue-100 text-sm mt-1">
                {containerName} • {questions.length} câu hỏi
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <ClipboardPaste className="w-4 h-4" />
              Paste từ Excel/Sheets
            </button>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Tải template
            </button>
            <button
              type="button"
              onClick={() => addMultipleRows(5)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm 5 hàng
            </button>
            <button
              type="button"
              onClick={() => addMultipleRows(10)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm 10 hàng
            </button>
            <button
              type="button"
              onClick={() => setShowPasteHelp(!showPasteHelp)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              {showPasteHelp ? "Ẩn" : "Hiện"} Hướng dẫn
            </button>
          </div>

          {/* Help Section */}
          {showPasteHelp && (
            <div className="mt-4 bg-white/10 rounded-lg p-4 text-sm text-white/90">
              <p className="font-medium mb-2">📋 Cách paste nhanh:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Bước 1:</strong> Tải template hoặc chuẩn bị dữ liệu
                  trong Excel/Google Sheets
                </li>
                <li>
                  <strong>Bước 2:</strong> Định dạng: Question | Explanation |
                  Order | Image URL | Score | Option A | B | C | D | Correct
                  Answer
                </li>
                <li>
                  <strong>Bước 3:</strong> Select tất cả cells (không cần
                  header) và Copy (Ctrl+C)
                </li>
                <li>
                  <strong>Bước 4:</strong> Click "Paste từ Excel/Sheets" - Dữ
                  liệu sẽ tự động điền vào bảng
                </li>
                <li>
                  <strong>Lưu ý:</strong> Đáp án đúng phải là A, B, C hoặc D
                  (viết hoa)
                </li>
                <li>
                  <strong>Hình ảnh:</strong> Kích thước tối đa 10MB, định dạng
                  JPG/PNG/WEBP
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Info Box for Grouped Questions */}
        {containerName.toLowerCase().includes("questions") && (
          <div className="mx-6 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  💡 Lưu ý về nhóm câu hỏi (Part 3, 4, 6, 7)
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • Container này chứa{" "}
                    <strong>nhiều câu hỏi chung 1 passage/conversation</strong>
                  </li>
                  <li>
                    • Đảm bảo Container đã có{" "}
                    <strong>content/instruction</strong> (passage/transcript)
                  </li>
                  <li>
                    • Thường import <strong>2-5 câu hỏi</strong> cho mỗi passage
                  </li>
                  <li>
                    • Mỗi passage cần <strong>1 Container riêng</strong> (không
                    gom chung)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Lỗi validation:
              </p>
              <pre className="text-xs text-red-700 mt-2 whitespace-pre-wrap">
                {error}
              </pre>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:bg-red-100 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Table Container */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-auto p-6" ref={tableRef}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 w-12">
                      STT
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[250px]">
                      Nội dung câu hỏi <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[200px]">
                      Giải thích
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 w-20">
                      STT <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[150px]">
                      <div className="flex flex-col">
                        <span>Hình ảnh</span>
                        <span className="text-[10px] font-normal text-gray-500">
                          (Max 10MB)
                        </span>
                      </div>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 w-20">
                      Điểm
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[150px]">
                      Đáp án A <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[150px]">
                      Đáp án B <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[150px]">
                      Đáp án C
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[150px]">
                      Đáp án D
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 w-24">
                      Đ.Án Đúng <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 min-w-[180px]">
                      Loại câu hỏi <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 w-16">
                      Xóa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr
                      key={question.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* STT */}
                      <td className="border border-gray-300 px-2 py-2 text-center text-gray-600 font-medium">
                        {index + 1}
                      </td>

                      {/* Question Content */}
                      <td className="border border-gray-300 p-1">
                        <textarea
                          value={question.question_content}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "question_content",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded resize-none"
                          rows={2}
                          placeholder="Nhập nội dung câu hỏi..."
                        />
                      </td>

                      {/* Explanation */}
                      <td className="border border-gray-300 p-1">
                        <textarea
                          value={question.explanation}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "explanation",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded resize-none"
                          rows={2}
                          placeholder="Giải thích..."
                        />
                      </td>

                      {/* Order */}
                      <td className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={question.order}
                          onChange={(e) =>
                            updateQuestion(question.id, "order", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded text-center"
                          placeholder="1"
                        />
                      </td>

                      {/* Image Upload */}
                      <td className="border border-gray-300 p-1">
                        <div className="flex flex-col gap-1">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageUpload(
                                    question.id,
                                    e.target.files[0],
                                  );
                                }
                              }}
                              className="hidden"
                            />
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs transition-colors">
                              <Upload className="w-3 h-3" />
                              <span>Upload</span>
                            </div>
                          </label>
                          {imageFiles.has(question.id) && (
                            <div className="flex flex-col gap-0.5 text-[10px]">
                              <div className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span
                                  className="text-green-600 truncate max-w-[80px]"
                                  title={imageFiles.get(question.id)?.name}
                                >
                                  {imageFiles.get(question.id)?.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(question.id)}
                                  className="text-red-500 hover:text-red-700 ml-auto flex-shrink-0"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-gray-500 text-[9px]">
                                {formatFileSize(
                                  imageFiles.get(question.id)?.size || 0,
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={question.score}
                          onChange={(e) =>
                            updateQuestion(question.id, "score", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded text-center"
                          placeholder="1.0"
                        />
                      </td>

                      {/* Option A */}
                      <td className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={question.option_a}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "option_a",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded"
                          placeholder="Đáp án A"
                        />
                      </td>

                      {/* Option B */}
                      <td className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={question.option_b}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "option_b",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded"
                          placeholder="Đáp án B"
                        />
                      </td>

                      {/* Option C */}
                      <td className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={question.option_c}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "option_c",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded"
                          placeholder="Đáp án C"
                        />
                      </td>

                      {/* Option D */}
                      <td className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={question.option_d}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "option_d",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded"
                          placeholder="Đáp án D"
                        />
                      </td>

                      {/* Correct Answer */}
                      <td className="border border-gray-300 p-1">
                        <select
                          value={question.correct_answer}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "correct_answer",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded font-semibold"
                        >
                          <option value="">--</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </td>

                      {/* Question Type */}
                      <td className="border border-gray-300 p-1">
                        <select
                          value={question.question_type}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "question_type",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500 rounded"
                        >
                          {questionTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Delete Button */}
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          disabled={questions.length <= 1}
                          className="text-red-500 hover:bg-red-50 rounded p-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Xóa hàng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="mt-4 w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Thêm hàng mới
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Đang import...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Import {questions.length} câu hỏi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkQuestionImportModal;

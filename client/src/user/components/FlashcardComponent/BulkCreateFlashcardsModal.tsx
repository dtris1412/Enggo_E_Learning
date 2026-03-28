import React, { useState, useRef } from "react";
import { X, Plus, Trash2, ClipboardPaste, Download } from "lucide-react";

interface BulkFlashcard {
  id: string;
  front_content: string;
  back_content: string;
  example?: string;
  difficulty_level?: "easy" | "medium" | "hard";
  pronunciation?: string;
}

interface BulkCreateFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    flashcards: Array<{
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard";
      pronunciation?: string;
    }>,
  ) => Promise<void>;
}

const BulkCreateFlashcardsModal: React.FC<BulkCreateFlashcardsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [flashcards, setFlashcards] = useState<BulkFlashcard[]>([
    {
      id: Date.now().toString(),
      front_content: "",
      back_content: "",
      example: "",
      difficulty_level: undefined,
      pronunciation: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showPasteHelp, setShowPasteHelp] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const addFlashcard = () => {
    setFlashcards([
      ...flashcards,
      {
        id: Date.now().toString(),
        front_content: "",
        back_content: "",
        example: "",
        difficulty_level: undefined,
        pronunciation: "",
      },
    ]);
  };

  const addMultipleRows = (count: number) => {
    const newRows = Array.from({ length: count }, () => ({
      id: `${Date.now()}_${Math.random()}`,
      front_content: "",
      back_content: "",
      example: "",
      difficulty_level: undefined as "easy" | "medium" | "hard" | undefined,
      pronunciation: "",
    }));
    setFlashcards([...flashcards, ...newRows]);
  };

  const removeFlashcard = (id: string) => {
    if (flashcards.length <= 1) return;
    setFlashcards(flashcards.filter((fc) => fc.id !== id));
  };

  const updateFlashcard = (id: string, field: string, value: string) => {
    setFlashcards(
      flashcards.map((fc) => (fc.id === id ? { ...fc, [field]: value } : fc)),
    );
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

      const parsedData = rows.map((row) => {
        // Hỗ trợ tab-separated (Excel) hoặc comma-separated
        const cells = row.includes("\t") ? row.split("\t") : row.split(",");

        return {
          id: `${Date.now()}_${Math.random()}`,
          front_content: (cells[0] || "").trim(),
          back_content: (cells[1] || "").trim(),
          pronunciation: (cells[2] || "").trim(),
          example: (cells[3] || "").trim(),
          difficulty_level:
            cells[4]?.trim().toLowerCase() === "easy"
              ? "easy"
              : cells[4]?.trim().toLowerCase() === "medium"
                ? "medium"
                : cells[4]?.trim().toLowerCase() === "hard"
                  ? "hard"
                  : undefined,
        } as BulkFlashcard;
      });

      // Thay thế tất cả rows hiện tại bằng data mới
      setFlashcards(parsedData);
      alert(`Đã paste ${parsedData.length} hàng từ clipboard!`);
    } catch (error) {
      console.error("Error pasting:", error);
      alert(
        "Không thể paste từ clipboard. Vui lòng cho phép quyền truy cập clipboard.",
      );
    }
  };

  // Export template CSV để người dùng có thể download
  const downloadTemplate = () => {
    const csvContent = `Mặt trước,Mặt sau,Phát âm,Ví dụ,Độ khó (easy/medium/hard)
Hello,Xin chào,/həˈloʊ/,Hello everyone!,easy
Goodbye,Tạm biệt,/ɡʊdˈbaɪ/,Goodbye my friend,easy`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "flashcard_template.csv";
    link.click();
  };

  const validate = () => {
    const invalidRows: number[] = [];

    flashcards.forEach((fc, index) => {
      if (!fc.front_content.trim() || !fc.back_content.trim()) {
        invalidRows.push(index + 1);
      }
    });

    if (invalidRows.length > 0) {
      alert(`Các hàng sau thiếu thông tin bắt buộc: ${invalidRows.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const cleanedFlashcards = flashcards.map((fc) => ({
        front_content: fc.front_content.trim(),
        back_content: fc.back_content.trim(),
        example: fc.example?.trim() || undefined,
        difficulty_level: fc.difficulty_level || undefined,
        pronunciation: fc.pronunciation?.trim() || undefined,
      }));

      await onSave(cleanedFlashcards);

      // Reset form
      setFlashcards([
        {
          id: Date.now().toString(),
          front_content: "",
          back_content: "",
          example: "",
          difficulty_level: undefined,
          pronunciation: "",
        },
      ]);
      onClose();
    } catch (error) {
      console.error("Error creating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-800 to-violet-900 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Thêm nhiều Flashcard</h2>
              <p className="text-violet-100 text-sm mt-1">
                Đang thêm {flashcards.length} thẻ
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
              onClick={() => setShowPasteHelp(!showPasteHelp)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Hướng dẫn
            </button>
          </div>

          {/* Help Section */}
          {showPasteHelp && (
            <div className="mt-4 bg-white/10 rounded-lg p-4 text-sm text-white/90">
              <p className="font-medium mb-2">📋 Cách paste nhanh:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Copy dữ liệu từ Excel/Google Sheets (định dạng: Mặt trước |
                  Mặt sau | Phát âm | Ví dụ | Độ khó)
                </li>
                <li>Click nút "Paste từ Excel/Sheets"</li>
                <li>Hoặc tải template mẫu để xem cấu trúc</li>
              </ul>
            </div>
          )}
        </div>

        {/* Table Container */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-auto p-6" ref={tableRef}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-slate-100 z-10">
                  <tr>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 w-12">
                      STT
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 min-w-[200px]">
                      Mặt trước <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 min-w-[200px]">
                      Mặt sau <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 min-w-[120px]">
                      Phát âm
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 min-w-[200px]">
                      Ví dụ
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 w-32">
                      Độ khó
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 w-16">
                      Xóa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flashcards.map((flashcard, index) => (
                    <tr
                      key={flashcard.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* STT */}
                      <td className="border border-slate-300 px-3 py-2 text-center text-sm text-slate-600 font-medium">
                        {index + 1}
                      </td>

                      {/* Front Content */}
                      <td className="border border-slate-300 p-1">
                        <textarea
                          value={flashcard.front_content}
                          onChange={(e) =>
                            updateFlashcard(
                              flashcard.id,
                              "front_content",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-violet-500 rounded resize-none"
                          rows={2}
                          placeholder="Nhập từ/câu hỏi"
                        />
                      </td>

                      {/* Back Content */}
                      <td className="border border-slate-300 p-1">
                        <textarea
                          value={flashcard.back_content}
                          onChange={(e) =>
                            updateFlashcard(
                              flashcard.id,
                              "back_content",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-violet-500 rounded resize-none"
                          rows={2}
                          placeholder="Nhập nghĩa/câu trả lời"
                        />
                      </td>

                      {/* Pronunciation */}
                      <td className="border border-slate-300 p-1">
                        <input
                          type="text"
                          value={flashcard.pronunciation || ""}
                          onChange={(e) =>
                            updateFlashcard(
                              flashcard.id,
                              "pronunciation",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-violet-500 rounded"
                          placeholder="/ˈhæpi/"
                        />
                      </td>

                      {/* Example */}
                      <td className="border border-slate-300 p-1">
                        <textarea
                          value={flashcard.example || ""}
                          onChange={(e) =>
                            updateFlashcard(
                              flashcard.id,
                              "example",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-violet-500 rounded resize-none"
                          rows={2}
                          placeholder="Ví dụ: Hello everyone!"
                        />
                      </td>

                      {/* Difficulty Level */}
                      <td className="border border-slate-300 p-1">
                        <select
                          value={flashcard.difficulty_level || ""}
                          onChange={(e) =>
                            updateFlashcard(
                              flashcard.id,
                              "difficulty_level",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-sm border-0 focus:ring-2 focus:ring-violet-500 rounded"
                        >
                          <option value="">--</option>
                          <option value="easy">Dễ</option>
                          <option value="medium">TB</option>
                          <option value="hard">Khó</option>
                        </select>
                      </td>

                      {/* Delete Button */}
                      <td className="border border-slate-300 px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeFlashcard(flashcard.id)}
                          disabled={flashcards.length <= 1}
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
              onClick={addFlashcard}
              className="mt-4 w-full py-3 border-2 border-dashed border-violet-300 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Thêm hàng mới
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="border-t bg-slate-50 p-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-800 to-violet-900 text-white rounded-md hover:bg-violet-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Đang lưu..." : `Lưu ${flashcards.length} thẻ`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkCreateFlashcardsModal;



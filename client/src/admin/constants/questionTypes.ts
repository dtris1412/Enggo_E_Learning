/**
 * Question Type Constants
 * Maps question types to exam types (TOEIC/IELTS)
 */

export type QuestionType =
  | "listening_photographs"
  | "listening_question_response"
  | "listening_conversation"
  | "listening_talk"
  | "reading_incomplete_sentences"
  | "reading_text_completion"
  | "reading_reading_comprehension"
  | "reading_matching_headings"
  | "reading_true_false_not_given"
  | "reading_multiple_choice"
  | "reading_matching_information"
  | "reading_sentence_completion"
  | "reading_summary_completion"
  | "reading_short_answer"
  | "writing_task_1"
  | "writing_task_2"
  | "speaking_part_1"
  | "speaking_part_2"
  | "speaking_part_3"
  | "grammar"
  | "vocabulary";

export type ExamType = "TOEIC" | "IELTS";

export interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  description?: string;
}

// TOEIC Question Types
export const TOEIC_QUESTION_TYPES: QuestionTypeOption[] = [
  {
    value: "listening_photographs",
    label: "Listening - Part 1: Photographs",
    description: "Mô tả hình ảnh",
  },
  {
    value: "listening_question_response",
    label: "Listening - Part 2: Question-Response",
    description: "Hỏi - Đáp",
  },
  {
    value: "listening_conversation",
    label: "Listening - Part 3: Conversations",
    description: "Đoạn hội thoại",
  },
  {
    value: "listening_talk",
    label: "Listening - Part 4: Talks",
    description: "Đoạn độc thoại",
  },
  {
    value: "reading_incomplete_sentences",
    label: "Reading - Part 5: Incomplete Sentences",
    description: "Hoàn thành câu",
  },
  {
    value: "reading_text_completion",
    label: "Reading - Part 6: Text Completion",
    description: "Hoàn thành đoạn văn",
  },
  {
    value: "reading_reading_comprehension",
    label: "Reading - Part 7: Reading Comprehension",
    description: "Đọc hiểu",
  },
  {
    value: "grammar",
    label: "Grammar",
    description: "Ngữ pháp",
  },
  {
    value: "vocabulary",
    label: "Vocabulary",
    description: "Từ vựng",
  },
];

// IELTS Question Types
export const IELTS_QUESTION_TYPES: QuestionTypeOption[] = [
  {
    value: "reading_matching_headings",
    label: "Reading - Matching Headings",
    description: "Nối tiêu đề với đoạn văn",
  },
  {
    value: "reading_true_false_not_given",
    label: "Reading - True/False/Not Given",
    description: "Đúng/Sai/Không được đề cập",
  },
  {
    value: "reading_multiple_choice",
    label: "Reading - Multiple Choice",
    description: "Trắc nghiệm nhiều lựa chọn",
  },
  {
    value: "reading_matching_information",
    label: "Reading - Matching Information",
    description: "Nối thông tin",
  },
  {
    value: "reading_sentence_completion",
    label: "Reading - Sentence Completion",
    description: "Hoàn thành câu",
  },
  {
    value: "reading_summary_completion",
    label: "Reading - Summary Completion",
    description: "Hoàn thành tóm tắt",
  },
  {
    value: "reading_short_answer",
    label: "Reading - Short Answer",
    description: "Trả lời ngắn",
  },
  {
    value: "writing_task_1",
    label: "Writing - Task 1",
    description: "Mô tả biểu đồ/quy trình",
  },
  {
    value: "writing_task_2",
    label: "Writing - Task 2",
    description: "Viết luận",
  },
  {
    value: "speaking_part_1",
    label: "Speaking - Part 1",
    description: "Giới thiệu & phỏng vấn",
  },
  {
    value: "speaking_part_2",
    label: "Speaking - Part 2",
    description: "Thuyết trình cá nhân",
  },
  {
    value: "speaking_part_3",
    label: "Speaking - Part 3",
    description: "Thảo luận chuyên sâu",
  },
  {
    value: "grammar",
    label: "Grammar",
    description: "Ngữ pháp",
  },
  {
    value: "vocabulary",
    label: "Vocabulary",
    description: "Từ vựng",
  },
];

// All Question Types
export const ALL_QUESTION_TYPES: QuestionTypeOption[] = [
  ...TOEIC_QUESTION_TYPES,
  ...IELTS_QUESTION_TYPES.filter(
    (ieltsType) =>
      !TOEIC_QUESTION_TYPES.some(
        (toeicType) => toeicType.value === ieltsType.value,
      ),
  ),
];

/**
 * Get question types based on exam type
 */
export const getQuestionTypesByExamType = (
  examType: ExamType | undefined,
): QuestionTypeOption[] => {
  if (!examType) return ALL_QUESTION_TYPES;
  return examType === "TOEIC" ? TOEIC_QUESTION_TYPES : IELTS_QUESTION_TYPES;
};

/**
 * Get question type label by value
 */
export const getQuestionTypeLabel = (type: QuestionType): string => {
  const option = ALL_QUESTION_TYPES.find((opt) => opt.value === type);
  return option ? option.label : type;
};

/**
 * Validate if question type is valid for exam type
 */
export const isValidQuestionTypeForExam = (
  questionType: QuestionType,
  examType: ExamType,
): boolean => {
  const validTypes = getQuestionTypesByExamType(examType);
  return validTypes.some((opt) => opt.value === questionType);
};

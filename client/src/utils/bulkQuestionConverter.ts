/**
 * UTILITY: CSV to Bulk Question JSON Converter
 *
 * Converts CSV data to the JSON format required for bulk question import
 *
 * CSV Format:
 * question_content,explanation,order,image_url,score,option_a,option_b,option_c,option_d,correct_answer
 *
 * Example CSV:
 * "What is the capital of France?","Paris is the capital","1","","1.0","London","Paris","Berlin","Madrid","B"
 * "Which planet is red?","Mars is the Red Planet","2","","1.0","Venus","Mars","Jupiter","Saturn","B"
 */

// Type definitions
interface QuestionOption {
  label: string;
  content: string;
  is_correct: boolean;
  order_index: number;
}

interface Question {
  question_content: string;
  explanation: string | null;
  order: number;
  image_url: string | null;
  score: number;
  options: QuestionOption[];
}

interface BulkQuestionsData {
  container_id: number;
  questions: Question[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Convert CSV text to bulk question JSON
 * @param csvText - The CSV text content
 * @param containerId - The container ID to add questions to
 * @returns JSON object ready for API submission
 */
export function csvToBulkQuestions(
  csvText: string,
  containerId: number,
): BulkQuestionsData {
  const lines = csvText.trim().split("\n");

  // Skip header row
  const dataLines = lines.slice(1);

  const questions = dataLines.map((line): Question => {
    // Simple CSV parser (for production, use a library like papaparse)
    const values = parseCSVLine(line);

    const [
      question_content,
      explanation,
      order,
      image_url,
      score,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    ] = values;

    // Create options array
    const options: QuestionOption[] = [];
    const optionLabels = ["A", "B", "C", "D"];
    const optionContents = [option_a, option_b, option_c, option_d];

    optionContents.forEach((content, index) => {
      if (content && content.trim()) {
        options.push({
          label: optionLabels[index],
          content: content.trim(),
          is_correct:
            optionLabels[index] === correct_answer.trim().toUpperCase(),
          order_index: index + 1,
        });
      }
    });

    return {
      question_content: question_content.trim(),
      explanation: explanation.trim() || null,
      order: parseInt(order) || 1,
      image_url: image_url.trim() || null,
      score: parseFloat(score) || 1.0,
      options,
    };
  });

  return {
    container_id: containerId,
    questions,
  };
}

/**
 * Simple CSV line parser
 * Handles quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current); // Last value

  return values;
}

/**
 * Convert Excel-style tab-separated data
 * (Copy-paste directly from Excel)
 */
export function excelToBulkQuestions(
  excelText: string,
  containerId: number,
): BulkQuestionsData {
  const lines = excelText.trim().split("\n");

  // Skip header row
  const dataLines = lines.slice(1);

  const questions = dataLines.map((line): Question => {
    const values = line.split("\t");

    const [
      question_content,
      explanation,
      order,
      image_url,
      score,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    ] = values;

    // Create options array
    const options: QuestionOption[] = [];
    const optionLabels = ["A", "B", "C", "D"];
    const optionContents = [option_a, option_b, option_c, option_d];

    optionContents.forEach((content, index) => {
      if (content && content.trim()) {
        options.push({
          label: optionLabels[index],
          content: content.trim(),
          is_correct:
            optionLabels[index] === correct_answer.trim().toUpperCase(),
          order_index: index + 1,
        });
      }
    });

    return {
      question_content: question_content.trim(),
      explanation: explanation?.trim() || null,
      order: parseInt(order) || 1,
      image_url: image_url?.trim() || null,
      score: parseFloat(score) || 1.0,
      options,
    };
  });

  return {
    container_id: containerId,
    questions,
  };
}

/**
 * Validate the questions data before sending to API
 */
export function validateBulkQuestions(
  data: BulkQuestionsData,
): ValidationResult {
  const errors: string[] = [];

  if (!data.container_id) {
    errors.push("Container ID is required");
  }

  if (
    !data.questions ||
    !Array.isArray(data.questions) ||
    data.questions.length === 0
  ) {
    errors.push("Questions must be a non-empty array");
  }

  data.questions.forEach((q, index) => {
    if (!q.question_content || !q.question_content.trim()) {
      errors.push(`Question ${index + 1}: question_content is required`);
    }

    if (!q.order || isNaN(q.order)) {
      errors.push(`Question ${index + 1}: order must be a number`);
    }

    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
      errors.push(`Question ${index + 1}: must have at least one option`);
    } else {
      // Check for at least one correct answer
      const hasCorrect = q.options.some((opt) => opt.is_correct === true);
      if (!hasCorrect) {
        errors.push(
          `Question ${index + 1}: must have at least one correct answer`,
        );
      }

      // Validate each option
      q.options.forEach((opt, optIndex) => {
        if (!opt.label || !opt.content || opt.is_correct === undefined) {
          errors.push(
            `Question ${index + 1}, Option ${optIndex + 1}: missing required fields`,
          );
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Example usage in a React component or Node.js script
 */
export async function submitBulkQuestions(
  csvText: string,
  containerId: number,
  adminToken: string,
): Promise<any> {
  // Convert CSV to JSON
  const bulkData = csvToBulkQuestions(csvText, containerId);

  // Validate
  const validation = validateBulkQuestions(bulkData);
  if (!validation.isValid) {
    console.error("Validation errors:", validation.errors);
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Submit to API
  try {
    const response = await fetch("/api/admin/container-questions/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(bulkData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting bulk questions:", error);
    return {
      success: false,
      message: "Failed to submit bulk questions",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Example CSV template
export const CSV_TEMPLATE = `question_content,explanation,order,image_url,score,option_a,option_b,option_c,option_d,correct_answer
"What is the capital of France?","Paris is the capital and largest city of France.",1,,1.0,London,Paris,Berlin,Madrid,B
"Which planet is known as the Red Planet?","Mars is called the Red Planet because of its reddish appearance.",2,,1.0,Venus,Mars,Jupiter,Saturn,B
"What is 2 + 2?","Basic arithmetic: 2 plus 2 equals 4.",3,,1.0,3,4,5,6,B`;

// Example Excel template (tab-separated)
export const EXCEL_TEMPLATE = `question_content\texplanation\torder\timage_url\tscore\toption_a\toption_b\toption_c\toption_d\tcorrect_answer
What is the capital of France?\tParis is the capital and largest city of France.\t1\t\t1.0\tLondon\tParis\tBerlin\tMadrid\tB
Which planet is known as the Red Planet?\tMars is called the Red Planet because of its reddish appearance.\t2\t\t1.0\tVenus\tMars\tJupiter\tSaturn\tB
What is 2 + 2?\tBasic arithmetic: 2 plus 2 equals 4.\t3\t\t1.0\t3\t4\t5\t6\tB`;

import ExcelJS from "exceljs";

/**
 * Service để xuất dữ liệu ra file Excel
 * Dùng cho quick export (không lưu vào DB)
 */

// Hàm tạo workbook Excel cơ bản
const createWorkbook = () => {
  return new ExcelJS.Workbook();
};

// Hàm thêm worksheet và format
const addWorksheet = (workbook, sheetName, columns, data) => {
  const worksheet = workbook.addWorksheet(sheetName);

  // Thêm columns
  worksheet.columns = columns;

  // Style cho header
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" },
  };
  worksheet.getRow(1).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // Thêm dữ liệu
  worksheet.addRows(data);

  // Thêm borders cho tất cả cells có dữ liệu
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  return worksheet;
};

// Hàm write workbook vào response
const writeToResponse = async (workbook, res, filename) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  await workbook.xlsx.write(res);
  res.end();
};

export default {
  createWorkbook,
  addWorksheet,
  writeToResponse,
};

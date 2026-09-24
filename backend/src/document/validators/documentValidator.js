const AppError = require("../../utils/AppError");
const allowed = new Set(["csv", "xls", "xlsx", "json"]);
function validateUpload(file) {
  if (!file) throw new AppError("File is required", 400);
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (!allowed.has(ext))
    throw new AppError(
      "Unsupported file type. Allowed: CSV, XLS, XLSX, JSON",
      400,
    );
  return ext;
}
module.exports = { validateUpload };

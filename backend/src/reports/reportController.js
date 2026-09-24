const svc = require("./reportService");
async function report(req, res) {
  const format = (req.query.format || "xlsx").toLowerCase();
  if (!["xlsx", "csv"].includes(format))
    return res
      .status(400)
      .json({
        success: false,
        error: { message: "format must be xlsx or csv" },
      });
  const r = await svc.generate(req.params.id, format);
  res.setHeader("Content-Type", r.contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="reconciliation-${req.params.id}.${r.extension}"`,
  );
  res.send(r.buffer);
}
module.exports = { report };

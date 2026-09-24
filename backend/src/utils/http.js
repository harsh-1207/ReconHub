function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  res
    .status(status)
    .json({
      success: false,
      error: { message: status >= 500 ? "Internal server error" : err.message },
    });
}
module.exports = { ok, errorHandler };

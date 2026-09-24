require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/reconciliationRoutes");
const reportRoutes = require("../reports/reportRoutes");
const { errorHandler } = require("../utils/http");
const AppError = require("../utils/AppError");
const app = express();
app.use(cors());
app.get("/health", (req, res) =>
  res.json({ service: "reconciliation-api", status: "UP" }),
);
app.use(express.json());
app.use("/api/reconciliations", routes);
app.use("/api/reports", reportRoutes);
app.use((req, res, next) => next(new AppError("Route not found", 404)));
app.use(errorHandler);
module.exports = app;

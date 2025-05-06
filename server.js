const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { default: open } = require("open");

const hanhchinhRoutes = require("./routes/hanhchinh.route");
const shapefileRoutes = require("./routes/shapefile.route");
const importGeeUrlRoutes = require("./routes/importGeeUrl.route");
const matRungRoutes = require("./routes/matrung.route");
const dataDropdownRoutes = require("./routes/dataDropdown.routes");
const quanlydulieu = require("./routes/quanLyDuLieu.routes");
const baocao = require("./routes/baocao.routes");

require("dotenv").config();

const app = express();

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = require("./swaggerOptions");
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.use("/api/import-shapefile", shapefileRoutes);
app.use("/api/import-gee-url", importGeeUrlRoutes);
app.use("/api/hanhchinh", hanhchinhRoutes);
app.use("/api/mat-rung", matRungRoutes);
app.use("/api/dropdown", dataDropdownRoutes);
app.use("/api/quan-ly-du-lieu", quanlydulieu);
app.use("/api/bao-cao", baocao);
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require("./db");
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: "Kết nối database thành công",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error("❌ Lỗi kết nối DB:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối database",
      error: error.message
    });
  }
});
app.get("/", (req, res) => {
  res.send("✅ Backend Geo API đang hoạt động");
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🚀 Backend chạy tại http://localhost:${port}`);
  open(`http://localhost:${port}/api-docs`);
});

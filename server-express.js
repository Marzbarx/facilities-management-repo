const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Read database
const dbPath = path.join(__dirname, "db.json");
let db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/work_orders", (req, res) => {
  const { coordinator_id } = req.query;
  if (coordinator_id) {
    const filtered = db.work_orders.filter(
      (wo) => wo.coordinator_id === coordinator_id,
    );
    return res.json(filtered);
  }
  res.json(db.work_orders);
});

app.get("/work_orders/:id", (req, res) => {
  const workOrder = db.work_orders.find((wo) => wo.id === req.params.id);
  if (!workOrder)
    return res.status(404).json({ error: "Work order not found" });
  res.json(workOrder);
});

app.patch("/work_orders/:id", (req, res) => {
  const index = db.work_orders.findIndex((wo) => wo.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ error: "Work order not found" });

  db.work_orders[index] = { ...db.work_orders[index], ...req.body };

  // Save to file
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.json(db.work_orders[index]);
});

app.get("/asset_inventory", (req, res) => {
  const { Asset_Tag } = req.query;
  if (Asset_Tag) {
    const filtered = db.asset_inventory.filter(
      (asset) => asset.Asset_Tag === Asset_Tag,
    );
    return res.json(filtered);
  }
  res.json(db.asset_inventory);
});

app.get("/vendor_database", (req, res) => {
  const { Specialty } = req.query;
  if (Specialty) {
    const filtered = db.vendor_database.filter(
      (vendor) => vendor.Specialty === Specialty,
    );
    return res.json(filtered);
  }
  res.json(db.vendor_database);
});

app.get("/employees", (req, res) => {
  res.json(db.employees);
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Facilities Management API",
    status: "running",
    endpoints: [
      "GET /work_orders?coordinator_id=:id",
      "PATCH /work_orders/:id",
      "GET /asset_inventory?Asset_Tag=:tag",
      "GET /vendor_database?Specialty=:specialty",
      "GET /employees",
    ],
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Facilities Management API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Made with Bob

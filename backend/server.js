import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// Simple file log
const LOG_FILE = path.join(__dirname, "backend", "logs.json");

function saveLog(entry) {
  const logs = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE))
    : [];
  logs.push({ ...entry, at: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// Serve resume file
app.use("/resume.pdf", express.static(path.join(__dirname, "frontend/public/resume.pdf")));

app.post("/api/visit", (req, res) => {
  const { name, phone, enteredAt } = req.body;
  const visitId = "v_" + Date.now();
  saveLog({ visitId, name, phone, enteredAt, event: "visit" });
  res.json({ success: true, visitId });
});

app.post("/api/visit/download", (req, res) => {
  saveLog({ ...req.body, event: "download" });
  res.json({ success: true });
});

app.post("/api/visit/end", (req, res) => {
  saveLog({ ...req.body, event: "end" });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");

const hrRoutes = require("./routes/hrRoutes");


const app = express();

app.use(express.json());
app.use(cors());

app.use("/hrAuth", hrRoutes);

app.use("/hrServices", hrRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
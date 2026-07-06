import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Pinterest clone works :)");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




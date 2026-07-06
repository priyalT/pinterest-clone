import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





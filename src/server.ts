import express from "express";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();

app.get("/", (req, res) => {
  res.send("Hello TypeScript");
});

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
import "dotenv/config";
import express from "express";

const app = express();


app.get("/", (req, res) => {
  res.send("Hello TypeScript");
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
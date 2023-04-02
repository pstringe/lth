const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "health" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

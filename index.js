import express from "express";

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.get("/twitter", (req, res) => {
  res.send("Hello world1!");
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});

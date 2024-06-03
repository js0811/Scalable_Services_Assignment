// course-management-service/app.js

const express = require("express");
const mongoose = require("mongoose");
const courseRoutes = require("./routes/course");

const app = express();
const port = process.env.PORT || 3002;

mongoose
  .connect("mongodb://localhost:27017/languageLearningDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());

app.use("/courses", courseRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`Course Management Service listening on port ${port}`);
});

// user-management-service/app.js

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authenticateToken = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/languageLearningDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());

app.use("/users", userRoutes);

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`User Management Service listening on port ${port}`);
});

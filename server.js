const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDatabase = require("./utils/mongo");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONNECT TO MONGO ONCE

connectToDatabase(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

//ROUTES

app.use("/founder", require("./route/founder"));

//HOME ROUTE

app.get("/", (req, res) => {
  res.send("Server is running...");
});

//START SERVER

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

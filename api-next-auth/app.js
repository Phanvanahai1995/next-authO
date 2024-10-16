const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [, "http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", require("./routes/auth"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connect Database");
    app.listen(8080, () => {
      console.log(`Server running on port 8080`);
    });
  })
  .catch((err) => console.log(err));

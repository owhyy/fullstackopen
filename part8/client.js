const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Person = require("./models/person");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
  console.log("connected!");
});

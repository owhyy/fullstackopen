/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "__v"] }] */

require("dotenv").config();

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;
console.log("connecting to ", url);
mongoose
  .connect(url)
  .then(() => console.log("successfully connected"))
  .catch((error) => console.log("connection failed ", error.message));

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  phone: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /^(\d{2,3})-\d+/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});
personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

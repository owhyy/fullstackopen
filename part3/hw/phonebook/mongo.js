const mongoose = require("mongoose");

const args = process.argv;
if (args.length < 2 || args.length == 4 || args.length > 5) {
  console.log("usage: node mongo.js <password> [name] [phone number]");
  return;
}

const password = args[2];
const url = `mongodb+srv://fullstack:${password}@fullstackopen.bal9tjl.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

if (args.length == 5) {
  const name = args[3];
  const phone = args[4];

  const person = new Person({ name: name, phone: phone });
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.phone} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => console.log(`${person.name} ${person.phone}`));
    mongoose.connection.close();
  });
}

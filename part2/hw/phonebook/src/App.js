import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showWith, setShowWith] = useState("");

  const hook = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  };

  useEffect(hook, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.filter((p) => p.name === newName).length !== 0) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }

    setPersons(persons.concat({ name: newName, phone: newPhone }));
    setNewName("");
    setNewPhone("");
  };

  const handleShowWithChange = (event) => {
    setShowWith(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const peopleToShow =
    showWith === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(showWith.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleShowWithChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameOnChange={handleNameChange}
        phoneOnChange={handlePhoneChange}
      />

      <h2>Numbers</h2>
      <Persons persons={peopleToShow} />
    </div>
  );
};

export default App;

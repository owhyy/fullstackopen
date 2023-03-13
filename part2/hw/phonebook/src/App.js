import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import phonebookService from "./services/phonebook";

import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showWith, setShowWith] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const possiblyExistingPerson = persons.filter((p) => p.name === newName)[0];
    if (possiblyExistingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. do you want to replace its number with ${newPhone}?`
        )
      ) {
        phonebookService
          .updateNumber(possiblyExistingPerson.id, {
            ...possiblyExistingPerson,
            phone: newPhone,
          })
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== updatedPerson.id ? p : updatedPerson
              )
            );
            setSuccessMessage(
              `${updatedPerson.name}'s phone number was updated successfuly to ${updatedPerson.phone}`
            );
            setTimeout(() => setSuccessMessage(null), 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `${possiblyExistingPerson.name} was already deleted from the server`
            );
            setTimeout(() => setErrorMessage(null), 5000);
            setPersons(
              persons.filter((p) => p.id !== possiblyExistingPerson.id)
            );
          });
      }

      setNewName("");
      setNewPhone("");
      return;
    }

    const newPerson = { name: newName, phone: newPhone };
    phonebookService
      .create(newPerson)
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewPhone("");

        setSuccessMessage(`${createdPerson.name} was added successfuly`);
        setTimeout(() => setSuccessMessage(null), 5000);
      })
      .catch(
        (error) =>
          setTimeout(() => {
            console.log(error.response.data.error);
            setErrorMessage(error.response.data.error);
          }),
        5000
      );
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

  const deletePerson = (person) => {
    if (window.confirm(`are you sure you want to delete ${person.name}?`))
      phonebookService.deletePerson(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        setSuccessMessage(`${person.name} was deleted successfully`);
        setTimeout(() => setSuccessMessage(null), 5000);
      });
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter onChange={handleShowWithChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameOnChange={handleNameChange}
        phoneOnChange={handlePhoneChange}
      />

      <h2>Numbers</h2>
      <Notification message={successMessage} isSuccess={true} />
      <Notification message={errorMessage} isSuccess={false} />
      <Persons persons={peopleToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

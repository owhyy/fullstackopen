import { useQuery } from "@apollo/client";
import { useState } from "react";
import PersonForm from "./PersonForm";
import { ALL_PERSONS, FIND_PERSON } from "./constants";
import PhoneForm from "./PhoneForm";

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  );
};

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null);
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  });

  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      ></Person>
    );
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.name}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>show address</button>
        </div>
      ))}
    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

function App() {
  const result = useQuery(ALL_PERSONS);
  const [errorMessage, setErrorMesage] = useState(null);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMesage(message);
    setTimeout(() => {
      setErrorMesage(null);
    }, 5000);
  };

  return (
    <>
      <Notify errorMessage={errorMessage}></Notify>
	<PersonForm setError={notify}></PersonForm>
	<PhoneForm></PhoneForm>
      <Persons persons={result.data.allPersons}></Persons>
    </>
  );
}

export default App;

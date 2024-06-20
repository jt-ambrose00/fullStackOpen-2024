import { useState, useEffect } from 'react';

import Search from './components/Search';
import ContactForm from './components/ContactForm';
import Contacts from './components/Contacts';
import Notification from './components/Notification';

import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);
    const personObject = {
      name: newName,
      number: newNumber,
      id: existingPerson ? existingPerson.id : (persons.length + 1).toString()
    };

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to contacts, replace the old number with a new one?`)) {
        personService
          .update(personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : updatedPerson)
            );
            setSuccessMessage(
              `Changed ${updatedPerson.name}'s phone number`
            );
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000);
          });
      };
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setSuccessMessage(
            `Added ${returnedPerson.name}`
          );
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000);
        });
    };

    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const searchedPerson = persons.filter(person => 
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const deletePerson = (event) => {
    if (window.confirm(`Delete ${event.name}?`)) {
      personService
        .deletePerson(event.id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        });
    };
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} />
      <Search handleSearchName={handleSearchName} />
      <h2>Add a new contact</h2>
      <ContactForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Contacts</h2>
      <Contacts
        searchedPerson={searchedPerson}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;

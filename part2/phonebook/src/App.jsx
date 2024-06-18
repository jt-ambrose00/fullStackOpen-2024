import { useState, useEffect } from 'react';

import Search from './components/Search';
import ContactForm from './components/ContactForm';
import Contacts from './components/Contacts';

import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    };

    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString()
    };
    
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      });
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
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
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

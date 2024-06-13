import { useState } from 'react';

import Search from './components/Search';
import ContactForm from './components/ContactForm';
import Contacts from './components/Contacts';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '123-4567', id: 1 },
    { name: 'Ada Lovelace', number: '172-3309', id: 2 },
    { name: 'Dan Abramov', number: '123-4488', id: 3 },
    { name: 'Mary Poppendieck', number: '102-9741', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    };

    const personObject = {
      name: newName, number: newNumber, id: persons.length + 1
    };
    setPersons(persons.concat(personObject));

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
      <Contacts searchedPerson={searchedPerson} />
    </div>
  );
};

export default App;

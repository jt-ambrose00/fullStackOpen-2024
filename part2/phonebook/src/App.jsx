import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '123-4567', id: 1 },
    { name: 'Ada Lovelace', number: '172-3309', id: 2 },
    { name: 'Dan Abramov', number: '123-4488', id: 3 },
    { name: 'Mary Poppendieck', number: '102-9741', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [personsToShow, setPersonsToShow] = useState(persons);

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
    const searchName = event.target.value.toLowerCase();
    const searchMatch = persons.filter(
      person => person.name.toLowerCase() === searchName
    );

    if (searchMatch.length === 0) {
      setPersonsToShow(persons);
    } else {
      setPersonsToShow(searchMatch);
    };
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        search:
        <input onChange={handleSearchName} />
      </div>
      <h2>Add a new contact</h2>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <p key={person.id}>{person.name} {person.number}</p>
      )}
    </div>
  );
};

export default App;

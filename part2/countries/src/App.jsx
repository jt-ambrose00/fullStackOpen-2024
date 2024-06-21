import { useState, useEffect } from 'react';

import Lookup from './components/Lookup';
import Matches from './components/Matches';

import searchService from './services/search';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    searchService
      .getAll()
      .then(country => {
        setCountries(country);
      });
  }, []);

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const searchedCountry = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <>
      <h1>Countries</h1>
      <Lookup handleSearchName={handleSearchName} />
      <Matches searchedCountry={searchedCountry} />
    </>
  );
};

export default App;

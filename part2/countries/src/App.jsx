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

  const showCountry = (event) => {
    countries.filter(country => {
      if (country.cca3 === event.target.id) {
        setSearchName(country.name.common);
      };
    });
  };

  return (
    <>
      <h1>Countries</h1>
      <Lookup handleSearchName={handleSearchName} />
      <Matches searchedCountry={searchedCountry} showCountry={showCountry} />
    </>
  );
};

export default App;

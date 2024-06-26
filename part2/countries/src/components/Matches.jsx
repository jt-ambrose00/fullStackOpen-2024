import { useState, useEffect } from 'react';

import searchService from '../services/search';

const Matches = ({ searchedCountry, showCountry }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        if (searchedCountry.length === 1) {
          const country = searchedCountry[0];
          searchService
            .getWeather(country)
            .then(weatherData => setWeather(weatherData));
        };
      }, [searchedCountry]);

    if (searchedCountry.length === 1) {
        const country = searchedCountry[0];
        const languages = Object.values(country.languages);
        const temperature = weather ? weather.main.temp - 273.15 : null;
        const weatherIcon = weather ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png` : null;

        return (
            <div key={country.cca3}>
                <h2>{country.name.common}</h2>
                <p>capital: {country.capital}</p>
                <p>area: {country.area}</p>
                <h4>languages:</h4>
                <ul>
                    {languages.map((language) => (
                        <li key={language}>{language}</li>
                    ))}
                </ul>
                <img
                    src={country.flags.svg}
                    alt={country.flags.alt}
                    className="flag-image"
                />
                {weather && (
                    <>
                        <h3>Weather in {country.capital}</h3>
                        <p>temperature: {temperature.toFixed(2)} celsius</p>
                        <img
                            src={weatherIcon}
                            alt={weather.weather[0].description}
                        />
                        <p>wind: {weather.wind.speed} m/s</p>
                    </>
                )}
            </div>
        );
    };

    if (searchedCountry.length > 10) {
        return <p>too many matches, specify another filter</p>;
    };

    return (
        <>
            {searchedCountry.map(country =>
                <div key={country.cca3} className="container">
                    <p>{country.name.common}</p>
                    <button id={country.cca3} onClick={showCountry}>
                        show
                    </button>
                </div>
            )}
        </>
    );
};
  
export default Matches;

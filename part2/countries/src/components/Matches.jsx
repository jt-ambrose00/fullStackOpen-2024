const Matches = ({ searchedCountry, showCountry }) => {
    if (searchedCountry.length > 10) {
        return <p>too many matches, specify another filter</p>;
    };

    if (searchedCountry.length === 1) {
        const country = searchedCountry[0];
        const languages = Object.values(country.languages);

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
            </div>
        );
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

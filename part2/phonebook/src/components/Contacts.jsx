const Contacts = ({ searchedPerson, deletePerson }) => {
    return (
        <>
            {searchedPerson.map(person =>
                <div key={person.id}>
                    <p>{person.name} {person.number}</p>
                    <button onClick={() => deletePerson(person)}>
                        delete
                    </button>
                </div>
            )}
        </>
    );
};
  
export default Contacts;

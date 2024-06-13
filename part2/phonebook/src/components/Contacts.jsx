const Contacts = ({ searchedPerson }) => {
    return (
        <>
            {searchedPerson.map(person =>
                <p key={person.id}>{person.name} {person.number}</p>
            )}
        </>
    );
};
  
export default Contacts;

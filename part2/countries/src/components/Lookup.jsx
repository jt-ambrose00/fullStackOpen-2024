const Lookup = ({ handleSearchName }) => {
    return (
        <div>
            search:
            <input onChange={handleSearchName} />
        </div>
    );
};
  
export default Lookup;

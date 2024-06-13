const Search = ({ handleSearchName }) => {
    return (
        <div>
            search:
            <input onChange={handleSearchName} />
        </div>
    );
};
  
export default Search;

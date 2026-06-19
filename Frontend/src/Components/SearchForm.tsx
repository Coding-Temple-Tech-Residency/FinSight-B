import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchForm = () => {
  return (
    <form className="flex-3 min-w-lg w-full max-w-2xs flex items-center gap-3 bg-stone-100 rounded-2xl px-2 py-1 mx-3">
      <FontAwesomeIcon icon={faMagnifyingGlass} className=" text-stone-700" />
      <input
        type="text"
        placeholder="Search stocks, companies..."
        className="w-full text-stone-700"
      />
    </form>
  );
};

export default SearchForm;

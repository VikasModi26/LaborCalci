import React from "react";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-500 dark:placeholder-gray-200 dark:text-white"
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-200 " />
    </div>
  );
}

export default SearchBar;
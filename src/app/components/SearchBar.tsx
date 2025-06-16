// src/components/SearchBar.tsx
export function SearchBar() {
    return (
      <div className="area_search">
        <div className="input_search">
          <span>Search</span>
          <input placeholder="Search" />
        </div>
        <div className="list_search"></div>
      </div>
    );
  }
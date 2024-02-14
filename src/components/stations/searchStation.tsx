import React, { useState, useEffect } from "react";
import { coordinates } from "ol/geom/flat/reverse";

export function SearchStation() {
  const [value, setValue] = useState("");
  const [stationNames, setStationNames] = useState<string[]>([]);

  useEffect(() => {
    fetch("./stations.json")
      .then((response) => response.json())
      .then((data) => {
        const names = data.features.map(
          (feature: any) => feature.properties.navn,
        );
        setStationNames(names);
      });
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm: string) => {
    setValue(searchTerm);
    console.log("search ", searchTerm);
  };

  return (
    <div className="searchStation">
      <div className="search-container">
        <h4>Find Train Station</h4>
        <div className="search-inner">
          <input
            className={"searchinput"}
            type="text"
            value={value}
            onChange={onChange}
          />
          <button onClick={() => onSearch(value)}> Search </button>
        </div>
        <div className="dropdown">
          {stationNames
            .filter((item) => {
              const searchTerm = value.toLowerCase();
              const fullName = item.toLowerCase();
              return searchTerm && fullName.startsWith(searchTerm);
            })
            .map((item) => (
              <div
                onClick={() => onSearch(item)}
                className="dropdown-row"
                key={item}
              >
                {item}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

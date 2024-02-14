import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { stationLayer } from "./stationLayer";
import React from "react";

export function StationLayerCheckbox() {
  const { setLayers } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, stationLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== stationLayer));
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show Stations
      </label>
    </div>
  );
}

import React, { useEffect, useState } from "react";

import { StationFeature } from "./stationLayer";
import { useFeatures } from "../map/useFeature";
import { Fill, Stroke, Style, Circle } from "ol/style";

const selectedStyle = new Style({
  stroke: new Stroke({
    color: "black",
    width: 4,
  }),
  fill: new Fill({
    color: [0, 50, 120, 0.2],
  }),
  image: new Circle({
    stroke: new Stroke({ color: "blue", width: 4 }),
    radius: 7,
  }),
});

export function StationSidebar() {
  const { features, visibleFeatures, activeFeatures, setActiveFeature } =
    useFeatures<StationFeature>((l) => l.getClassName() === "station");

  useEffect(() => {
    activeFeatures?.setStyle(selectedStyle);
    return () => activeFeatures?.setStyle(undefined);
  }, [activeFeatures]);

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>Stations</h2>
        <div onMouseLeave={() => setActiveFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              a.getProperties().navn.localeCompare(b.getProperties().navn),
            )
            .map((c) => (
              <div
                key={c.getProperties().navn}
                onMouseEnter={() => setActiveFeature(c)}
                className={c === activeFeatures ? "active" : ""}
              >
                {c.getProperties().navn}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}

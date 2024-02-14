import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { Layer } from "ol/layer";
import { map, MapContext } from "./components/map/mapContext";
import "./app.css";
import { StadiaMaps } from "ol/source";

import { KommuneSidebar } from "./components/kommune/kommuneSidebar";
import { KommuneLayerCheckbox } from "./components/kommune/KommuneLayerCheckbox";
import { StationLayerCheckbox } from "./components/stations/StationLayerCheckbox";
import { StationSidebar } from "./components/stations/stationSidebar";
import { SchoolLayerCheckbox } from "./components/school/SchoolLayerCheckbox";
import { KraftverkLayerCheckbox } from "./components/kraftverk/KraftverkLayerCheckbox";
import { SearchStation } from "./components/stations/searchStation";

//Main Application sent to main.tsx
export function Application() {
  //Basic function for zooming to the relative location of the user.
  function handleZoomToUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      //map is connected to the mapContext.tsx
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 10,
      });
    });
  }

  //When called creates a layers array containing an instance of TileLayer
  //SetLayers when activated adds a new layer on top of the initial layer.
  const [layers, setLayers] = useState<Layer[]>([
    // new TileLayer({ source: new OSM() }),
    new TileLayer({
      source: new StadiaMaps({
          //Add API KEY AFTER REGISTER AT STADIAMAPS
        layer: "alidade_smooth_dark", apiKey:"69dfeec6-dedf-4d6d-8344-154bbd2724d9",
        retina: true,
      }),
    }),
  ]);
  //search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  //Make sure that whatever is in the div element of mapRef remains the same
  //Across renders.
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  //A hook that runs once, when something is mounted, setting the target of the
  //map to whatever is the current value of mapRef.
  useEffect(() => map.setTarget(mapRef.current), []);

  //This hook make sure that the layer of the map are updated whenever the
  //layers state(useState?) is modified.
  useEffect(() => map.setLayers(layers), [layers]);

  //Used to set spesific zoom to an area from the return field.
  function handleZoom(
    e: React.MouseEvent,
    center: [number, number],
    zoom: number,
  ) {
    e.preventDefault();
    map.getView().animate({
      center: center,
      zoom: zoom,
    });
  }

  return (
    //Provider is part of React context API, way to pass object data through
    //a component without having to pass props down every time. Can use a useContext
    //hook to access the values provided. Everything inside this wrapper is
    //Bound by the rules set by MapContext.tsx
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header></header>
      <a className={"mylocation"} href={"#"} onClick={handleZoomToUser}>
        My Location
      </a>
      <a
        className={"zoomOut"}
        href="#"
        onClick={(e) => handleZoom(e, [10, 61], 5)}
      >
        Zoom Out
      </a>
      <SearchStation />
      <nav>
        <KommuneLayerCheckbox />
        <StationLayerCheckbox />
        <SchoolLayerCheckbox />
        <KraftverkLayerCheckbox />
      </nav>
      <main className={"mainback"}>
        <div ref={mapRef}></div>
      </main>
    </MapContext.Provider>
  );
}

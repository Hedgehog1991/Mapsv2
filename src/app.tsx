import React, { MutableRefObject, useEffect, useRef, useState }  from "react";
import {OSM} from "ol/source";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css"
import {Layer} from "ol/layer";
import {map, MapContext} from "./components/map/mapContext";
import "./app.css"

//Main Application sent to main.tsx
export function Application() {


 //Basic function for zooming to the relative location of the user.
    function handleZoomToUser(e: React.MouseEvent) {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition((pos) =>{
            const { latitude, longitude } = pos.coords;
//map is connected to the mapContext.tsx
            map.getView().animate({
                center: [longitude,latitude],
                zoom: 10,
            });
        });
    }

//When called creates a layers array containing an instance of TileLayer
//SetLayers when activated adds a new layer on top of the initial layer.
    const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({source: new OSM() }),]);

//Make sure that whatever is in the div element of mapRef remains the same
//Across renders.
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>

//A hook that runs once, when something is mounted, setting the target of the
//map to whatever is the current value of mapRef.
    useEffect(() => map.setTarget(mapRef.current), []);


//This hook make sure that the layer of the map are updated whenever the
//layers state(useState?) is modified.
    useEffect(() => map.setLayers(layers), [layers]);


    return(
//Provider is part of React context API, way to pass object data through
//a component without having to pass props down every time. Can use a useContext
//hook to access the values provided. Everything inside this wrapper is
//Bound by the rules set by MapContext.tsx
        <MapContext.Provider value={{map, layers, setLayers}}>

            <header>
                <h2>Map</h2>
            </header>
            <nav>
                <a href={"#"} onClick={handleZoomToUser}>My Location
                </a>
            </nav>
            <main>
                <div  ref={mapRef}></div>
            </main>

        </MapContext.Provider>

    )
}
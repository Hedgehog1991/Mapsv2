import React, {useEffect, useState} from "react";
import {Fill, Stroke, Style} from "ol/style";
import {KommuneFeature} from "./kommuneLayer";
import {Feature} from "ol";
import {getStedsNavn} from "./StedsNavn";
import {useFeatures} from "../map/useFeature";


const selectedStyle = new Style({
    stroke: new Stroke({
        color: "black",
        width: 3,
    }),
    fill: new Fill({
    color: [0,0,0,0.1],
}),
});


export function KommuneSidebar() {
    const {
        features,
        visibleFeatures,
        activeFeatures,
        setActiveFeature
    } = useFeatures<KommuneFeature>((l) => l.getClassName() === "kommuner");



    useEffect(() => {
        activeFeatures?.setStyle(selectedStyle);
        return () => activeFeatures?.setStyle(undefined);
    }, [activeFeatures]);



    return (
    <aside className={features.length ? "show" : "hide"}>
        <div>
            <h2>{visibleFeatures.length} Kommuner</h2>
            <div onMouseLeave={() => setActiveFeature(undefined)}>
                {visibleFeatures.sort((a, b) =>
                    getStedsNavn(a.getProperties()).localeCompare(
                        getStedsNavn(b.getProperties()),),
                    ).map((k, index) => (
                        <div
                            onMouseEnter={() => setActiveFeature(k)}
                            key={`${k.getProperties().kommunenummer}-${index}`}
                            className={k === activeFeatures ? "active" : ""}
                        >
                            {getStedsNavn(k.getProperties())}
                        </div>
                        ))}
                    ))
                </div>
        </div>
    </aside>
);

}




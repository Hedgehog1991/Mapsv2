import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Point } from "ol/geom";
import { Feature, MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { useLayer } from "../map/useLayer";

const kraftverkLayer = new VectorLayer({
  source: new VectorSource({
    url: "./public/mini- og mikrokraftverk.json",
    format: new GeoJSON(),
  }),
  style: kraftverkStyle,
});

type Kraftverkprops = {
  vannkraf_1: string;
  idriftaar: number;
  maksytelse: number;
};

type KraftverkFeature = { getProperties(): Kraftverkprops } & Feature<Point>;

function kraftverkStyle(f: FeatureLike) {
  const feature = f as KraftverkFeature;
  const kraftverk = feature.getProperties();
  return new Style({
    image: new RegularShape({
      stroke: new Stroke({ color: "black", width: 2 }),
      fill: new Fill({
        color: "orange",
      }),
      points: 3,
      angle: 0,
      radius: 3 + kraftverk.maksytelse * 15,
    }),
  });
}

function activeKraftverkStyle(f: FeatureLike, resolution: number) {
  const feature = f as KraftverkFeature;
  const kraftverk = feature.getProperties();
  return new Style({
    image: new RegularShape({
      stroke: new Stroke({ color: "orange", width: 3 }),
      fill: new Fill({
        color: "black",
      }),
      points: 3,
      angle: 22,
      radius: 3 + kraftverk.maksytelse * 18,
    }),
    text:
      resolution < 450
        ? new Text({
            text: kraftverk.vannkraf_1,
            offsetY: -18,
            font: "bold 22px sans-serif",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "orange", width: 2 }),
          })
        : undefined,
  });
}

export function KraftverkLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<KraftverkFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 450) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === kraftverkLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as KraftverkFeature);
    } else {
      setActiveFeature(undefined);
    }
  }
  useLayer(kraftverkLayer, checked);

  useEffect(() => {
    activeFeature?.setStyle(activeKraftverkStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show Powerplants
        {activeFeature &&
          " (" + activeFeature.getProperties().vannkraf_1 + ") "}
      </label>
    </div>
  );
}

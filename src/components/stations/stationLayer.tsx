import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { GeoJSON } from "ol/format";
import { Fill, RegularShape, Stroke, Style } from "ol/style";

export type StationLayer = VectorLayer<VectorSource<StationFeature>>;

export type StationFeature = {
  getProperties(): StationProperties;
} & Feature<Point>;

export interface StationProperties {
  objtype: "stasjon";
  navn: string;
}

//Importing and formatting the layer.
export const stationLayer = new VectorLayer({
  className: "station",
  source: new VectorSource({
    url: "./public/stations.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    image: new RegularShape({
      stroke: new Stroke({ color: "black", width: 3 }),
      fill: new Fill({
        color: "#00ff15",
      }),
      points: 4,
      angle: 0,
      radius: 6,
    }),
  }),
});

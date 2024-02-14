import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { Polygon } from "ol/geom";
import { StedsNavn } from "./StedsNavn";
import "/public/kommuner.json";
import { Fill, Stroke, Style } from "ol/style";

export type kommuneLayer = VectorLayer<VectorSource<KommuneFeature>>;

export interface KommuneProperties {
  kommunenummer: string;
  navn: StedsNavn[];
}
export type KommuneFeature = {
  getProperties(): KommuneProperties;
} & Feature<Polygon>;

//Export the vectorlayer from localsource
export const kommuneLayer = new VectorLayer({
  className: "kommuner",
  source: new VectorSource({
    url: "/kommuner.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    fill: new Fill({
      color: "rgba(200,206,100,0.1)",
    }),
    stroke: new Stroke({
      color: "green",
    }),
  }),
});

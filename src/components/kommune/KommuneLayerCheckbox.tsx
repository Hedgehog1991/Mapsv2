import {
  KommuneFeature,
  kommuneLayer,
  KommuneProperties,
} from "./kommuneLayer";
import { map, MapContext } from "../map/mapContext";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import React from "react";
import { MapBrowserEvent, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { offset } from "ol/sphere";

export function KommuneLayerCheckbox() {
  const { setLayers } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, [checked]);

  const [selectedKommune, setSelectedKommune] = useState<
    KommuneFeature | undefined
  >();

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const source = kommuneLayer.getSource() as VectorSource<KommuneFeature>;

    const clickedKommune = source.getFeaturesAtCoordinate(
      e.coordinate,
    ) as KommuneFeature[];

    if (clickedKommune.length === 1) {
      setSelectedKommune(clickedKommune[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedKommune(undefined);
      overlay.setPosition(undefined);
    }
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
      map.un("click", handleClick);
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
        {checked ? "Hide" : "Show"} Kommuner
      </label>
      <div ref={overlayRef} className={"kommune-overlay"}>
        {selectedKommune && (
          <>
            {
              (selectedKommune.getProperties() as KommuneProperties).navn.find(
                (n) => n.sprak === "nor",
              )!.navn
            }
            , <br />{" "}
            {
              (selectedKommune.getProperties() as KommuneProperties)
                .kommunenummer
            }
          </>
        )}
      </div>
    </div>
  );
}

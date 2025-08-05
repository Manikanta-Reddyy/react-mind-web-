// src/components/MapView/MapView.tsx
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./MapView.css";

import { usePolygonStore } from "../../context/usePolygonStore";
import { useTimeStore } from "../../context/useStore";
import { getPolygonCentroid } from "../../utils/getPolygonCentroid";
import { fetchTemperature } from "../../api/fetchTemperature";
import { matchRuleColor } from "../../utils/matchRuleColor";
import { applyPolygonColor } from "../../utils/applyPolygonColor";
import type { Feature, Polygon } from "geojson";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const [drawnPolygon, setDrawnPolygon] = useState<any>(null);
  const [selectedDatasource, setSelectedDatasource] = useState<string>("");

  const setSelectedId = usePolygonStore((s) => s.setSelectedId);
  const { polygonConfigs } = usePolygonStore();
  const { selected } = useTimeStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [88.444, 22.7],
      zoom: 14.5,
    });

    mapRef.current = map;

    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.dragRotate.disable();

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: "simple_select",
    });

    drawRef.current = draw;
    map.addControl(draw);

    map.on("load", () => {
      if (!map.getLayer("polygon-fill")) {
        map.addLayer({
          id: "polygon-fill",
          type: "fill",
          source: "mapbox-gl-draw-cold",
          paint: {
            "fill-color": ["coalesce", ["feature-state", "fill"], "#cccccc"],
            "fill-opacity": 0.5,
          },
          filter: ["==", "$type", "Polygon"],
        });
      }
    });

    map.on("draw.create", (e: { features: any[] }) => {
      const polygon = e.features[0];
      const coordinates = polygon.geometry.coordinates[0];
      const numPoints = coordinates.length - 1;

      if (numPoints < 3 || numPoints > 12) {
        alert("Polygon must have between 3 and 12 points.");
        draw.delete(polygon.id);
        return;
      }

      setDrawnPolygon(polygon);
      setSelectedId(polygon.id);

      const datasources = ["Satellite", "Sensors"];
      const chosen =
        datasources.length === 1
          ? datasources[0]
          : prompt(
              `Select a datasource:\n${datasources.map((d) => `- ${d}`).join("\n")}`,
              datasources[0]
            );
      if (chosen) setSelectedDatasource(chosen);
    });

    map.on("draw.selectionchange", (e: { features: any[] }) => {
      if (e.features.length > 0) {
        setSelectedId(e.features[0].id);
      } else {
        setSelectedId(null);
      }
    });

    return () => map.remove();
  }, [setSelectedId]);

  const handleDrawPolygon = () => {
    drawRef.current?.changeMode("draw_polygon");
  };

  const handleEditPolygon = () => {
    const polygonId = drawnPolygon?.id;
    if (polygonId) {
      drawRef.current?.changeMode("direct_select", { featureId: polygonId });
    }
  };

  const handleDeletePolygon = () => {
    if (drawnPolygon?.id) {
      drawRef.current?.delete(drawnPolygon.id);
      setDrawnPolygon(null);
      setSelectedDatasource("");
    }
  };

  useEffect(() => {
    if (!mapRef.current || !drawRef.current) return;

    const features = drawRef.current.getAll().features;

    const today = new Date();
    const yyyyMMdd = today.toISOString().split("T")[0];

    features.forEach(async (polygon) => {
      if (polygon.geometry.type !== "Polygon") return;

      const id = polygon.id;
      const config = polygonConfigs[id as string];
      if (!config) return;

      const centroid = getPolygonCentroid(polygon as Feature<Polygon>);
      const hours = Array.isArray(selected)
        ? Array.from({ length: selected[1] - selected[0] + 1 }, (_, i) => selected[0] + i)
        : [selected as number];

      const values = await fetchTemperature(centroid[1], centroid[0], yyyyMMdd, hours);
      if (values.length === 0) return;

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const matchedColor = matchRuleColor(avg, config.rules);
      applyPolygonColor(mapRef.current!, id as string, matchedColor);
    });
  }, [selected, polygonConfigs]);

  return (
    <div className="component-box map-box" style={{ position: "relative" }}>
      <span className="section-label">Map</span>

      <div className="button-group">
        <button className="draw-button" onClick={handleDrawPolygon}>
          Draw Polygon
        </button>
        <button className="edit-button" onClick={handleEditPolygon} disabled={!drawnPolygon}>
          Edit
        </button>
        <button className="delete-button" onClick={handleDeletePolygon} disabled={!drawnPolygon}>
          Delete
        </button>
      </div>

      <div ref={mapContainerRef} className="map-container" />

      {selectedDatasource && (
        <div className="datasource-label">
          Tagged with: <strong>{selectedDatasource}</strong>
        </div>
      )}
    </div>
  );
};

export default MapView;

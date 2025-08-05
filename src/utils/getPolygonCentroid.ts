import type { Feature, Polygon } from "geojson";

export const getPolygonCentroid = (polygon: Feature<Polygon>): [number, number] => {
  const coords = polygon.geometry.coordinates[0];
  let x = 0;
  let y = 0;
  coords.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });
  return [x / coords.length, y / coords.length];
};

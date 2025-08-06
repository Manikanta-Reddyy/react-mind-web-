export const applyPolygonColor = (
  map: mapboxgl.Map,
  polygonId: string,
  color: string
) => {
  map.setFeatureState(
    {
      source: "mapbox-gl-draw-cold",
      id: polygonId,
    },
    { fill: color } // ✅ must match layer's fill-color key
  );
};

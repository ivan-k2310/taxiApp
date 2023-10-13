import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXZhbmsyMzEwIiwiYSI6ImNsbm9mdXA2NzAyZjcyaW56ZnRob2E4dHEifQ.Rhd0MQ92PP6zN7DuMQyjbw";

export default function App() {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(5.864700514506441);
  const [lat, setLat] = useState(51.82260373119273);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-122.662323, 45.523751], // starting position
      zoom: 12,
    });
    const bounds = [
      [-123.069003, 45.395273], // Southwest bound
      [-122.303707, 45.612333], // Northeast bound
    ];

    map.setMaxBounds(bounds);

    // Function to make a directions request
    map.on("load", () => {
      async function getRoute(end) {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/-122.662323,45.523751;${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: "GET" }
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        };

        // If the route already exists on the map, reset it using setData
        if (map.getSource("route")) {
          map.getSource("route").setData(geojson);
        } else {
          map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: geojson,
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });
        }
      }

      // Event listener for clicking on the map
      map.on("click", (event) => {
        const coords = Object.keys(event.lngLat).map(
          (key) => event.lngLat[key]
        );
        getRoute(coords);
      });

      // Add starting point to the map
      map.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [-122.662323, 45.523751],
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
        },
      });
    });
  }, []);

  return (
    <div class="main-container">
      <div class="route-container">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        <div ref={mapContainer} className="map-container" />
      </div>
      <div class="information-container">
        <div class="driver-info">
          <div>
            {/* hardcoded */}
            <p class="chauffeur">chauffeur</p>
            <p class="chauffeur-name">kelbin</p>
          </div>
        </div>
        <div class="price-info">
          {/* hardcoded */}
          <p class="price-title">Huidige prijs:</p>
          <p class="price">10,15 euro</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PROTECTED_AREAS } from "../lib/protected-areas";
import { getDriftConePolygon } from "../lib/drift";

// Fix default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom SVG Icons for clean, high-tech environmental map visualization
const createCustomIcon = (emoji: string, bg: string, ring: string) => {
  return L.divIcon({
    className: "custom-map-icon",
    html: `<div style="
      background: ${bg};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      border: 2px solid ${ring};
      font-size: 15px;
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const FireIcon = createCustomIcon("🔥", "#DC2626", "#FCA5A5");
const UserLocationIcon = createCustomIcon("📍", "#0284C7", "#7DD3FC");
const ProtectedAreaIcon = createCustomIcon("🛡️", "#0D9488", "#5EEAD4");
const SmokeReportIcon = createCustomIcon("📸", "#9333EA", "#D8B4FE");
const ClearReportIcon = createCustomIcon("🟢", "#059669", "#6EE7B7");

interface FireEvent {
  id: string;
  latitude: number;
  longitude: number;
  confidence?: number;
  source?: string;
  isWithinDriftCone?: boolean;
}

interface MapProps {
  siteLat: number;
  siteLon: number;
  fires: FireEvent[];
  smokeReports?: any[];
  clearReports?: any[];
  windSpeedKmh?: number;
  windDirectionDeg?: number;
  predictionMinutes?: number;
  customSimulationResult?: any;
  onFireSelect?: (fire: FireEvent) => void;
  showProtectedAreas?: boolean;
}

// Controller component to zoom/pan to newly selected locations
function MapRecenter({ lat, lon, zoom }: { lat: number; lon: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], zoom || 11, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [lat, lon, zoom, map]);
  return null;
}

export function Map({
  siteLat,
  siteLon,
  fires,
  smokeReports = [],
  clearReports = [],
  windSpeedKmh = 18,
  windDirectionDeg = 225,
  predictionMinutes = 60,
  customSimulationResult,
  onFireSelect,
  showProtectedAreas = true,
}: MapProps) {
  const [mounted, setMounted] = useState(false);
  const [layerType, setLayerType] = useState<"standard" | "satellite" | "terrain">("standard");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[520px] bg-slate-900 border border-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 text-xs font-mono">
        INITIALIZING GEOSPATIAL MAP ENGINE...
      </div>
    );
  }

  // Pick Tile Layer based on user control
  const tileUrls = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  };

  const currentTileUrl = tileUrls[layerType];

  // Calculate drift distance traveled for the prediction duration
  const driftDistanceKm = (windSpeedKmh * (predictionMinutes / 60));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      {/* Top Map Layer & Prediction Duration Controls */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap gap-2">
        <div className="bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex gap-1 shadow-lg">
          {(["standard", "satellite", "terrain"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLayerType(mode)}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg transition-all ${
                layerType === mode
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <MapContainer
        key={`${siteLat}-${siteLon}-${layerType}`}
        center={[siteLat, siteLon]}
        zoom={11}
        className="w-full h-[520px] z-0"
        scrollWheelZoom={true}
      >
        <MapRecenter lat={siteLat} lon={siteLon} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={currentTileUrl}
        />

        {/* 50km Monitoring Reference Circle */}
        <Circle
          center={[siteLat, siteLon]}
          pathOptions={{
            color: "#0284C7",
            fillColor: "#0284C7",
            fillOpacity: 0.03,
            weight: 1.5,
            dashArray: "6, 6",
          }}
          radius={50000}
        />

        {/* User / Target Site Location Marker */}
        <Marker position={[siteLat, siteLon]} icon={UserLocationIcon}>
          <Popup>
            <div className="p-1 text-slate-900">
              <h4 className="font-extrabold text-xs uppercase text-sky-800">Designated Monitored Target</h4>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                {siteLat.toFixed(4)}, {siteLon.toFixed(4)}
              </p>
              <p className="text-[11px] text-slate-700 mt-1 font-semibold">
                Atmospheric drift vectors are continuously calculated toward this coordinate.
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Protected Areas Sensitive Receptors */}
        {showProtectedAreas &&
          PROTECTED_AREAS.map((area) => (
            <Marker
              key={area.id}
              position={[area.latitude, area.longitude]}
              icon={ProtectedAreaIcon}
            >
              <Popup>
                <div className="p-1 text-slate-900">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    {area.category}
                  </span>
                  <h4 className="font-bold text-xs mt-1 text-slate-900">{area.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Liaison: {area.contactUnit}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Active Fires & Smoke Drift Cones */}
        {fires.map((fire) => {
          // Generate smoke drift cone polygon projecting downwind from this fire
          const conePoints = getDriftConePolygon(
            fire.latitude,
            fire.longitude,
            windDirectionDeg,
            Math.max(driftDistanceKm, 3)
          );

          // Central vector trajectory line
          const smokeHeading = (windDirectionDeg + 180) % 360;
          const endLat = fire.latitude + (driftDistanceKm / 111) * Math.cos((smokeHeading * Math.PI) / 180);
          const endLon = fire.longitude + (driftDistanceKm / (111 * Math.cos((fire.latitude * Math.PI) / 180))) * Math.sin((smokeHeading * Math.PI) / 180);

          return (
            <div key={`fire-group-${fire.id}`}>
              {/* Drift Cone Polygon */}
              <Polygon
                positions={conePoints}
                pathOptions={{
                  color: "#DC2626",
                  fillColor: "#EF4444",
                  fillOpacity: 0.22,
                  weight: 1.5,
                  dashArray: "4, 4",
                }}
              />

              {/* Central Vector Trajectory Arrow / Line */}
              <Polyline
                positions={[
                  [fire.latitude, fire.longitude],
                  [endLat, endLon],
                ]}
                pathOptions={{
                  color: "#F97316",
                  weight: 3,
                  opacity: 0.85,
                }}
              />

              {/* Fire Marker */}
              <Marker
                position={[fire.latitude, fire.longitude]}
                icon={FireIcon}
                eventHandlers={{
                  click: () => onFireSelect && onFireSelect(fire),
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-red-100 text-red-800">
                      NASA FIRMS Thermal Hotspot
                    </span>
                    <h4 className="font-extrabold text-xs text-red-700 mt-1">
                      Combustion Anomaly Detected
                    </h4>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                      Coordinates: {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}
                    </p>
                    <p className="text-[11px] text-slate-700 mt-1">
                      Projected Plume Heading: <strong>{Math.round(smokeHeading)}°</strong> at{" "}
                      <strong>{Math.round(windSpeedKmh)} km/h</strong>
                    </p>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}

        {/* Custom Simulation Result Cone (if What-If simulation executed) */}
        {customSimulationResult && customSimulationResult.conePolygon && (
          <Polygon
            positions={customSimulationResult.conePolygon}
            pathOptions={{
              color: "#F59E0B",
              fillColor: "#FBBF24",
              fillOpacity: 0.35,
              weight: 2,
            }}
          />
        )}

        {/* Citizen Smoke Reports */}
        {smokeReports.map((report) => (
          <Marker
            key={`smoke-rep-${report.id}`}
            position={[report.latitude, report.longitude]}
            icon={SmokeReportIcon}
          >
            <Popup>
              <div className="p-1 text-slate-900">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                  Citizen Smoke Observation
                </span>
                <p className="text-xs font-bold mt-1 text-purple-900">
                  AI Edge Confidence: {Math.round((report.confidenceScore || 0.9) * 100)}%
                </p>
                {report.description && (
                  <p className="text-[11px] text-slate-600 mt-0.5 italic">"{report.description}"</p>
                )}
                <p className="text-[10px] text-emerald-700 font-bold mt-1">
                  Status: {report.status || "VERIFIED"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Citizen Clear Observations */}
        {clearReports.map((report) => (
          <Marker
            key={`clear-rep-${report.id}`}
            position={[report.latitude, report.longitude]}
            icon={ClearReportIcon}
          >
            <Popup>
              <div className="p-1 text-slate-900">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Clear Observation
                </span>
                <p className="text-xs font-bold mt-1 text-emerald-800">
                  Confidence: {Math.round((report.confidenceScore || 0.95) * 100)}%
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">Ground air confirmed clean.</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/95 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl text-xs text-slate-300">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Map Legend
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span>🔥</span>
            <span>Active Fire</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded bg-red-500/50 border border-red-500"></span>
            <span>Drift Cone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>💨</span>
            <span>Wind Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>Target Site</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Protected Area</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📸</span>
            <span>Citizen Smoke</span>
          </div>
        </div>
      </div>
    </div>
  );
}

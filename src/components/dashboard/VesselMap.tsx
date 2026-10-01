import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Sungai Brantas — alur meliuk-liuk akurat (Mojokerto → Mojosari → Jatirejo)
// Mengikuti meander asli sungai pada citra satelit Esri
const RIVER_PATH: [number, number][] = [
  [-7.4720, 112.4140],
  [-7.4708, 112.4178],
  [-7.4690, 112.4210],
  [-7.4665, 112.4232],
  [-7.4640, 112.4250],
  [-7.4622, 112.4282],
  [-7.4615, 112.4322],
  [-7.4628, 112.4360],
  [-7.4650, 112.4392],
  [-7.4672, 112.4422],
  [-7.4685, 112.4458],
  [-7.4682, 112.4498],
  [-7.4665, 112.4532],
  [-7.4640, 112.4560],
  [-7.4615, 112.4588],
  [-7.4598, 112.4622],
  [-7.4595, 112.4665],
  [-7.4610, 112.4702],
  [-7.4635, 112.4732],
  [-7.4662, 112.4758],
  [-7.4685, 112.4788],
  [-7.4700, 112.4825],
  [-7.4702, 112.4868],
  [-7.4690, 112.4908],
  [-7.4670, 112.4942],
  [-7.4648, 112.4975],
  [-7.4635, 112.5012],
  [-7.4640, 112.5052],
  [-7.4658, 112.5088],
  [-7.4682, 112.5118],
  [-7.4708, 112.5145],
  [-7.4735, 112.5172],
  [-7.4762, 112.5198],
  [-7.4790, 112.5222],
  [-7.4818, 112.5245],
  [-7.4848, 112.5265],
  [-7.4878, 112.5282],
  [-7.4908, 112.5298],
  [-7.4938, 112.5312],
  [-7.4968, 112.5325],
  [-7.4998, 112.5338],
  [-7.5028, 112.5352],
  [-7.5055, 112.5370],
];

const GEO_FENCE: [number, number][] = [
  [-7.4480, 112.4080],
  [-7.4480, 112.5500],
  [-7.5120, 112.5500],
  [-7.5120, 112.4080],
];

const DOCK: [number, number] = RIVER_PATH[0];

const WASTE_SPOTS: { pos: [number, number]; type: string; emoji: string }[] = [
  { pos: [-7.4555, 112.4590], type: "Plastik", emoji: "🗑" },
  { pos: [-7.4670, 112.5155], type: "Organik", emoji: "🍂" },
  { pos: [-7.4880, 112.5355], type: "Plastik", emoji: "🗑" },
];

function interpolatePath(points: [number, number][], t: number) {
  const totalSegments = points.length - 1;
  const segment = Math.min(Math.floor(t * totalSegments), totalSegments - 1);
  const localT = t * totalSegments - segment;
  const p0 = points[segment];
  const p1 = points[segment + 1];
  const lat = p0[0] + (p1[0] - p0[0]) * localT;
  const lng = p0[1] + (p1[1] - p0[1]) * localT;
  const angle = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * (180 / Math.PI);
  return { lat, lng, angle };
}

function createBoatIcon(angle: number): L.DivIcon {
  return L.divIcon({
    className: "vessel-boat-icon",
    html: `
      <div style="transform: rotate(${angle}deg); transform-origin: center; filter: drop-shadow(0 0 6px oklch(0.78 0.15 195 / 0.8));">
        <svg width="32" height="32" viewBox="-12 -12 24 24" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,-9 5,5 3,7 -3,7 -5,5" fill="oklch(0.78 0.15 195)" stroke="oklch(0.95 0.05 195)" stroke-width="0.8" />
          <rect x="-2.5" y="-3" width="5" height="5" rx="1" fill="oklch(0.55 0.12 195)" />
          <line x1="0" y1="-4" x2="0" y2="-7" stroke="oklch(0.95 0.05 195)" stroke-width="0.6" />
          <circle cx="0" cy="-7.5" r="1" fill="oklch(0.72 0.19 155)">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const dockIcon = L.divIcon({
  className: "vessel-dock-icon",
  html: `<div style="font-size:18px;filter:drop-shadow(0 0 4px oklch(0.82 0.17 85));">⚓</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function VesselMap() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 60000;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) % duration;
      setProgress(elapsed / duration);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const vessel = useMemo(() => interpolatePath(RIVER_PATH, progress), [progress]);
  const boatIcon = useMemo(() => createBoatIcon(vessel.angle), [vessel.angle]);

  const trailEnd = Math.max(1, Math.floor(progress * (RIVER_PATH.length - 1)) + 1);
  const trail: [number, number][] = [...RIVER_PATH.slice(0, trailEnd), [vessel.lat, vessel.lng]];

  return (
    <>
      <MapContainer
        center={[-7.4780, 112.4790]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "260px", width: "100%", background: "oklch(0.16 0.014 256)" }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          opacity={0.8}
        />
        <Polyline
          positions={[...GEO_FENCE, GEO_FENCE[0]]}
          pathOptions={{ color: "oklch(0.78 0.15 195)", weight: 1.5, dashArray: "6 4", opacity: 0.5 }}
        />
        <Polyline positions={RIVER_PATH} pathOptions={{ color: "#22d3ee", weight: 5, opacity: 0.6 }} />
        <Polyline positions={trail} pathOptions={{ color: "oklch(0.72 0.19 155)", weight: 3, opacity: 0.95 }} />
        <Marker position={DOCK} icon={dockIcon}>
          <Popup>⚓ Dock & Charging Station</Popup>
        </Marker>
        {WASTE_SPOTS.map((spot, i) => (
          <CircleMarker
            key={i}
            center={spot.pos}
            radius={8}
            pathOptions={{ color: "oklch(0.65 0.22 25)", fillColor: "oklch(0.65 0.22 25)", fillOpacity: 0.4, weight: 2 }}
          >
            <Tooltip>{spot.emoji} {spot.type}</Tooltip>
          </CircleMarker>
        ))}
        <Marker position={[vessel.lat, vessel.lng]} icon={boatIcon}>
          <Popup>
            <div className="text-xs">
              <div className="font-semibold">SI-CEKAT Vessel</div>
              <div>Lat: {vessel.lat.toFixed(4)}°</div>
              <div>Lng: {vessel.lng.toFixed(4)}°</div>
              <div>Status: Patrol Aktif</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="pointer-events-none absolute bottom-2 right-2 z-[400] rounded-md bg-background/85 px-2 py-1 font-mono text-[10px] text-cyan backdrop-blur-sm">
        {vessel.lat.toFixed(4)}°, {vessel.lng.toFixed(4)}°
      </div>
    </>
  );
}

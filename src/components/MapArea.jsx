import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { Flame, ShieldAlert, Wind, Phone, Users } from 'lucide-react';

export default function MapArea({ hotspots, stations, showWind }) {
  
  // 1. สร้าง Custom Icon สำหรับไฟป่าโดยใช้ Tailwind + Lucide
  const createFireIcon = () => {
    const iconHTML = renderToString(
      <div className="relative flex justify-center items-center">
        <div className="absolute -inset-2 bg-red-500/40 rounded-full animate-ping"></div>
        <div className="bg-red-950 p-2 rounded-full border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] relative z-10">
          <Flame size={20} className="text-red-500" />
        </div>
      </div>
    );
    return L.divIcon({ html: iconHTML, className: 'bg-transparent', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] });
  };

  // 2. สร้าง Custom Icon สำหรับหน่วยดับเพลิง
  const createStationIcon = () => {
    const iconHTML = renderToString(
      <div className="bg-blue-950 p-2 rounded-xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
        <ShieldAlert size={18} className="text-blue-400" />
      </div>
    );
    return L.divIcon({ html: iconHTML, className: 'bg-transparent', iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -20] });
  };

  // พิกัดกึ่งกลางประเทศไทย (จุดเริ่มต้นเมื่อโหลดแผนที่)
  const thailandCenter = [15.8700, 100.9925];

  return (
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-4 relative h-[650px] overflow-hidden backdrop-blur-sm flex flex-col">
      
      {/* ป้ายคำอธิบาย */}
      <div className="absolute top-6 right-6 z-[1000] bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl backdrop-blur-md flex flex-col gap-2.5 shadow-xl">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">สัญลักษณ์แผนที่จริง</p>
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <div className="bg-red-900/50 p-1 rounded-md border border-red-500/50"><Flame size={14} className="text-red-500"/></div>
          <span>จุดความร้อน (Hotspots)</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <div className="bg-blue-900/50 p-1 rounded-md border border-blue-500/50"><ShieldAlert size={14} className="text-blue-400"/></div>
          <span>หน่วยดับไฟป่า</span>
        </div>
      </div>

      {/* แผนที่จริงจาก Leaflet */}
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 relative z-0">
        <MapContainer 
          center={thailandCenter} 
          zoom={6} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
        >
          {/* Base Map โทนสีมืด (Dark Mode) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* ปักหมุดไฟป่า */}
          {hotspots.map((spot) => (
            <Marker key={`hotspot-${spot.id}`} position={[spot.lat, spot.lng]} icon={createFireIcon()}>
              <Popup className="custom-popup">
                <div className="bg-slate-950 text-slate-200 p-1 rounded-md min-w-[200px]">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <p className="font-bold text-white text-sm m-0">{spot.name}</p>
                  </div>
                  <p className="text-xs text-slate-400 m-0 mb-1">สถานะ: <span className="text-red-400">{spot.status}</span></p>
                  <p className="text-xs text-slate-400 m-0 mb-1">พื้นที่: <span className="text-white">{spot.area}</span></p>
                  <p className="text-xs text-slate-400 m-0">ความรุนแรง: <span className="text-red-500 font-bold">{spot.severity.toUpperCase()}</span></p>
                  
                  {showWind && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1 text-xs text-emerald-400">
                      <Wind size={12} /> ทิศทางลมพัดไปตะวันออกเฉียงเหนือ
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* ปักหมุดหน่วยงาน */}
          {stations.map((station) => (
            <Marker key={`station-${station.id}`} position={[station.lat, station.lng]} icon={createStationIcon()}>
              <Popup className="custom-popup">
                <div className="bg-slate-950 text-slate-200 p-1 rounded-md min-w-[200px]">
                  <p className="font-bold text-white text-sm m-0 mb-2 border-b border-slate-800 pb-2">{station.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <Users size={12} /> กำลังพลพร้อมรบ: {station.personnel} นาย
                  </div>
                  <a href={`tel:${station.phone}`} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-2 py-1.5 rounded-md text-xs font-semibold no-underline hover:bg-blue-500 transition-colors">
                    <Phone size={12} /> {station.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}
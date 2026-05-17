import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'; // 1. เพิ่ม Import สำหรับจัดกลุ่มจุด
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { Flame, ShieldAlert, Wind, Phone, Navigation } from 'lucide-react';

export default function MapArea({ hotspots, stations, showWind, windData }) { // อย่าลืมเติมรับ props windData
  
  // สร้าง Custom Icon สำหรับไฟป่า (พร้อมทิศทางลมหมุนตามจริง)
  const createFireIcon = (severity) => {
    // กำหนดสีของเปลวไฟตามความรุนแรง (h = แดง, n = ส้ม)
    const fireColor = severity === 'high' ? 'text-red-500' : 'text-orange-400';
    const bgColor = severity === 'high' ? 'bg-red-500/40' : 'bg-orange-500/40';
    const borderColor = severity === 'high' ? 'border-red-500' : 'border-orange-500';
    const shadowColor = severity === 'high' ? 'rgba(239,68,68,0.8)' : 'rgba(249,115,22,0.8)';

    // ถ้าระบบอนุญาตให้แสดงทิศทางลม และมีข้อมูลลมจริง ให้สร้างลูกศรหมุนตามองศา
    const windArrow = (showWind && windData) ? `
      <div 
        class="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-0.5 border border-slate-900 shadow-md"
        style="transform: rotate(${windData.degrees}deg);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
      </div>
    ` : '';

    const iconHTML = renderToString(
      <div className="relative flex justify-center items-center">
        <div className={`absolute -inset-2 ${bgColor} rounded-full animate-ping`}></div>
        <div className={`bg-slate-950 p-2 rounded-full border-2 ${borderColor} shadow-[0_0_15px_${shadowColor}] relative z-10`}>
          <Flame size={20} className={fireColor} />
        </div>
        {/* แทรกลูกศรทิศทางลม */}
        <div dangerouslySetInnerHTML={{ __html: windArrow }}></div>
      </div>
    );
    return L.divIcon({ html: iconHTML, className: 'bg-transparent', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] });
  };

  // 2. ปรับ Icon สถานีดับเพลิงให้ลอยๆ ไม่มีกรอบพื้นหลัง (ใช้เงาเรืองแสงแทน)
  const createStationIcon = () => {
    const iconHTML = renderToString(
      <div className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.9)] hover:text-blue-300 transition-colors">
        <ShieldAlert size={26} strokeWidth={2.5} />
      </div>
    );
    return L.divIcon({ html: iconHTML, className: 'bg-transparent', iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -15] });
  };

  // 3. สร้าง Icon สำหรับตัวเลขเวลาจุดรวมตัวกัน (Cluster Icon) เข้ากับธีม Dark Mode
  const createClusterCustomIcon = function (cluster) {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div class="bg-blue-900/90 text-blue-200 w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] font-bold text-sm backdrop-blur-sm">${count}</div>`,
      className: 'custom-marker-cluster',
      iconSize: L.point(40, 40, true),
    });
  };
  // สร้าง Icon สำหรับตัวเลขจุดรวมไฟป่า (Fire Cluster) โทนสีแดง
  const createFireClusterIcon = function (cluster) {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div class="bg-red-950/90 text-red-200 w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] font-bold text-sm backdrop-blur-sm">${count}</div>`,
      className: 'custom-marker-cluster',
      iconSize: L.point(40, 40, true),
    });
  };

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
          <div className="drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"><ShieldAlert size={16} className="text-blue-400"/></div>
          <span>หน่วยดับไฟป่า</span>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 relative z-0">
        <MapContainer 
          center={thailandCenter} 
          zoom={6} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
          maxZoom={18}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM contributors'
          />

          {/* จัดกลุ่มหมุดไฟป่า (Fire Cluster) เพื่อความแม่นยำและสบายตา */}
          <MarkerClusterGroup 
            chunkedLoading
            iconCreateFunction={createFireClusterIcon}
            maxClusterRadius={20} // ปรับรัศมีการดูดจุดไฟป่าเข้าด้วยกัน
          >
            {hotspots.map((spot) => (
              <Marker key={"hotspot-" + spot.id} position={[spot.lat, spot.lng]} icon={createFireIcon(spot.severity)}>
                <Popup className="custom-popup">
                  <div className="bg-slate-950 text-slate-200 p-1 rounded-md min-w-[200px]">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <p className="font-bold text-white text-sm m-0">{spot.name}</p>
                    </div>
                    <p className="text-xs text-slate-400 m-0 mb-1">สถานะ: <span className="text-red-400">{spot.status}</span></p>
                    <p className="text-xs text-slate-400 m-0 mb-1">พื้นที่: <span className="text-white">{spot.area}</span></p>
                    <p className="text-xs text-slate-400 m-0">ความรุนแรง: <span className="text-red-500 font-bold">{spot.severity ? spot.severity.toUpperCase() : 'ไม่ระบุ'}</span></p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* 4. ใช้ MarkerClusterGroup คลุมสถานีดับเพลิง เพื่อให้มันกรุ๊ปกันตอนซูมออก */}
          <MarkerClusterGroup 
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={50} // ปรับรัศมีวงกลมการดูดจุดรวมกัน (ยิ่งมากยิ่งรวมกันเยอะ)
          >
            {stations.map((station) => (
              <Marker key={"station-" + station.id} position={[station.lat, station.lng]} icon={createStationIcon()}>
                <Popup className="custom-popup">
                  <div className="bg-slate-950 text-slate-200 p-1 rounded-md min-w-[200px]">
                    <p className="font-bold text-white text-sm m-0 mb-1 border-b border-slate-800 pb-2">{station.name}</p>
                    <p className="text-xs text-slate-400 m-0 mb-2">📍 {station.locationName}</p>
                    <a href={`tel:${station.phone}`} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-2 py-1.5 rounded-md text-xs font-semibold no-underline hover:bg-blue-500 transition-colors mt-2">
                      <Phone size={12} /> {station.phone}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          
        </MapContainer>
      </div>
    </div>
  );
}
import React from 'react';
import { Flame, ShieldAlert, Wind, Phone, Users } from 'lucide-react';

export default function MapArea({ hotspots, stations, showWind }) {
  return (
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between relative min-h-[650px] overflow-hidden backdrop-blur-sm">
      
      {/* คำอธิบายสัญลักษณ์ (Legend) */}
      <div className="absolute top-4 left-4 z-30 bg-slate-950/90 border border-slate-800/80 p-3.5 rounded-xl backdrop-blur-md flex flex-col gap-2.5 shadow-xl max-w-xs">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">คำอธิบายสัญลักษณ์</p>
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <div className="bg-red-500/20 p-1 rounded-md"><Flame size={14} className="text-red-500"/></div>
          <span>จุดเสี่ยงเกิดไฟป่าบ่อย (Hotspots)</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <div className="bg-blue-500/20 p-1 rounded-md"><ShieldAlert size={14} className="text-blue-400"/></div>
          <span>สำนักงานป่าไม้ / หน่วยดับไฟป่า</span>
        </div>
        {showWind && (
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <div className="bg-emerald-500/20 p-1 rounded-md"><Wind size={14} className="text-emerald-400"/></div>
            <span>ทิศทางการพัดพาของลม</span>
          </div>
        )}
      </div>

      {/* พื้นที่จำลองแผนที่ประเทศไทยด้วย CSS (โครงร่างทรงยาวแนวตั้ง) */}
      <div className="relative w-full max-w-md h-[550px] mx-auto mt-12 border border-slate-800/60 rounded-3xl bg-slate-950/40 shadow-inner flex items-center justify-center">
        
        {/* ข้อความประกอบพิกัดหลังฉาก */}
        <div className="absolute text-[9px] font-mono text-slate-800 tracking-widest uppercase select-none pointer-events-none">
          THAILAND GEOGRAPHIC MOCK MAP LAYER
        </div>

        {/* --- วนลูปแสดงจุดไฟป่า (Hotspots Pins) --- */}
        {hotspots.map((spot) => (
          <div key={spot.id} className="absolute group z-10" style={{ top: spot.top, left: spot.left }}>
            <div className="relative cursor-pointer">
              {/* เอฟเฟกต์วงกลมคลื่นความร้อนกระจาย */}
              <div className="absolute -inset-3 bg-red-500/30 rounded-full animate-ping opacity-75"></div>
              <div className="bg-red-950/50 p-1.5 rounded-full border border-red-500/40 relative z-10 hover:scale-110 transition-transform">
                <Flame size={20} className="text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
              </div>
              
              {/* Tooltip รายละเอียดเมื่อวางเมาส์เหนือจุด */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-95 group-hover:scale-100 z-50">
                <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <p className="text-xs font-bold text-white truncate">{spot.name}</p>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p className="text-slate-400">สถานะ: <span className="text-red-400 font-medium">{spot.status}</span></p>
                  <p className="text-slate-400">พื้นที่เสียหายประเมิน: <span className="text-slate-200 font-medium">{spot.area}</span></p>
                  <p className="text-slate-400">ความรุนแรง: <span className="text-red-500 font-bold uppercase">{spot.severity}</span></p>
                </div>
              </div>
            </div>

            {/* เวกเตอร์ลูกศรลมกระจายออกจากจุดเกิดไฟเพื่อระบุทิศทางการลุกลาม */}
            {showWind && (
              <div className="absolute top-0 left-0 translate-x-5 -translate-y-5 opacity-60 pointer-events-none">
                <Wind size={16} className="text-emerald-400 animate-pulse" />
                <div className="h-[1px] w-6 bg-gradient-to-r from-emerald-400 to-transparent transform -rotate-45 mt-0.5"></div>
              </div>
            )}
          </div>
        ))}

        {/* --- วนลูปแสดงหน่วยงานดับเพลิง (Fire Station Pins) --- */}
        {stations.map((station) => (
          <div key={`station-${station.id}`} className="absolute group z-20" style={{ top: station.top, left: station.left }}>
            <div className="relative">
              <div className="bg-blue-950/80 p-2 rounded-xl border border-blue-500/40 shadow-lg cursor-pointer hover:bg-blue-600/30 transition-all hover:scale-110">
                <ShieldAlert size={18} className="text-blue-400" />
              </div>
              
              {/* การ์ดข้อมูลหน่วยงานและการติดต่อ */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-slate-950 border border-slate-800 p-3.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 z-50">
                <p className="text-xs font-bold text-white mb-2 truncate border-b border-slate-900 pb-1">{station.name}</p>
                
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                  <Users size={12} />
                  <span>กำลังพลพร้อมรบ: {station.personnel} นาย</span>
                </div>

                <a 
                  href={`tel:${station.phone}`} 
                  className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors border border-blue-500/20"
                >
                  <Phone size={12} />
                  <span>โทรออก: {station.phone}</span>
                </a>
              </div>
            </div>
          </div>
        ))}

      </div>

      <div className="text-center text-[11px] text-slate-500 mt-4">
        * ข้อมูลพิกัดบนแผนที่ข้างต้นเป็นการแสดงจุดสถิติและความถี่เพื่อประกอบการออกแบบ UI/UX ของ Landing page เท่านั้น
      </div>
    </div>
  );
}
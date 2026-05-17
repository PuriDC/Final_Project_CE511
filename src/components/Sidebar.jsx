import React from 'react';
import { Flame, ShieldAlert, Wind, Eye, EyeOff, Navigation } from 'lucide-react';

export default function Sidebar({ hotspots, stations, wind, showWind, setShowWind }) {
  
  // ฟังก์ชันแปลงชื่อทิศภาษาอังกฤษเป็นภาษาไทย
  const getThaiDirection = (compass) => {
    if (!compass) return 'ไม่ระบุ';
    const dict = {
      'N': 'เหนือ (N)', 'NNE': 'ตะวันออกเฉียงเหนือตอนเหนือ (NNE)', 'NE': 'ตะวันออกเฉียงเหนือ (NE)', 
      'ENE': 'ตะวันออกเฉียงเหนือตอนตะวันออก (ENE)', 'E': 'ตะวันออก (E)', 'ESE': 'ตะวันออกเฉียงใต้ตอนตะวันออก (ESE)', 
      'SE': 'ตะวันออกเฉียงใต้ (SE)', 'SSE': 'ตะวันออกเฉียงใต้ตอนใต้ (SSE)', 'S': 'ใต้ (S)', 
      'SSW': 'ตะวันตกเฉียงใต้ตอนใต้ (SSW)', 'SW': 'ตะวันตกเฉียงใต้ (SW)', 'WSW': 'ตะวันตกเฉียงใต้ตอนตะวันตก (WSW)', 
      'W': 'ตะวันตก (W)', 'WNW': 'ตะวันตกเฉียงเหนือตอนตะวันตก (WNW)', 'NW': 'ตะวันตกเฉียงเหนือ (NW)', 
      'NNW': 'ตะวันตกเฉียงเหนือตอนเหนือ (NNW)'
    };
    return dict[compass] || compass;
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* 🔴 การ์ด 1: จุดความร้อนสะสม */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">จุดความร้อนสะสม</p>
            <h3 className="text-4xl font-black text-white tracking-tight group-hover:text-red-400 transition-colors">
              {hotspots ? hotspots.length : 0}
            </h3>
          </div>
          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-red-500">
            <Flame size={22} className="animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          อัปเดตสดจากดาวเทียม NASA (VIIRS)
        </p>
      </div>

      {/* 🔵 การ์ด 2: หน่วยป้องกันไฟป่า */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">หน่วยป้องกันไฟป่า</p>
            <h3 className="text-4xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
              {stations ? stations.length : 0}
            </h3>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-blue-400">
            <ShieldAlert size={22} />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          📍 แยกตามรายอำเภอทั่วประเทศไทย
        </p>
      </div>

      {/* 🟢 การ์ด 3: ข้อมูลสภาพลมจริงสลับเปิด-ปิด (อัปเดตดีไซน์เข็มทิศ) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Wind size={18} className="text-emerald-400" />
            <span className="text-sm font-medium">ทิศทางและความเร็วลม</span>
          </div>
          
          <button 
            onClick={() => setShowWind(!showWind)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
              showWind 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            {showWind ? (
              <>
                <Eye size={13} />
                <span>แสดงบนแผนที่</span>
              </>
            ) : (
              <>
                <EyeOff size={13} />
                <span>ซ่อนทิศทางลม</span>
              </>
            )}
          </button>
        </div>

        {/* ส่วนแสดงข้อมูลและเข็มทิศ */}
        <div className="flex gap-4 bg-slate-950/50 p-3.5 rounded-xl border border-slate-900 items-center">
          
          {/* UI เข็มทิศจำลอง */}
          <div className="shrink-0 flex flex-col items-center justify-center pl-1">
            <div className="relative w-16 h-16 rounded-full border-[3px] border-slate-800 bg-slate-900 shadow-inner flex items-center justify-center">
              {/* ตัวอักษรทิศ N E S W */}
              <span className="absolute top-0.5 text-[9px] text-slate-500 font-bold">N</span>
              <span className="absolute right-1 text-[9px] text-slate-500 font-bold">E</span>
              <span className="absolute bottom-0.5 text-[9px] text-slate-500 font-bold">S</span>
              <span className="absolute left-1 text-[9px] text-slate-500 font-bold">W</span>

              {/* ลูกศรเข็มทิศที่หมุนตามค่า degrees */}
              <div 
                className="transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${wind?.degrees || 0}deg)` }}
              >
                <Navigation
                  size={20}
                  className="text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"
                  fill="currentColor"
                />
              </div>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-2 font-bold bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {wind?.degrees ? `${wind.degrees}°` : '---°'}
            </div>
          </div>

          {/* ข้อมูล Text ฝั่งขวา */}
          <div className="flex-1 flex flex-col justify-center space-y-2.5">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 mb-0.5">พัดไปทางทิศ:</span>
              <span className="text-xs font-bold text-emerald-400 leading-tight">
                {wind && wind.compass ? getThaiDirection(wind.compass) : 'กำลังโหลด...'}
              </span>
            </div>
            <div className="flex flex-col border-t border-slate-800/80 pt-2">
              <span className="text-[11px] text-slate-500 mb-0.5">ความเร็วลมเฉลี่ย:</span>
              <span className="text-sm font-semibold text-white">
                {wind && wind.speed ? `${wind.speed} กม./ชม.` : '-'}
              </span>
            </div>
          </div>

        </div>

        <p className="text-[10px] text-slate-500 mt-3 italic text-center">
          * อ้างอิงลมระดับความสูง 10m ศูนย์กลางประเทศไทย
        </p>
      </div>

    </div>
  );
}
import React from 'react';
import { AlertTriangle, Wind, Navigation, Info, Shield, Activity } from 'lucide-react';

export default function Sidebar({ hotspots, stations, wind, showWind, setShowWind }) {
  return (
    <div className="flex flex-col gap-5">
      
      {/* การ์ดสถานการณ์ปัจจุบัน */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 backdrop-blur-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} className="text-red-500" />
          สรุปสถานการณ์วันนี้
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
            <p className="text-3xl font-black text-red-500">{hotspots.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">จุดความร้อนพบบ่อย</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
            <p className="text-3xl font-black text-blue-400">{stations.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">หน่วยป้องกันไฟป่า</p>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5 animate-bounce" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-400">แจ้งเตือน:</span> พื้นที่ภาคเหนือตอนบนมีความแห้งแล้งสูง ลมกระโชกแรง เสี่ยงต่อการเกิดไฟป่าลุกลามข้ามเขต
          </p>
        </div>
      </div>

      {/* การ์ดทิศทางลม & การคาดการณ์ */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Wind size={16} className="text-emerald-400" />
            ทิศทางและอนามัยลม
          </h2>
          <button 
            onClick={() => setShowWind(!showWind)}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all border ${
              showWind 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showWind ? 'แสดงทิศทางลมอยู่' : 'ซ่อนทิศทางลม'}
          </button>
        </div>
        
        <div className="flex flex-col gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900 shadow-inner">
              {/* ชี้ไปตามองศาที่กำหนดในข้อมูล */}
              <Navigation 
                size={22} 
                className="text-emerald-400 transition-transform duration-500 ease-out" 
                style={{ transform: `rotate(${wind.angle}deg)` }}
              />
              <div className="absolute top-1 text-[9px] font-bold text-slate-600">N</div>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{wind.directionText}</p>
              <p className="text-xl font-black text-slate-200">{wind.speed} <span className="text-xs font-normal text-slate-400">กม./ชม.</span></p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-900 text-xs text-emerald-400 flex items-start gap-2 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>{wind.forecast}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
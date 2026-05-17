import React from 'react';
import { CloudFog, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Pm25Ranking({ pmData }) {
  
  // ฟังก์ชันคำนวณระดับสีตามมาตรฐาน PM 2.5 ใหม่ของประเทศไทย
  const getAirQualityLevel = (pm25) => {
    if (pm25 <= 15.0) return { label: 'อากาศดีมาก', color: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30' };
    if (pm25 <= 25.0) return { label: 'อากาศดี', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    if (pm25 <= 37.5) return { label: 'ปานกลาง', color: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    if (pm25 <= 75.0) return { label: 'เริ่มมีผลกระทบ', color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30' };
    return { label: 'อันตราย', color: 'bg-red-600', text: 'text-red-500', border: 'border-red-500/30' };
  };

  if (!pmData || pmData.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <CloudFog className="text-slate-400" size={24} />
        <h2 className="text-xl font-bold text-slate-100">10 อันดับจังหวัดค่า PM 2.5 สูงสุด</h2>
        <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 ml-2 animate-pulse">
          Real-Time
        </span>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {pmData.map((province, index) => {
            const level = getAirQualityLevel(province.pm25);
            return (
              <div key={index} className={`flex items-center justify-between p-3 rounded-xl border bg-slate-950/50 ${level.border} transition-colors hover:bg-slate-900`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-slate-950 ${level.color}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{province.name}</h4>
                    <p className={`text-[11px] font-medium flex items-center gap-1 ${level.text}`}>
                      {province.pm25 > 37.5 ? <AlertTriangle size={10} /> : <ShieldCheck size={10} />}
                      {level.label}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-black text-white">
                    {province.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
        <p className="text-xs text-slate-500 text-center mt-4">
          * ข้อมูลอ้างอิงจาก Open-Meteo Air Quality API (ค่าประมาณการรายชั่วโมง)
        </p>
      </div>
    </div>
  );
}
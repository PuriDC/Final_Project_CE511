import React from 'react';
import { Newspaper, Clock, ArrowRight, AlertCircle } from 'lucide-react';

export default function NewsSection({ news }) {
  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Newspaper size={22} className="text-red-400" />
          อัปเดตข่าวสารและสถานการณ์ล่าสุด
        </h2>
        <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
          ดูข่าวทั้งหมด <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:bg-slate-800/60 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden backdrop-blur-sm"
          >
            {/* แถบสีด้านบนการ์ดข่าว (สีแดงถ้าเป็นข่าวด่วน สีเทาถ้าข่าวปกติ) */}
            <div className={`absolute top-0 left-0 w-full h-1 ${item.isUrgent ? 'bg-red-500' : 'bg-slate-700'}`}></div>
            
            <div className="flex items-center justify-between mb-3 mt-1">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                item.isUrgent ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.source}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock size={12} />
                {item.time}
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-slate-200 leading-snug mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
              {item.isUrgent && <AlertCircle size={14} className="inline mr-1 text-red-500 -mt-0.5" />}
              {item.title}
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
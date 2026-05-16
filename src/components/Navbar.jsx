import React from 'react';
import { Flame, Phone } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="bg-red-500/10 p-2.5 rounded-xl text-red-500 border border-red-500/20">
          <Flame size={26} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">ThaiFire<span className="text-red-500">Alert</span></h1>
            <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 font-medium uppercase tracking-wider animate-pulse">Live</span>
          </div>
          <p className="text-xs text-slate-400">ระบบติดตามสถานการณ์และคาดการณ์ทิศทางไฟป่า</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right mr-2">
          <span className="text-[11px] text-slate-400 font-medium">สายด่วนภัยพิบัติ/ไฟป่า</span>
          <span className="text-lg font-black text-red-400 tracking-wider">1362</span>
        </div>
        <a 
          href="tel:1362" 
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(220,38,38,0.25)] hover:scale-[1.02]"
        >
          <Phone size={18} />
          <span className="hidden md:inline">รายงานเหตุไฟป่า</span>
          <span className="md:hidden">โทรเลย</span>
        </a>
      </div>
    </nav>
  );
}
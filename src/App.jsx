import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import { hotspotsData, stationsData, windCondition } from './data/mockData';

export default function App() {
  const [showWind, setShowWind] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500/30">
      {/* ส่วนหัวของเว็บไซต์ */}
      <Navbar />

      {/* ส่วนเนื้อหาหลัก */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ฝั่งซ้าย: แดชบอร์ดสรุปผลและสภาพอากาศ (ใช้ 1 ส่วนจาก 4 ส่วนของ Grid) */}
        <div className="lg:col-span-1">
          <Sidebar 
            hotspots={hotspotsData}
            stations={stationsData}
            wind={windCondition}
            showWind={showWind}
            setShowWind={setShowWind}
          />
        </div>

        {/* ฝั่งขวา: แผนที่อัจฉริยะ (ใช้ 3 ส่วนจาก 4 ส่วนของ Grid) */}
        <div className="lg:col-span-3">
          <MapArea 
            hotspots={hotspotsData}
            stations={stationsData}
            showWind={showWind}
          />
        </div>

      </main>
    </div>
  );
}
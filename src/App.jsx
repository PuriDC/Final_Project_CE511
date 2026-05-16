import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import NewsSection from './components/NewsSection'; // 1. นำเข้าคอมโพเนนต์ NewsSection
import { hotspotsData, stationsData, windCondition, newsData } from './data/mockData'; // 2. นำเข้า newsData

export default function App() {
  const [showWind, setShowWind] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500/30 pb-10">
      <Navbar />

      {/* เพิ่ม max-w-7xl เพื่อจำกัดความกว้างและ mx-auto เพื่อให้อยู่กึ่งกลาง */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        
        {/* ส่วนบน: Dashboard & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Sidebar 
              hotspots={hotspotsData}
              stations={stationsData}
              wind={windCondition}
              showWind={showWind}
              setShowWind={setShowWind}
            />
          </div>
          <div className="lg:col-span-3">
            <MapArea 
              hotspots={hotspotsData}
              stations={stationsData}
              showWind={showWind}
            />
          </div>
        </div>

        {/* ส่วนล่าง: ข่าวสารที่เพิ่งเพิ่มเข้ามา */}
        <NewsSection news={newsData} />

      </main>
    </div>
  );
}
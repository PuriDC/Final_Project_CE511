import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import NewsSection from './components/NewsSection';
import { windCondition, hotspotsData as mockHotspots, newsData as mockNews } from './data/mockData';

export default function App() {
  const [showWind, setShowWind] = useState(true);
  
  const [realHotspots, setRealHotspots] = useState([]);
  const [realNews, setRealNews] = useState([]);
  const [realStations, setRealStations] = useState([]); // เพิ่ม State เก็บสถานีจริง
  const [loading, setLoading] = useState(true);

  const GNEWS_API_KEY = 'e31b66ff7d0a07a62593e590e7ca4fc2'; 
  const NASA_API_KEY = '3f93b24ca294fabf6027241024451ab9';

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // 1. ดึงข้อมูลข่าวสารจาก GNews API
        if (GNEWS_API_KEY ) {
          const newsRes = await fetch(`https://gnews.io/api/v4/search?q=ไฟป่า+ประเทศไทย&lang=th&country=th&max=3&apikey=${GNEWS_API_KEY}`);
          const newsJson = await newsRes.json();
          if (newsJson.articles) {
            const formattedNews = newsJson.articles.map((article, index) => ({
              id: index,
              title: article.title,
              source: article.source.name,
              time: new Date(article.publishedAt).toLocaleDateString('th-TH'),
              summary: article.description,
              url: article.url,
              isUrgent: index === 0
            }));
            setRealNews(formattedNews);
          }
        } else {
          setRealNews(mockNews);
        }

        // 2. ดึงข้อมูลจุดความร้อน NASA
        if (NASA_API_KEY) {
          const nasaUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_API_KEY}/VIIRS_SNPP_NRT/97,5,106,21/1`;
          Papa.parse(nasaUrl, {
            download: true,
            header: true,
            complete: (results) => {
              const formattedHotspots = results.data
                // เช็คว่ามีพิกัดมาให้ครบถ้วน
                .filter(item => item.latitude && item.longitude)
                
                // ✨ พระเอกของเรา! กรองเอาเฉพาะจุดที่ NASA มั่นใจสูง (h) หรือ ปานกลาง (n) เท่านั้น 
                // (ตัดจุดระดับต่ำ (l) ที่อาจจะเป็นแค่หลังคาสังกะสีสะท้อนแสงทิ้งไป)
                .filter(item => item.confidence === 'h' || item.confidence === 'n')
                
                // จำกัดจำนวนจุดที่แสดงบนแผนที่ (เพิ่มเป็น 100 จุดได้เลยเพราะเรากรองของเสียออกไปแล้ว)
                .slice(0, 100)
                
                .map((item, index) => ({
                  id: index,
                  name: `จุดความร้อนดาวเทียม (ละติจูด ${parseFloat(item.latitude).toFixed(2)})`,
                  lat: parseFloat(item.latitude),
                  lng: parseFloat(item.longitude),
                  severity: item.confidence === 'h' ? 'high' : 'medium', // โชว์แค่ High กับ Medium
                  area: 'ประเมินจากดาวเทียม',
                  status: 'ตรวจพบไฟป่า (Real-time)'
                }));
              setRealHotspots(formattedHotspots);
            }
          });
        } else {
          setRealHotspots(mockHotspots);
        }

        // 3. ดึงและกรองข้อมูลสถานีป้องกันไฟป่า (ย้ายมาไว้ที่นี่)
        const stationRes = await fetch('/stations.json');
        const stationData = await stationRes.json();
        let uniqueStations = [];

        if (stationData.records && Array.isArray(stationData.records)) {
          const seenDistricts = new Set();
          stationData.records.forEach((record) => {
            const amphoe = record[11];   
            const province = record[12]; 
            const lat = parseFloat(record[5]);
            const lng = parseFloat(record[6]);

            if (isNaN(lat) || isNaN(lng) || !amphoe || !province) return;

            const districtKey = `${amphoe}-${province}`;

            if (!seenDistricts.has(districtKey)) {
              seenDistricts.add(districtKey);
              uniqueStations.push({
                id: record[0], 
                name: record[3] || 'หน่วยงานภาคสนาม', 
                lat: lat, 
                lng: lng, 
                phone: '-',
                locationName: `อ.${amphoe} จ.${province}`
              });
            }
          });
        }
        setRealStations(uniqueStations);

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setRealNews(mockNews);
        setRealHotspots(mockHotspots);
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500/30 pb-10">
      <Navbar />

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            <span className="ml-3 text-slate-400">กำลังเชื่อมต่อข้อมูลเรียลไทม์...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            {/* ส่งจำนวนและรายการ hotspots และ stations จริงไปให้ Sidebar */}
            <Sidebar 
              hotspots={realHotspots.length > 0 ? realHotspots : mockHotspots}
              stations={realStations} // ส่งค่าสถานีที่กรองแล้วไปให้ Sidebar นับเลข
              wind={windCondition}
              showWind={showWind}
              setShowWind={setShowWind}
            />
          </div>
          <div className="lg:col-span-3">
            {/* ส่งสถานีจริงไปให้แผนที่วาดจุด */}
            <MapArea 
              hotspots={realHotspots.length > 0 ? realHotspots : mockHotspots}
              stations={realStations} 
              showWind={showWind}
            />
          </div>
        </div>

        <NewsSection news={realNews.length > 0 ? realNews : mockNews} />

      </main>
    </div>
  );
}
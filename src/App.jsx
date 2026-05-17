import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import NewsSection from './components/NewsSection';
// ลบ windCondition ออกจาก mockData ได้เลยเพราะเราจะใช้ของจริง
import { hotspotsData as mockHotspots, newsData as mockNews } from './data/mockData'; 

export default function App() {
  const [showWind, setShowWind] = useState(true);
  
  const [realHotspots, setRealHotspots] = useState([]);
  const [realNews, setRealNews] = useState([]);
  const [realStations, setRealStations] = useState([]);
  
  // เพิ่ม State สำหรับเก็บข้อมูลลมจริง
  const [realWind, setRealWind] = useState(null); 
  const [loading, setLoading] = useState(true);

  const GNEWS_API_KEY = 'e31b66ff7d0a07a62593e590e7ca4fc2'; 
  const NASA_API_KEY = '3f93b24ca294fabf6027241024451ab9';

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // 1. ดึงข่าว GNews
        if (GNEWS_API_KEY) {
          const newsRes = await fetch(`https://gnews.io/api/v4/search?q=ไฟป่า+ประเทศไทย&lang=th&country=th&max=3&apikey=${GNEWS_API_KEY}`);
          const newsJson = await newsRes.json();
          if (newsJson.articles) {
            setRealNews(newsJson.articles.map((article, index) => ({
              id: index,
              title: article.title,
              source: article.source.name,
              time: new Date(article.publishedAt).toLocaleDateString('th-TH'),
              summary: article.description,
              url: article.url,
              isUrgent: index === 0
            })));
          }
        } else {
          setRealNews(mockNews);
        }

        // 2. ดึงดาวเทียม NASA (กรองเฉพาะจุดไฟป่ามั่นใจสูง/ปานกลาง)
        if (NASA_API_KEY) {
          const nasaUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_API_KEY}/VIIRS_SNPP_NRT/97,5,106,21/1`;
          Papa.parse(nasaUrl, {
            download: true,
            header: true,
            complete: (results) => {
              const formattedHotspots = results.data
                .filter(item => item.latitude && item.longitude)
                .filter(item => item.confidence === 'h' || item.confidence === 'n')
                .slice(0, 100)
                .map((item, index) => ({
                  id: index,
                  name: `จุดความร้อนดาวเทียม (ละติจูด ${parseFloat(item.latitude).toFixed(2)})`,
                  lat: parseFloat(item.latitude),
                  lng: parseFloat(item.longitude),
                  severity: item.confidence === 'h' ? 'high' : 'medium',
                  area: 'ประเมินจากดาวเทียม',
                  status: 'ตรวจพบไฟป่า (Real-time)'
                }));
              setRealHotspots(formattedHotspots);
            }
          });
        } else {
          setRealHotspots(mockHotspots);
        }

        // 3. ดึงสถานี JSON
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
                lat: lat, lng: lng, phone: '-', locationName: `อ.${amphoe} จ.${province}`
              });
            }
          });
        }
        setRealStations(uniqueStations);

        // 💨 4. ดึงข้อมูลลมแบบ Real-Time จาก Open-Meteo API (พิกัดกลางประเทศไทย)
        const windRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.87&longitude=100.99&current=wind_speed_10m,wind_direction_10m');
        const windData = await windRes.json();
        
        if (windData && windData.current) {
          const speed = Math.round(windData.current.wind_speed_10m); // ความเร็วลม (กม./ชม.)
          const degrees = windData.current.wind_direction_10m; // องศาทิศทางลม (0-360)
          
          // คำนวณองศาให้ออกมาเป็นชื่อทิศทาง
          const compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
          const compassText = compassSector[(degrees / 22.5).toFixed(0)];
          
          setRealWind({
            speed: speed,
            degrees: degrees, // ส่งองศาไปหมุนลูกศรบนแผนที่
            compass: compassText,
            description: `ความเร็วลม ${speed} กม./ชม.`
          });
        }

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
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
            <Sidebar 
              hotspots={realHotspots}
              stations={realStations}
              wind={realWind || { speed: 0, compass: 'N', degrees: 0, description: 'กำลังโหลดข้อมูลลม...' }} // ส่งลมจริงไป
              showWind={showWind}
              setShowWind={setShowWind}
            />
          </div>
          <div className="lg:col-span-3">
            {/* ส่ง windData จริงๆ ไปให้แผนที่วาดทิศทางลม */}
            <MapArea 
              hotspots={realHotspots}
              stations={realStations} 
              showWind={showWind}
              windData={realWind} 
            />
          </div>
        </div>

        <NewsSection news={realNews} />
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import NewsSection from './components/NewsSection';
import { stationsData, windCondition, hotspotsData as mockHotspots, newsData as mockNews } from './data/mockData';

export default function App() {
  const [showWind, setShowWind] = useState(true);
  
  // สร้าง State สำหรับเก็บข้อมูลจริง
  const [realHotspots, setRealHotspots] = useState([]);
  const [realNews, setRealNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ใส่ API KEY ของคุณตรงนี้
  const GNEWS_API_KEY = 'e31b66ff7d0a07a62593e590e7ca4fc2'; 
  const NASA_API_KEY = '3f93b24ca294fabf6027241024451ab9';

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // 1. ดึงข้อมูลข่าวสารจาก GNews API
        if (GNEWS_API_KEY) {
          const newsRes = await fetch(`https://gnews.io/api/v4/search?q=ไฟป่า+ประเทศไทย&lang=th&country=th&max=3&apikey=${GNEWS_API_KEY}`);
          const newsJson = await newsRes.json();
          if (newsJson.articles) {
            // แปลงข้อมูลที่ได้จาก API ให้อยู่ในรูปแบบที่เว็บเราใช้
            const formattedNews = newsJson.articles.map((article, index) => ({
              id: index,
              title: article.title,
              source: article.source.name,
              time: new Date(article.publishedAt).toLocaleDateString('th-TH'),
              summary: article.description,
              url: article.url,
              isUrgent: index === 0 // สมมติให้ข่าวแรกเป็นข่าวด่วน
            }));
            setRealNews(formattedNews);
            console.log("ข่าวที่ได้จาก GNews:", formattedNews); // เพิ่มบรรทัดนี้
          }
        } else {
          setRealNews(mockNews); // ถ้ายังไม่มี API Key ให้ใช้ข้อมูลจำลอง
          
        }

        // 2. ดึงข้อมูลจุดความร้อนจากดาวเทียม NASA FIRMS (VIIRS ประเทศไทย ย้อนหลัง 1 วัน)
        if (NASA_API_KEY) {
          // ใช้พิกัดกรอบสี่เหลี่ยมครอบประเทศไทย ย้อนหลัง 3 วัน
          const nasaUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_API_KEY}/VIIRS_SNPP_NRT/97,5,106,21/3`;
          
          Papa.parse(nasaUrl, {
            download: true,
            header: true,
            complete: (results) => {
              const formattedHotspots = results.data
                .filter(item => item.latitude && item.longitude) // กรองเฉพาะข้อมูลที่มีพิกัด
                .slice(0, 50) // จำกัดแค่ 50 จุดเพื่อไม่ให้แผนที่กระตุก
                .map((item, index) => ({
                  id: index,
                  name: `จุดความร้อนดาวเทียม (ละติจูด ${parseFloat(item.latitude).toFixed(2)})`,
                  lat: parseFloat(item.latitude),
                  lng: parseFloat(item.longitude),
                  severity: item.confidence === 'h' ? 'high' : item.confidence === 'n' ? 'medium' : 'low',
                  area: 'ประเมินจากดาวเทียม',
                  status: 'ตรวจพบใหม่ (Real-time)'
                }));
              setRealHotspots(formattedHotspots);
              console.log("จุดไฟป่าที่ได้จาก NASA:", formattedHotspots); // เพิ่มบรรทัดนี้
            }
          });
        } else {
          setRealHotspots(mockHotspots); // ถ้ายังไม่มี API Key ให้ใช้ข้อมูลจำลอง
        }
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
            <span className="ml-3 text-slate-400">กำลังเชื่อมต่อข้อมูลดาวเทียม...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Sidebar 
              hotspots={realHotspots.length > 0 ? realHotspots : mockHotspots} // ใช้ข้อมูลจริง
              stations={stationsData} // สถานีดับเพลิงเรายังคงใช้ข้อมูลตั้งต้น
              wind={windCondition}
              showWind={showWind}
              setShowWind={setShowWind}
            />
          </div>
          <div className="lg:col-span-3">
            <MapArea 
              hotspots={realHotspots.length > 0 ? realHotspots : mockHotspots} // ใช้ข้อมูลจริง
              stations={stationsData}
              showWind={showWind}
            />
          </div>
        </div>

        {/* ส่งข้อมูลข่าวสารของจริงลงไป */}
        <NewsSection news={realNews.length > 0 ? realNews : mockNews} />

      </main>
    </div>
  );
}
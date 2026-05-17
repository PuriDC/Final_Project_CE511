import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import NewsSection from './components/NewsSection';
import Pm25Ranking from './components/Pm25Ranking'; // 1. เพิ่ม Import Component ฝุ่น
import { hotspotsData as mockHotspots, newsData as mockNews } from './data/mockData'; 

export default function App() {
  const [showWind, setShowWind] = useState(true);
  
  const [realHotspots, setRealHotspots] = useState([]);
  const [realNews, setRealNews] = useState([]);
  const [realStations, setRealStations] = useState([]);
  const [realWind, setRealWind] = useState(null); 
  const [realPm25, setRealPm25] = useState([]); // 2. เพิ่ม State สำหรับเก็บข้อมูล PM 2.5
  
  const [loading, setLoading] = useState(true);

  const NASA_API_KEY = '3f93b24ca294fabf6027241024451ab9';

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // 1. ดึงข่าว GNews (Google News RSS)
        const rssQuery = encodeURIComponent('https://news.google.com/rss/search?q=ไฟป่า+PM2.5+ประเทศไทย&hl=th&gl=TH&ceid=TH:th');
        const newsRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssQuery}`);
        const newsJson = await newsRes.json();
        if (newsJson.status === 'ok' && newsJson.items) {
          const formattedNews = newsJson.items.slice(0, 3).map((article, index) => {
            const cleanSummary = article.description ? article.description.replace(/<[^>]+>/g, '') : 'คลิกเพื่ออ่านรายละเอียดข่าว...';
            const titleParts = article.title.split(' - ');
            const sourceName = titleParts.length > 1 ? titleParts.pop() : 'Google News';
            return {
              id: index,
              title: titleParts.join(' - '),
              source: sourceName,
              time: new Date(article.pubDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
              summary: cleanSummary.length > 120 ? cleanSummary.substring(0, 120) + '...' : cleanSummary,
              url: article.link,
              isUrgent: index === 0 
            };
          });
          setRealNews(formattedNews);
        } else {
          setRealNews(mockNews);
        }

        // 2. ดึงดาวเทียม NASA
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
                  lat: parseFloat(item.latitude), lng: parseFloat(item.longitude),
                  severity: item.confidence === 'h' ? 'high' : 'medium',
                  area: 'ประเมินจากดาวเทียม', status: 'ตรวจพบไฟป่า (Real-time)'
                }));
              setRealHotspots(formattedHotspots);
            }
          });
        } else { setRealHotspots(mockHotspots); }

        // 3. ดึงสถานี JSON
        const stationRes = await fetch('/stations.json');
        const stationData = await stationRes.json();
        let uniqueStations = [];
        if (stationData.records && Array.isArray(stationData.records)) {
          const seenDistricts = new Set();
          stationData.records.forEach((record) => {
            const amphoe = record[11];   
            const province = record[12]; 
            const lat = parseFloat(record[5]); const lng = parseFloat(record[6]);
            if (isNaN(lat) || isNaN(lng) || !amphoe || !province) return;
            const districtKey = `${amphoe}-${province}`;
            if (!seenDistricts.has(districtKey)) {
              seenDistricts.add(districtKey);
              uniqueStations.push({
                id: record[0], name: record[3] || 'หน่วยงานภาคสนาม', 
                lat: lat, lng: lng, phone: '-', locationName: `อ.${amphoe} จ.${province}`
              });
            }
          });
        }
        setRealStations(uniqueStations);

        // 4. ดึงข้อมูลลมแบบ Real-Time
        const windRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.87&longitude=100.99&current=wind_speed_10m,wind_direction_10m');
        const windData = await windRes.json();
        if (windData && windData.current) {
          const speed = Math.round(windData.current.wind_speed_10m);
          const degrees = windData.current.wind_direction_10m;
          const compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
          setRealWind({
            speed: speed, degrees: degrees, compass: compassSector[(degrees / 22.5).toFixed(0)],
            description: `ความเร็วลม ${speed} กม./ชม.`
          });
        }

        // 🌫️ 5. ดึงข้อมูล PM 2.5 แบบ Real-Time (พิกัดจังหวัดหลักๆ ที่เสี่ยงไฟป่า)
        const checkProvinces = [
          { name: 'เชียงใหม่', lat: 18.7883, lng: 98.9853 },
          { name: 'เชียงราย', lat: 19.9105, lng: 99.8406 },
          { name: 'แม่ฮ่องสอน', lat: 19.3000, lng: 97.9667 },
          { name: 'น่าน', lat: 18.7756, lng: 100.7730 },
          { name: 'พะเยา', lat: 19.1667, lng: 99.9000 },
          { name: 'ลำปาง', lat: 18.1565, lng: 99.6421 },
          { name: 'ตาก', lat: 16.8833, lng: 99.1167 },
          { name: 'พิษณุโลก', lat: 16.8170, lng: 100.2586 },
          { name: 'ขอนแก่น', lat: 16.4322, lng: 102.8236 },
          { name: 'อุดรธานี', lat: 17.4138, lng: 102.7872 },
          { name: 'นครราชสีมา', lat: 14.9799, lng: 102.0978 },
          { name: 'อุบลราชธานี', lat: 15.2384, lng: 104.8487 },
          { name: 'กรุงเทพมหานคร', lat: 13.7563, lng: 100.5018 },
          { name: 'ชลบุรี', lat: 13.3611, lng: 100.9850 },
          { name: 'ภูเก็ต', lat: 7.8804, lng: 98.3922 }
        ];

        const lats = checkProvinces.map(p => p.lat).join(',');
        const lngs = checkProvinces.map(p => p.lng).join(',');
        const pmUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=pm2_5`;
        
        const pmRes = await fetch(pmUrl);
        const pmJson = await pmRes.json();
        
        if (Array.isArray(pmJson)) {
          // นำข้อมูลที่ได้มาจับคู่ชื่อจังหวัด เรียงจากมากไปน้อย แล้วตัดมาแค่ 10 อันดับแรก
          const ranking = pmJson.map((data, idx) => ({
            name: checkProvinces[idx].name,
            pm25: data.current.pm2_5 || 0
          }))
          .sort((a, b) => b.pm25 - a.pm25)
          .slice(0, 10);
          
          setRealPm25(ranking);
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
              hotspots={realHotspots} stations={realStations}
              wind={realWind || { speed: 0, compass: 'N', degrees: 0, description: 'กำลังโหลดข้อมูลลม...' }} 
              showWind={showWind} setShowWind={setShowWind}
            />
          </div>
          <div className="lg:col-span-3">
            <MapArea hotspots={realHotspots} stations={realStations} showWind={showWind} windData={realWind} />
          </div>
        </div>

        <NewsSection news={realNews} />
        
        {/* แสดงส่วนจัดอันดับฝุ่น PM 2.5 ต่อจากข่าว */}
        <Pm25Ranking pmData={realPm25} />

      </main>
    </div>
  );
}
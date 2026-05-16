export const hotspotsData = [
  { id: 1, name: 'อุทยานแห่งชาติดอยสุเทพ-ปุย (เชียงใหม่)', top: '22%', left: '32%', severity: 'high', area: '15 ไร่', status: 'กำลังควบคุม' },
  { id: 2, name: 'เขตรักษาพันธุ์สัตว์ป่าแม่ตื่น (ตาก)', top: '38%', left: '28%', severity: 'medium', area: '5 ไร่', status: 'เฝ้าระวัง' },
  { id: 3, name: 'อุทยานแห่งชาติเอราวัณ (กาญจนบุรี)', top: '58%', left: '30%', severity: 'high', area: '22 ไร่', status: 'วิกฤต' },
  { id: 4, name: 'ป่าสงวนแห่งชาติ (แม่ฮ่องสอน)', top: '18%', left: '24%', severity: 'high', area: '30 ไร่', status: 'กำลังควบคุม' },
  { id: 5, name: 'เทือกเขาภูพาน (สกลนคร)', top: '38%', left: '68%', severity: 'low', area: '2 ไร่', status: 'ดับแล้ว/เฝ้าระวัง' },
];

export const stationsData = [
  { id: 1, name: 'ศูนย์ปฏิบัติการไฟป่าเชียงใหม่', top: '20%', left: '35%', phone: '053-211-120', personnel: 45 },
  { id: 2, name: 'หน่วยป้องกันรักษาป่าที่ ตก.4', top: '35%', left: '31%', phone: '055-511-142', personnel: 25 },
  { id: 3, name: 'สถานีควบคุมไฟป่าจังหวัดกาญจนบุรี', top: '61%', left: '32%', phone: '034-511-200', personnel: 30 },
  { id: 4, name: 'ศูนย์ป้องกันและบรรเทาสาธารณภัย เขต 10 ลำปาง', top: '28%', left: '38%', phone: '054-217-154', personnel: 60 },
];

export const windCondition = {
  directionText: 'ลมตะวันตกเฉียงใต้ (SW)',
  angle: 45, // องศาสำหรับการหมุนลูกศรใน UI
  speed: 18, // กม./ชม.
  forecast: 'คาดการณ์การลุกลามไปทางทิศตะวันออกเฉียงเหนือ (NE)',
};
export interface Equipment {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  specs: string[];
  specsEn: string[];
  image: string;
}

export const equipment: Equipment[] = [
  {
    id: "1",
    name: "Máy phát điện",
    nameEn: "Electric Power Generator",
    description: "Hệ thống máy phát điện công suất lớn, đảm bảo cung cấp điện liên tục cho công trường thi công.",
    descriptionEn: "High-capacity power generator ensuring continuous electricity supply at construction sites.",
    specs: ["Công suất: 100–500 kVA", "Nhiên liệu: Diesel", "Vận hành 24/7"],
    specsEn: ["Capacity: 100–500 kVA", "Fuel: Diesel", "24/7 operation"],
    image: "/images/thiet-bi/huu-thanh-co_132838412560830024.png",
  },
  {
    id: "2",
    name: "Tàu kéo, tàu chở xà lan",
    nameEn: "Tugboats and Barge-Carrying Ships",
    description: "Đội tàu kéo và tàu chở xà lan chuyên dụng phục vụ vận chuyển vật liệu và thiết bị trên sông, biển.",
    descriptionEn: "Specialized tugboats and barge-carrying vessels for transporting materials and equipment on rivers and sea.",
    specs: ["Công suất máy: 300–800 HP", "Tải trọng kéo: đến 2.000 tấn", "Hoạt động nội địa & ven biển"],
    specsEn: ["Engine power: 300–800 HP", "Towing capacity: up to 2,000 tons", "Inland & coastal operations"],
    image: "/images/thiet-bi/huu-thanh-co_132838567555803566.png",
  },
  {
    id: "3",
    name: "Xà lan, tàu thuyền",
    nameEn: "Barge and Vessels",
    description: "Đội xà lan và tàu thuyền đa dạng phục vụ vận chuyển hàng hóa, vật liệu xây dựng trên các tuyến đường thủy.",
    descriptionEn: "A diverse fleet of barges and vessels for transporting goods and construction materials on waterways.",
    specs: ["Tải trọng: 200–1.500 tấn", "Chiều dài: 30–65m", "Mớn nước: 1.2–2.5m"],
    specsEn: ["Capacity: 200–1,500 tons", "Length: 30–65m", "Draft: 1.2–2.5m"],
    image: "/images/thiet-bi/huu-thanh-co_132830556843160316.jpg",
  },
  {
    id: "4",
    name: "Cẩu",
    nameEn: "Crane",
    description: "Hệ thống cẩu nổi và cẩu bờ đa năng, phục vụ lắp đặt cấu kiện bê tông và thiết bị thi công nặng.",
    descriptionEn: "Versatile floating and shore cranes for installing concrete elements and heavy construction equipment.",
    specs: ["Sức nâng: 25–200 tấn", "Tầm với: 20–40m", "Cẩu nổi & cẩu bờ"],
    specsEn: ["Lifting capacity: 25–200 tons", "Reach: 20–40m", "Floating & shore cranes"],
    image: "/images/thiet-bi/huu-thanh-co_132830581726080671.jpg",
  },
  {
    id: "5",
    name: "Búa đóng cọc và búa rung",
    nameEn: "Pile and Vibrating Hammer",
    description: "Thiết bị búa đóng cọc thủy lực và búa rung chuyên dụng cho thi công nền móng công trình thủy.",
    descriptionEn: "Hydraulic pile hammers and vibrating hammers for hydraulic structure foundation construction.",
    specs: ["Lực đóng: 5–15 tấn", "Tần số rung: 25–40 Hz", "Phù hợp cọc thép & bê tông"],
    specsEn: ["Impact force: 5–15 tons", "Vibration frequency: 25–40 Hz", "Suitable for steel & concrete piles"],
    image: "/images/thiet-bi/huu-thanh-co_132836070932678251.png",
  },
  {
    id: "6",
    name: "Tàu nạo vét",
    nameEn: "Dredger",
    description: "Tàu hút bùn và nạo vét luồng lạch, đảm bảo chiều sâu thiết kế cho tuyến luồng hàng hải.",
    descriptionEn: "Suction dredgers for channel maintenance, ensuring designed navigational depths.",
    specs: ["Năng suất: 300–1.000 m³/h", "Độ sâu nạo vét: đến 15m", "Ống xả: 400–600mm"],
    specsEn: ["Output: 300–1,000 m³/h", "Dredging depth: up to 15m", "Discharge pipe: 400–600mm"],
    image: "/images/thiet-bi/huu-thanh-co_132838329400672110.jpg",
  },
  {
    id: "7",
    name: "Máy cắt tia nước",
    nameEn: "Water Jet Cutter",
    description: "Thiết bị cắt tia nước áp lực cao, sử dụng trong thi công cắt phá cấu kiện bê tông và thép dưới nước.",
    descriptionEn: "High-pressure water jet cutting equipment for cutting concrete and steel elements underwater.",
    specs: ["Áp suất: 3.000–6.000 bar", "Tốc độ cắt cao", "Ứng dụng dưới nước"],
    specsEn: ["Pressure: 3,000–6,000 bar", "High cutting speed", "Underwater applications"],
    image: "/images/thiet-bi/huu-thanh-co_132838356666623968.png",
  },
  {
    id: "8",
    name: "Máy đào",
    nameEn: "Excavator",
    description: "Máy đào gầu ngược phục vụ thi công đào đất, móng công trình, kênh mương và các hạng mục đào đắp.",
    descriptionEn: "Backhoe excavators for earthwork, foundation construction, canal digging and embankment works.",
    specs: ["Trọng lượng: 15–35 tấn", "Dung tích gầu: 0.8–1.5 m³", "Độ sâu đào: đến 7m"],
    specsEn: ["Operating weight: 15–35 tons", "Bucket capacity: 0.8–1.5 m³", "Dig depth: up to 7m"],
    image: "/images/thiet-bi/huu-thanh-co_132838440946308354.png",
  },
];

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
    name: "Sà lan vận chuyển",
    nameEn: "Transport Barge",
    description: "Phương tiện vận chuyển vật liệu xây dựng trên sông, kênh rạch với tải trọng lớn.",
    descriptionEn: "High-capacity vessel for transporting construction materials on rivers and canals.",
    specs: ["Tải trọng: 500-1500 tấn", "Chiều dài: 45-65m", "Mớn nước: 1.5-2.5m"],
    specsEn: ["Capacity: 500-1500 tons", "Length: 45-65m", "Draft: 1.5-2.5m"],
    // Red cargo barge on river
    image: "https://images.unsplash.com/photo-1713076224397-d91b162adb08?w=600&q=80",
  },
  {
    id: "2",
    name: "Cẩu nổi",
    nameEn: "Floating Crane",
    description: "Cẩu nổi đa năng phục vụ thi công trên mặt nước, lắp đặt cấu kiện bê tông đúc sẵn.",
    descriptionEn: "Multipurpose floating crane for marine construction and precast concrete installation.",
    specs: ["Sức nâng: 50-200 tấn", "Tầm với: 25-40m", "Chiều cao cột: 30m"],
    specsEn: ["Lifting capacity: 50-200 tons", "Reach: 25-40m", "Mast height: 30m"],
    // Crane mounted on a floating vessel/dock
    image: "https://images.unsplash.com/photo-1738438308871-01bed2e37ff7?w=600&q=80",
  },
  {
    id: "3",
    name: "Máy ép cọc thủy lực",
    nameEn: "Hydraulic Pile Press",
    description: "Hệ thống máy ép cọc bê tông cốt thép hiện đại, êm ái và chính xác cao.",
    descriptionEn: "Modern hydraulic system for quiet and precise reinforced concrete pile pressing.",
    specs: ["Lực ép: 200-600 tấn", "Độ sâu tối đa: 40m", "Tiết diện cọc: 30x30 - 50x50cm"],
    specsEn: ["Pressing force: 200-600 tons", "Max depth: 40m", "Pile section: 30x30 - 50x50cm"],
    // Construction crane — heavy lifting at site
    image: "https://images.unsplash.com/photo-1629132498063-b6cb11010a65?w=600&q=80",
  },
  {
    id: "4",
    name: "Tàu nạo vét",
    nameEn: "Dredger Vessel",
    description: "Tàu hút bùn và nạo vét luồng lạch, đảm bảo chiều sâu luồng tàu theo thiết kế.",
    descriptionEn: "Vessel for dredging channels and maintaining designed navigation depths.",
    specs: ["Năng suất: 500-1000 m³/h", "Độ sâu nạo vét: đến 15m", "Đường kính ống xả: 400-600mm"],
    specsEn: ["Productivity: 500-1000 m³/h", "Dredging depth: up to 15m", "Discharge pipe: 400-600mm"],
    // Actual dredger vessel operating at Teignmouth, UK
    image: "https://images.unsplash.com/photo-1614241885567-556499841aeb?w=600&q=80",
  },
  {
    id: "5",
    name: "Hệ thống GPS-RTK",
    nameEn: "GPS-RTK System",
    description: "Thiết bị định vị GPS độ chính xác cao, hỗ trợ thi công và kiểm tra chất lượng công trình.",
    descriptionEn: "High-precision GPS positioning system supporting construction and quality inspection.",
    specs: ["Độ chính xác: ±1cm", "Phủ sóng: toàn quốc", "Kết nối: GNSS đa tần"],
    specsEn: ["Accuracy: ±1cm", "Coverage: nationwide", "Connection: multi-frequency GNSS"],
    // Land surveying tripod in the field
    image: "https://images.unsplash.com/photo-1628158088936-68ccaaa400dc?w=600&q=80",
  },
  {
    id: "6",
    name: "Máy đào gầu ngược",
    nameEn: "Backhoe Excavator",
    description: "Máy đào phục vụ thi công móng công trình, kênh mương và các hạng mục đào đắp.",
    descriptionEn: "Excavator for foundation works, canals, and earthwork construction.",
    specs: ["Trọng lượng: 20-35 tấn", "Dung tích gầu: 0.8-1.5 m³", "Độ sâu đào: đến 6.5m"],
    specsEn: ["Weight: 20-35 tons", "Bucket capacity: 0.8-1.5 m³", "Digging depth: up to 6.5m"],
    // Yellow excavator on construction site
    image: "https://images.unsplash.com/photo-1583024011792-b165975b52f5?w=600&q=80",
  },
];

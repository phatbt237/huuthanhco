export interface Equipment {
  id: string;
  name: string;
  description: string;
  specs: string[];
  image: string;
}

export const equipment: Equipment[] = [
  {
    id: "1",
    name: "Sà lan vận chuyển",
    description: "Phương tiện vận chuyển vật liệu xây dựng trên sông, kênh rạch với tải trọng lớn.",
    specs: ["Tải trọng: 500-1500 tấn", "Chiều dài: 45-65m", "Mớn nước: 1.5-2.5m"],
    // Red cargo barge on river
    image: "https://images.unsplash.com/photo-1713076224397-d91b162adb08?w=600&q=80",
  },
  {
    id: "2",
    name: "Cẩu nổi",
    description: "Cẩu nổi đa năng phục vụ thi công trên mặt nước, lắp đặt cấu kiện bê tông đúc sẵn.",
    specs: ["Sức nâng: 50-200 tấn", "Tầm với: 25-40m", "Chiều cao cột: 30m"],
    // Crane mounted on a floating vessel/dock
    image: "https://images.unsplash.com/photo-1738438308871-01bed2e37ff7?w=600&q=80",
  },
  {
    id: "3",
    name: "Máy ép cọc thủy lực",
    description: "Hệ thống máy ép cọc bê tông cốt thép hiện đại, êm ái và chính xác cao.",
    specs: ["Lực ép: 200-600 tấn", "Độ sâu tối đa: 40m", "Tiết diện cọc: 30x30 - 50x50cm"],
    // Construction crane — heavy lifting at site
    image: "https://images.unsplash.com/photo-1629132498063-b6cb11010a65?w=600&q=80",
  },
  {
    id: "4",
    name: "Tàu nạo vét",
    description: "Tàu hút bùn và nạo vét luồng lạch, đảm bảo chiều sâu luồng tàu theo thiết kế.",
    specs: ["Năng suất: 500-1000 m³/h", "Độ sâu nạo vét: đến 15m", "Đường kính ống xả: 400-600mm"],
    // Actual dredger vessel operating at Teignmouth, UK
    image: "https://images.unsplash.com/photo-1614241885567-556499841aeb?w=600&q=80",
  },
  {
    id: "5",
    name: "Hệ thống GPS-RTK",
    description: "Thiết bị định vị GPS độ chính xác cao, hỗ trợ thi công và kiểm tra chất lượng công trình.",
    specs: ["Độ chính xác: ±1cm", "Phủ sóng: toàn quốc", "Kết nối: GNSS đa tần"],
    // Land surveying tripod in the field
    image: "https://images.unsplash.com/photo-1628158088936-68ccaaa400dc?w=600&q=80",
  },
  {
    id: "6",
    name: "Máy đào gầu ngược",
    description: "Máy đào phục vụ thi công móng công trình, kênh mương và các hạng mục đào đắp.",
    specs: ["Trọng lượng: 20-35 tấn", "Dung tích gầu: 0.8-1.5 m³", "Độ sâu đào: đến 6.5m"],
    // Yellow excavator on construction site
    image: "https://images.unsplash.com/photo-1583024011792-b165975b52f5?w=600&q=80",
  },
];

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  locationEn: string;
  year: number;
  category: string;
  categoryEn: string;
  image: string;
  description: string;
  descriptionEn: string;
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Cầu vượt sông Đồng Nai",
    nameEn: "Dong Nai River Overpass",
    location: "Đồng Nai",
    locationEn: "Dong Nai",
    year: 2024,
    category: "Cầu đường",
    categoryEn: "Roads & Bridges",
    // Bridge spanning a river
    image: "https://images.unsplash.com/photo-1608237963573-ba0790bc6404?w=800&q=80",
    description: "Thi công cầu vượt dài 1.2km qua sông Đồng Nai với tải trọng H30-XB80.",
    descriptionEn: "Construction of a 1.2 km river overpass across the Dong Nai River with H30-XB80 design load.",
  },
  {
    id: "2",
    name: "Kè bờ sông Sài Gòn",
    nameEn: "Saigon River Embankment",
    location: "TP. Hồ Chí Minh",
    locationEn: "Ho Chi Minh City",
    year: 2024,
    category: "Thủy lợi",
    categoryEn: "Hydraulic Works",
    // River with industrial barges — waterway construction context
    image: "https://images.unsplash.com/photo-1707681008672-b26aa30f18bc?w=800&q=80",
    description: "Gia cố bờ sông Sài Gòn đoạn qua quận Bình Thạnh, chiều dài 2.5km.",
    descriptionEn: "Reinforcement of a 2.5 km section of the Saigon River bank through Binh Thanh District.",
  },
  {
    id: "3",
    name: "Cảng tổng hợp Cái Mép",
    nameEn: "Cai Mep General Port",
    location: "Bà Rịa - Vũng Tàu",
    locationEn: "Ba Ria - Vung Tau",
    year: 2023,
    category: "Cảng biển",
    categoryEn: "Ports & Harbors",
    // Port cranes alongside a river — port construction
    image: "https://images.unsplash.com/photo-1716197755180-1a60c49cd260?w=800&q=80",
    description: "Thi công bến cảng tổng hợp Cái Mép giai đoạn 2, năng lực tiếp nhận tàu 50.000 DWT.",
    descriptionEn: "Phase 2 construction of Cai Mep general port with capacity for 50,000 DWT vessels.",
  },
  {
    id: "4",
    name: "Nạo vét luồng hàng hải Định An",
    nameEn: "Dinh An Navigation Channel Dredging",
    location: "Trà Vinh",
    locationEn: "Tra Vinh",
    year: 2023,
    category: "Nạo vét",
    categoryEn: "Dredging",
    // Actual dredger vessel operating at sea
    image: "https://images.unsplash.com/photo-1655366493773-d7d73e536c44?w=800&q=80",
    description: "Nạo vét, duy tu luồng hàng hải Định An - Cần Thơ chiều dài 130km.",
    descriptionEn: "Dredging and maintenance of the 130 km Dinh An - Can Tho navigation channel.",
  },
  {
    id: "5",
    name: "Cầu Phước Lộc",
    nameEn: "Phuoc Loc Bridge",
    location: "Long An",
    locationEn: "Long An",
    year: 2022,
    category: "Cầu đường",
    categoryEn: "Roads & Bridges",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    description: "Xây dựng cầu Phước Lộc bắc qua kênh thoát nước tỉnh Long An.",
    descriptionEn: "Construction of Phuoc Loc Bridge across a drainage canal in Long An Province.",
  },
  {
    id: "6",
    name: "Bến phà Cần Thơ",
    nameEn: "Can Tho Ferry Terminal",
    location: "Cần Thơ",
    locationEn: "Can Tho",
    year: 2022,
    category: "Cảng biển",
    categoryEn: "Ports & Harbors",
    image: "https://images.unsplash.com/photo-1598194501777-edbff942e501?w=800&q=80",
    description: "Cải tạo và mở rộng bến phà Cần Thơ phục vụ vận chuyển hàng hóa.",
    descriptionEn: "Renovation and expansion of Can Tho ferry terminal for cargo transportation.",
  },
  {
    id: "7",
    name: "Đê chắn sóng biển Đông",
    nameEn: "East Sea Breakwater",
    location: "Kiên Giang",
    locationEn: "Kien Giang",
    year: 2021,
    category: "Thủy lợi",
    categoryEn: "Hydraulic Works",
    image: "https://images.unsplash.com/photo-1484662020986-75935d2ebc66?w=800&q=80",
    description: "Xây dựng đê chắn sóng bảo vệ bờ biển tỉnh Kiên Giang.",
    descriptionEn: "Construction of a breakwater protecting the coastline of Kien Giang Province.",
  },
  {
    id: "8",
    name: "Kênh tưới tiêu đồng bằng sông Cửu Long",
    nameEn: "Mekong Delta Irrigation Canal",
    location: "An Giang",
    locationEn: "An Giang",
    year: 2020,
    category: "Thủy lợi",
    categoryEn: "Hydraulic Works",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    description: "Nạo vét và kiên cố hóa kênh tưới tiêu vùng đồng bằng sông Cửu Long.",
    descriptionEn: "Dredging and structural reinforcement of an irrigation canal in the Mekong Delta.",
  },
];

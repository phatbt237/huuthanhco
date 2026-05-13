export interface Project {
  id: string;
  name: string;
  location: string;
  year: number;
  category: string;
  image: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Cầu vượt sông Đồng Nai",
    location: "Đồng Nai",
    year: 2024,
    category: "Cầu đường",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    description: "Thi công cầu vượt dài 1.2km qua sông Đồng Nai với tải trọng H30-XB80.",
  },
  {
    id: "2",
    name: "Kè bờ sông Sài Gòn",
    location: "TP. Hồ Chí Minh",
    year: 2024,
    category: "Thủy lợi",
    image: "https://images.unsplash.com/photo-1707681008672-b26aa30f18bc?w=800&q=80",
    description: "Gia cố bờ sông Sài Gòn đoạn qua quận Bình Thạnh, chiều dài 2.5km.",
  },
  {
    id: "3",
    name: "Cảng tổng hợp Cái Mép",
    location: "Bà Rịa - Vũng Tàu",
    year: 2023,
    category: "Cảng biển",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    description: "Thi công bến cảng tổng hợp Cái Mép giai đoạn 2, năng lực tiếp nhận tàu 50.000 DWT.",
  },
  {
    id: "4",
    name: "Nạo vét luồng hàng hải Định An",
    location: "Trà Vinh",
    year: 2023,
    category: "Nạo vét",
    image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&q=80",
    description: "Nạo vét, duy tu luồng hàng hải Định An - Cần Thơ chiều dài 130km.",
  },
  {
    id: "5",
    name: "Cầu Phước Lộc",
    location: "Long An",
    year: 2022,
    category: "Cầu đường",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    description: "Xây dựng cầu Phước Lộc bắc qua kênh thoát nước tỉnh Long An.",
  },
  {
    id: "6",
    name: "Bến phà Cần Thơ",
    location: "Cần Thơ",
    year: 2022,
    category: "Cảng biển",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    description: "Cải tạo và mở rộng bến phà Cần Thơ phục vụ vận chuyển hàng hóa.",
  },
  {
    id: "7",
    name: "Đê chắn sóng biển Đông",
    location: "Kiên Giang",
    year: 2021,
    category: "Thủy lợi",
    image: "https://images.unsplash.com/photo-1484662020986-75935d2ebc66?w=800&q=80",
    description: "Xây dựng đê chắn sóng bảo vệ bờ biển tỉnh Kiên Giang.",
  },
  {
    id: "8",
    name: "Kênh tưới tiêu đồng bằng sông Cửu Long",
    location: "An Giang",
    year: 2020,
    category: "Thủy lợi",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    description: "Nạo vét và kiên cố hóa kênh tưới tiêu vùng đồng bằng sông Cửu Long.",
  },
];

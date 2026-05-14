export interface Service {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  description: string;
  descriptionEn: string;
}

export const services: Service[] = [
  {
    id: "1",
    name: "Các dự án cảng biển và hàng hải",
    nameEn: "Typical Marine and Seaport Projects",
    image: "/images/dich-vu/huu-thanh-co_132828830902135317.jpg",
    description: "Thi công các công trình cảng biển và hàng hải tiêu biểu, đảm bảo năng lực tiếp nhận tàu trọng tải lớn.",
    descriptionEn: "Construction of typical marine and seaport works, ensuring capacity to receive large tonnage vessels.",
  },
  {
    id: "2",
    name: "Các dự án cảng biển và cảng nội địa",
    nameEn: "Seaport and Domestic Port Projects",
    image: "/images/dich-vu/huu-thanh-co_132827112923592765.jpg",
    description: "Xây dựng và nâng cấp hệ thống cảng biển, cảng nội địa phục vụ vận tải hàng hóa.",
    descriptionEn: "Construction and upgrading of seaport and domestic port systems for cargo transport.",
  },
  {
    id: "3",
    name: "Công trình kè bảo vệ bờ và thủy lợi",
    nameEn: "Embankment Protection and Irrigation Works",
    image: "/images/dich-vu/huu-thanh-co_132827128204812662.jpg",
    description: "Thi công kè bảo vệ bờ sông, bờ biển và các công trình thủy lợi phục vụ sản xuất nông nghiệp.",
    descriptionEn: "Construction of riverbank and coastal protection embankments and irrigation works for agricultural production.",
  },
  {
    id: "4",
    name: "Công trình nạo vét",
    nameEn: "Dredging Works",
    image: "/images/dich-vu/huu-thanh-co_132827151269376315.jpg",
    description: "Nạo vét duy tu luồng hàng hải, kênh rạch đảm bảo độ sâu thiết kế cho tàu thuyền lưu thông.",
    descriptionEn: "Dredging and maintenance of maritime channels and canals to ensure designed depths for vessel navigation.",
  },
  {
    id: "5",
    name: "Các công trình kỹ thuật và hạ tầng khác",
    nameEn: "Other Technical and Infrastructural Construction Projects",
    image: "/images/dich-vu/huu-thanh-co_132827138869510062.jpg",
    description: "Thi công đa dạng các công trình kỹ thuật, hạ tầng giao thông và dân dụng trên khắp miền Nam.",
    descriptionEn: "Construction of diverse technical, transportation infrastructure and civil works across Southern Vietnam.",
  },
  {
    id: "6",
    name: "Dịch vụ kinh doanh, cho thuê máy móc thiết bị thi công",
    nameEn: "Trading and Leasing of Construction Machinery and Equipment",
    image: "/images/dich-vu/huu-thanh-co_132827296938557494.png",
    description: "Cung cấp dịch vụ kinh doanh và cho thuê máy móc, thiết bị thi công chuyên dụng cho các đơn vị xây dựng.",
    descriptionEn: "Providing trading and leasing services for specialized construction machinery and equipment to construction companies.",
  },
];

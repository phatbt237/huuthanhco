export interface Job {
  id: string;
  title: string;
  titleEn: string;
  location: string;
  type: string;
  typeEn: string;
  salary: string;
  description: string;
  descriptionEn: string;
  requirements: string[];
  requirementsEn: string[];
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Kỹ sư công trình thủy lợi",
    titleEn: "Hydraulic Engineer",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    typeEn: "Full-time",
    salary: "15 - 25 triệu",
    description: "Chịu trách nhiệm thiết kế, giám sát và nghiệm thu các công trình thủy lợi, cảng biển và kè sông.",
    descriptionEn: "Responsible for designing, supervising, and inspecting hydraulic structures, ports, and river embankments.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Xây dựng thủy lợi, Kỹ thuật công trình",
      "Có ít nhất 3 năm kinh nghiệm trong lĩnh vực xây dựng thủy lợi",
      "Thành thạo AutoCAD, Revit và các phần mềm kỹ thuật",
      "Có chứng chỉ hành nghề thiết kế là lợi thế",
    ],
    requirementsEn: [
      "Bachelor's degree in Hydraulic Engineering or Civil Engineering",
      "At least 3 years of experience in hydraulic construction",
      "Proficient in AutoCAD, Revit, and technical software",
      "Professional design license is a plus",
    ],
  },
  {
    id: "2",
    title: "Giám sát thi công",
    titleEn: "Site Supervisor",
    location: "Đồng Nai / Long An",
    type: "Toàn thời gian",
    typeEn: "Full-time",
    salary: "12 - 20 triệu",
    description: "Giám sát tiến độ và chất lượng thi công tại công trường, đảm bảo đúng bản vẽ thiết kế và tiêu chuẩn kỹ thuật.",
    descriptionEn: "Supervise construction progress and quality on-site, ensuring compliance with design drawings and technical standards.",
    requirements: [
      "Tốt nghiệp Cao đẳng/Đại học ngành Xây dựng",
      "Có ít nhất 2 năm kinh nghiệm giám sát công trình",
      "Chấp nhận đi công tác tại các tỉnh thành",
      "Có chứng chỉ giám sát thi công xây dựng",
    ],
    requirementsEn: [
      "College or university degree in Construction",
      "At least 2 years of site supervision experience",
      "Willing to travel to project sites in various provinces",
      "Construction supervision certificate required",
    ],
  },
  {
    id: "3",
    title: "Thuyền trưởng / Điều phối phương tiện thủy",
    titleEn: "Captain / Marine Vessel Coordinator",
    location: "Miền Nam",
    type: "Toàn thời gian",
    typeEn: "Full-time",
    salary: "18 - 30 triệu",
    description: "Vận hành và điều phối đội tàu thủy phục vụ thi công công trình thủy, đảm bảo an toàn và hiệu quả.",
    descriptionEn: "Operate and coordinate the marine fleet for hydraulic construction projects, ensuring safety and efficiency.",
    requirements: [
      "Có bằng thuyền trưởng hạng III trở lên",
      "Ít nhất 5 năm kinh nghiệm điều khiển tàu thủy",
      "Thành thạo tuyến đường thủy nội địa và ven biển miền Nam",
      "Am hiểu quy định hàng hải Việt Nam",
    ],
    requirementsEn: [
      "Class III captain's license or higher",
      "At least 5 years of vessel operation experience",
      "Familiar with inland and coastal waterways in Southern Vietnam",
      "Knowledge of Vietnamese maritime regulations",
    ],
  },
  {
    id: "4",
    title: "Kế toán công trình",
    titleEn: "Construction Accountant",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    typeEn: "Full-time",
    salary: "10 - 15 triệu",
    description: "Theo dõi và quản lý chi phí công trình, lập báo cáo tài chính định kỳ cho Ban Giám đốc.",
    descriptionEn: "Track and manage project costs, prepare periodic financial reports for the Board of Directors.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Kế toán, Tài chính",
      "Có ít nhất 2 năm kinh nghiệm kế toán trong lĩnh vực xây dựng",
      "Thành thạo Excel, phần mềm kế toán Misa/Fast",
      "Cẩn thận, trung thực, chịu được áp lực công việc",
    ],
    requirementsEn: [
      "Bachelor's degree in Accounting or Finance",
      "At least 2 years of accounting experience in construction",
      "Proficient in Excel and accounting software (Misa/Fast)",
      "Detail-oriented, honest, and able to work under pressure",
    ],
  },
];

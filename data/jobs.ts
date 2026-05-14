export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Kỹ sư công trình thủy lợi",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    salary: "15 - 25 triệu",
    description: "Chịu trách nhiệm thiết kế, giám sát và nghiệm thu các công trình thủy lợi, cảng biển và kè sông.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Xây dựng thủy lợi, Kỹ thuật công trình",
      "Có ít nhất 3 năm kinh nghiệm trong lĩnh vực xây dựng thủy lợi",
      "Thành thạo AutoCAD, Revit và các phần mềm kỹ thuật",
      "Có chứng chỉ hành nghề thiết kế là lợi thế",
    ],
  },
  {
    id: "2",
    title: "Giám sát thi công",
    location: "Đồng Nai / Long An",
    type: "Toàn thời gian",
    salary: "12 - 20 triệu",
    description: "Giám sát tiến độ và chất lượng thi công tại công trường, đảm bảo đúng bản vẽ thiết kế và tiêu chuẩn kỹ thuật.",
    requirements: [
      "Tốt nghiệp Cao đẳng/Đại học ngành Xây dựng",
      "Có ít nhất 2 năm kinh nghiệm giám sát công trình",
      "Chấp nhận đi công tác tại các tỉnh thành",
      "Có chứng chỉ giám sát thi công xây dựng",
    ],
  },
  {
    id: "3",
    title: "Thuyền trưởng / Điều phối phương tiện thủy",
    location: "Miền Nam",
    type: "Toàn thời gian",
    salary: "18 - 30 triệu",
    description: "Vận hành và điều phối đội tàu thủy phục vụ thi công công trình thủy, đảm bảo an toàn và hiệu quả.",
    requirements: [
      "Có bằng thuyền trưởng hạng III trở lên",
      "Ít nhất 5 năm kinh nghiệm điều khiển tàu thủy",
      "Thành thạo tuyến đường thủy nội địa và ven biển miền Nam",
      "Am hiểu quy định hàng hải Việt Nam",
    ],
  },
  {
    id: "4",
    title: "Kế toán công trình",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    salary: "10 - 15 triệu",
    description: "Theo dõi và quản lý chi phí công trình, lập báo cáo tài chính định kỳ cho Ban Giám đốc.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Kế toán, Tài chính",
      "Có ít nhất 2 năm kinh nghiệm kế toán trong lĩnh vực xây dựng",
      "Thành thạo Excel, phần mềm kế toán Misa/Fast",
      "Cẩn thận, trung thực, chịu được áp lực công việc",
    ],
  },
];

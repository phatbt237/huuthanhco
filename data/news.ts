export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  thumbnail: string;
  excerpt: string;
  content: string;
}

export const news: NewsItem[] = [
  {
    id: "1",
    title: "Hữu Thành hoàn thành thi công cầu vượt sông Đồng Nai trước tiến độ 2 tháng",
    slug: "huu-thanh-hoan-thanh-cau-vuot-song-dong-nai",
    date: "2024-11-15",
    category: "Tin tức",
    thumbnail: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80",
    excerpt: "Công ty Hữu Thành vừa hoàn thành thi công cầu vượt sông Đồng Nai trước tiến độ 2 tháng, đảm bảo chất lượng vượt yêu cầu kỹ thuật.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "2",
    title: "Hữu Thành nhận giải thưởng Nhà thầu uy tín năm 2024",
    slug: "huu-thanh-nhan-giai-thuong-nha-thau-uy-tin-2024",
    date: "2024-10-20",
    category: "Giải thưởng",
    thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    excerpt: "Tại lễ trao giải thưởng xây dựng Việt Nam năm 2024, Hữu Thành vinh dự nhận danh hiệu Nhà thầu uy tín toàn quốc.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "3",
    title: "Khởi công dự án nạo vét luồng hàng hải Định An giai đoạn 2",
    slug: "khoi-cong-nao-vet-luong-hang-hai-dinh-an-giai-doan-2",
    date: "2024-09-05",
    category: "Dự án",
    thumbnail: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80",
    excerpt: "Ngày 5/9/2024, Công ty Hữu Thành chính thức khởi công giai đoạn 2 dự án nạo vét luồng hàng hải Định An - Cần Thơ.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "4",
    title: "Hội thảo kỹ thuật: Ứng dụng công nghệ GPS-RTK trong thi công thủy công",
    slug: "hoi-thao-gps-rtk-trong-thi-cong-thuy-cong",
    date: "2024-08-15",
    category: "Kỹ thuật",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    excerpt: "Công ty tổ chức hội thảo nội bộ về ứng dụng công nghệ GPS-RTK trong thi công thủy công, nâng cao chất lượng và độ chính xác.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "5",
    title: "Hữu Thành mở rộng đội tàu nạo vét với 3 phương tiện mới",
    slug: "huu-thanh-mo-rong-doi-tau-nao-vet",
    date: "2024-07-10",
    category: "Thiết bị",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    excerpt: "Nhằm đáp ứng nhu cầu ngày càng tăng, Hữu Thành đầu tư thêm 3 tàu nạo vét hiện đại, nâng tổng số phương tiện thủy lên 15 chiếc.",
    content: "Chi tiết bài viết...",
  },
];

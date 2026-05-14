export interface NewsItem {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  date: string;
  category: string;
  categoryEn: string;
  thumbnail: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
}

export const news: NewsItem[] = [
  {
    id: "1",
    title: "Hữu Thành hoàn thành thi công cầu vượt sông Đồng Nai trước tiến độ 2 tháng",
    titleEn: "Huu Thanh completes Dong Nai River overpass two months ahead of schedule",
    slug: "huu-thanh-hoan-thanh-cau-vuot-song-dong-nai",
    date: "2024-11-15",
    category: "Tin tức",
    categoryEn: "News",
    thumbnail: "https://images.unsplash.com/photo-1608237963573-ba0790bc6404?w=600&q=80",
    excerpt: "Công ty Hữu Thành vừa hoàn thành thi công cầu vượt sông Đồng Nai trước tiến độ 2 tháng, đảm bảo chất lượng vượt yêu cầu kỹ thuật.",
    excerptEn: "Huu Thanh has completed the Dong Nai River overpass two months ahead of schedule while meeting technical quality requirements.",
    content: "Chi tiết bài viết...",
    contentEn: "Article details...",
  },
  {
    id: "2",
    title: "Hữu Thành nhận giải thưởng Nhà thầu uy tín năm 2024",
    titleEn: "Huu Thanh receives Trusted Contractor Award 2024",
    slug: "huu-thanh-nhan-giai-thuong-nha-thau-uy-tin-2024",
    date: "2024-10-20",
    category: "Giải thưởng",
    categoryEn: "Awards",
    thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    excerpt: "Tại lễ trao giải thưởng xây dựng Việt Nam năm 2024, Hữu Thành vinh dự nhận danh hiệu Nhà thầu uy tín toàn quốc.",
    excerptEn: "At the 2024 Vietnam Construction Awards, Huu Thanh was honored as a trusted national contractor.",
    content: "Chi tiết bài viết...",
    contentEn: "Article details...",
  },
  {
    id: "3",
    title: "Khởi công dự án nạo vét luồng hàng hải Định An giai đoạn 2",
    titleEn: "Phase 2 of Dinh An navigation channel dredging project starts",
    slug: "khoi-cong-nao-vet-luong-hang-hai-dinh-an-giai-doan-2",
    date: "2024-09-05",
    category: "Dự án",
    categoryEn: "Projects",
    thumbnail: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80",
    excerpt: "Ngày 5/9/2024, Công ty Hữu Thành chính thức khởi công giai đoạn 2 dự án nạo vét luồng hàng hải Định An - Cần Thơ.",
    excerptEn: "On September 5, 2024, Huu Thanh officially started Phase 2 of the Dinh An - Can Tho navigation channel dredging project.",
    content: "Chi tiết bài viết...",
    contentEn: "Article details...",
  },
  {
    id: "4",
    title: "Hội thảo kỹ thuật: Ứng dụng công nghệ GPS-RTK trong thi công thủy công",
    titleEn: "Technical workshop: Applying GPS-RTK technology in hydraulic construction",
    slug: "hoi-thao-gps-rtk-trong-thi-cong-thuy-cong",
    date: "2024-08-15",
    category: "Kỹ thuật",
    categoryEn: "Technical",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    excerpt: "Công ty tổ chức hội thảo nội bộ về ứng dụng công nghệ GPS-RTK trong thi công thủy công, nâng cao chất lượng và độ chính xác.",
    excerptEn: "The company held an internal workshop on applying GPS-RTK technology to improve quality and accuracy in hydraulic construction.",
    content: "Chi tiết bài viết...",
    contentEn: "Article details...",
  },
  {
    id: "5",
    title: "Hữu Thành mở rộng đội tàu nạo vét với 3 phương tiện mới",
    titleEn: "Huu Thanh expands dredging fleet with three new vessels",
    slug: "huu-thanh-mo-rong-doi-tau-nao-vet",
    date: "2024-07-10",
    category: "Thiết bị",
    categoryEn: "Equipment",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    excerpt: "Nhằm đáp ứng nhu cầu ngày càng tăng, Hữu Thành đầu tư thêm 3 tàu nạo vét hiện đại, nâng tổng số phương tiện thủy lên 15 chiếc.",
    excerptEn: "To meet growing demand, Huu Thanh invested in three modern dredging vessels, bringing its marine fleet to 15 units.",
    content: "Chi tiết bài viết...",
    contentEn: "Article details...",
  },
];

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
}

export const news: NewsItem[] = [
  {
    id: "1",
    title: "Hữu Thành hoàn thành thi công cầu vượt sông Đồng Nai trước tiến độ 2 tháng",
    titleEn: "Huu Thanh completes Dong Nai River Bridge 2 months ahead of schedule",
    slug: "huu-thanh-hoan-thanh-cau-vuot-song-dong-nai",
    date: "2024-11-15",
    category: "Tin tức",
    categoryEn: "News",
    thumbnail: "/images/du-an/huu-thanh-co_132828180671236856.jpg",
    excerpt: "Công ty Hữu Thành vừa hoàn thành thi công cầu vượt sông Đồng Nai trước tiến độ 2 tháng, đảm bảo chất lượng vượt yêu cầu kỹ thuật.",
    excerptEn: "Huu Thanh Co. has completed the Dong Nai River overpass bridge 2 months ahead of schedule, meeting and exceeding all technical quality requirements.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "2",
    title: "Hữu Thành nhận giải thưởng Nhà thầu uy tín năm 2024",
    titleEn: "Huu Thanh receives Reputable Contractor Award 2024",
    slug: "huu-thanh-nhan-giai-thuong-nha-thau-uy-tin-2024",
    date: "2024-10-20",
    category: "Giải thưởng",
    categoryEn: "Awards",
    thumbnail: "/images/du-an/huu-thanh-co_132827983464005202.jpg",
    excerpt: "Tại lễ trao giải thưởng xây dựng Việt Nam năm 2024, Hữu Thành vinh dự nhận danh hiệu Nhà thầu uy tín toàn quốc.",
    excerptEn: "At the 2024 Vietnam Construction Awards ceremony, Huu Thanh was honored with the title of National Reputable Contractor.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "3",
    title: "Khởi công dự án nạo vét luồng hàng hải Định An giai đoạn 2",
    titleEn: "Groundbreaking of Dinh An Maritime Channel Dredging Phase 2",
    slug: "khoi-cong-nao-vet-luong-hang-hai-dinh-an-giai-doan-2",
    date: "2024-09-05",
    category: "Dự án",
    categoryEn: "Projects",
    thumbnail: "/images/du-an/huu-thanh-co_132828922419342655.jpg",
    excerpt: "Ngày 5/9/2024, Công ty Hữu Thành chính thức khởi công giai đoạn 2 dự án nạo vét luồng hàng hải Định An - Cần Thơ.",
    excerptEn: "On September 5, 2024, Huu Thanh Co. officially broke ground on Phase 2 of the Dinh An – Can Tho maritime channel dredging project.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "4",
    title: "Hội thảo kỹ thuật: Ứng dụng công nghệ GPS-RTK trong thi công thủy công",
    titleEn: "Technical Seminar: GPS-RTK Technology in Hydraulic Construction",
    slug: "hoi-thao-gps-rtk-trong-thi-cong-thuy-cong",
    date: "2024-08-15",
    category: "Kỹ thuật",
    categoryEn: "Technical",
    thumbnail: "/images/du-an/huu-thanh-co_132828238384876503.jpg",
    excerpt: "Công ty tổ chức hội thảo nội bộ về ứng dụng công nghệ GPS-RTK trong thi công thủy công, nâng cao chất lượng và độ chính xác.",
    excerptEn: "The company held an internal seminar on applying GPS-RTK technology in hydraulic construction to improve quality and precision.",
    content: "Chi tiết bài viết...",
  },
  {
    id: "5",
    title: "Hữu Thành mở rộng đội tàu nạo vét với 3 phương tiện mới",
    titleEn: "Huu Thanh expands dredging fleet with 3 new vessels",
    slug: "huu-thanh-mo-rong-doi-tau-nao-vet",
    date: "2024-07-10",
    category: "Thiết bị",
    categoryEn: "Equipment",
    thumbnail: "/images/thiet-bi/huu-thanh-co_132830581726080671.jpg",
    excerpt: "Nhằm đáp ứng nhu cầu ngày càng tăng, Hữu Thành đầu tư thêm 3 tàu nạo vét hiện đại, nâng tổng số phương tiện thủy lên 15 chiếc.",
    excerptEn: "To meet growing demand, Huu Thanh invested in 3 modern dredgers, bringing the total watercraft fleet to 15 vessels.",
    content: "Chi tiết bài viết...",
  },
];

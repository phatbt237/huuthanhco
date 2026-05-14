import { equipment } from "@/data/equipment";
import { news } from "@/data/news";
import { projects } from "@/data/projects";
import { normalizeSearchText } from "@/lib/utils";

export type Lang = "vi" | "en";

export type SearchItem = {
  title: string;
  category: string;
  href: string;
  excerpt: string;
  keywords: string;
};

type RawSearchItem = {
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  href: string;
  excerpt: string;
  excerptEn: string;
  keywords: string;
  keywordsEn: string;
};

const projectSlugMap: Record<string, string> = {
  "Cầu đường": "cau-duong",
  "Cảng biển": "cang-bien",
  "Thủy lợi": "thuy-loi",
  "Nạo vét": "nao-vet",
};

const rawSearchItems: RawSearchItem[] = [
  {
    title: "Trang chủ",
    titleEn: "Home",
    category: "Trang",
    categoryEn: "Page",
    href: "/",
    excerpt: "Tổng quan về Công Ty Cổ phần Xây Dựng Hữu Thành.",
    excerptEn: "Overview of Huu Thanh Construction Joint Stock Company.",
    keywords: "home trang chu huu thanh construction",
    keywordsEn: "home overview huu thanh construction",
  },
  {
    title: "Giới thiệu",
    titleEn: "About",
    category: "Trang",
    categoryEn: "Page",
    href: "/gioi-thieu",
    excerpt: "Thông tin công ty, sứ mệnh, tầm nhìn, lịch sử và năng lực thi công.",
    excerptEn: "Company information, mission, vision, history and construction capability.",
    keywords: "gioi thieu cong ty su menh tam nhin lich su tong quan",
    keywordsEn: "about company mission vision history overview",
  },
  {
    title: "Sơ đồ tổ chức",
    titleEn: "Organization Chart",
    category: "Giới thiệu",
    categoryEn: "About",
    href: "/gioi-thieu#so-do-to-chuc",
    excerpt: "Cơ cấu tổ chức Công ty Cổ phần Xây Dựng Hữu Thành.",
    excerptEn: "Organization structure of Huu Thanh Construction Joint Stock Company.",
    keywords: "so do to chuc co cau hoi dong quan tri ban tong giam doc",
    keywordsEn: "organization chart structure board management general director",
  },
  {
    title: "Hồ sơ năng lực",
    titleEn: "Company Profile",
    category: "Giới thiệu",
    categoryEn: "About",
    href: "/gioi-thieu#ho-so-nang-luc",
    excerpt: "Tải và xem hồ sơ năng lực Hữu Thành 2026.",
    excerptEn: "Download and view the Huu Thanh 2026 company profile.",
    keywords: "ho so nang luc profile pdf tai ve",
    keywordsEn: "company profile capability profile pdf download",
  },
  {
    title: "Khách hàng & Đối tác",
    titleEn: "Clients & Partners",
    category: "Trang chủ",
    categoryEn: "Home",
    href: "/#khach-hang-doi-tac",
    excerpt: "Danh sách khách hàng và đối tác tiêu biểu của Hữu Thành.",
    excerptEn: "Featured clients and partners of Huu Thanh.",
    keywords: "khach hang doi tac phan vu vina kyoei tvp sowatco hoa phat fico",
    keywordsEn: "clients partners phan vu vina kyoei tvp sowatco hoa phat fico",
  },
  {
    title: "Dự án tiêu biểu",
    titleEn: "Featured Projects",
    category: "Trang",
    categoryEn: "Page",
    href: "/du-an",
    excerpt: "Danh sách các dự án thi công của Hữu Thành.",
    excerptEn: "Huu Thanh project portfolio.",
    keywords: "du an cong trinh cau duong cang bien thuy loi nao vet",
    keywordsEn: "projects construction roads bridges ports hydraulic dredging",
  },
  {
    title: "Thiết bị thi công",
    titleEn: "Construction Equipment",
    category: "Trang",
    categoryEn: "Page",
    href: "/thiet-bi",
    excerpt: "Hệ thống thiết bị, máy móc và phương tiện thi công.",
    excerptEn: "Construction equipment, machinery and vehicle fleet.",
    keywords: "thiet bi may moc phuong tien cau noi sa lan tau nao vet",
    keywordsEn: "equipment machinery fleet floating crane barge dredger",
  },
  {
    title: "Tin tức",
    titleEn: "News",
    category: "Trang",
    categoryEn: "Page",
    href: "/tin-tuc",
    excerpt: "Tin tức, sự kiện và cập nhật dự án mới nhất.",
    excerptEn: "Latest news, events and project updates.",
    keywords: "tin tuc su kien cap nhat giai thuong ky thuat",
    keywordsEn: "news events updates awards technical",
  },
  {
    title: "Tuyển dụng",
    titleEn: "Careers",
    category: "Trang",
    categoryEn: "Page",
    href: "/tuyen-dung",
    excerpt: "Cơ hội nghề nghiệp tại Hữu Thành.",
    excerptEn: "Career opportunities at Huu Thanh.",
    keywords: "tuyen dung viec lam nhan su ky su cong truong",
    keywordsEn: "careers jobs recruitment engineer construction site",
  },
  {
    title: "Liên hệ",
    titleEn: "Contact",
    category: "Trang",
    categoryEn: "Page",
    href: "/lien-he",
    excerpt: "Thông tin liên hệ, hotline, email và form tư vấn.",
    excerptEn: "Contact information, hotline, email and consultation form.",
    keywords: "lien he hotline email dia chi tu van",
    keywordsEn: "contact hotline email address consultation",
  },
  ...projects.map((project) => ({
    title: project.name,
    titleEn: project.nameEn,
    category: "Dự án",
    categoryEn: "Project",
    href: `/du-an?loai=${projectSlugMap[project.category] ?? ""}`,
    excerpt: `${project.category} tại ${project.location}. ${project.description}`,
    excerptEn: `${project.categoryEn} in ${project.locationEn}. ${project.descriptionEn}`,
    keywords: `${project.name} ${project.category} ${project.location} ${project.year} ${project.description}`,
    keywordsEn: `${project.nameEn} ${project.categoryEn} ${project.locationEn} ${project.year} ${project.descriptionEn}`,
  })),
  ...equipment.map((item) => ({
    title: item.name,
    titleEn: item.nameEn,
    category: "Thiết bị",
    categoryEn: "Equipment",
    href: `/thiet-bi#thiet-bi-${item.id}`,
    excerpt: item.description,
    excerptEn: item.descriptionEn,
    keywords: `${item.name} ${item.description} ${item.specs.join(" ")}`,
    keywordsEn: `${item.nameEn} ${item.descriptionEn} ${item.specsEn.join(" ")}`,
  })),
  ...news.map((item) => ({
    title: item.title,
    titleEn: item.titleEn,
    category: item.category,
    categoryEn: item.categoryEn,
    href: "/tin-tuc",
    excerpt: item.excerpt,
    excerptEn: item.excerptEn,
    keywords: `${item.title} ${item.category} ${item.excerpt}`,
    keywordsEn: `${item.titleEn} ${item.categoryEn} ${item.excerptEn}`,
  })),
];

function localizeItem(item: RawSearchItem, lang: Lang): SearchItem {
  return {
    title: lang === "vi" ? item.title : item.titleEn,
    category: lang === "vi" ? item.category : item.categoryEn,
    href: item.href,
    excerpt: lang === "vi" ? item.excerpt : item.excerptEn,
    keywords: `${item.keywords} ${item.keywordsEn}`,
  };
}

export function searchSite(query: string, lang: Lang): SearchItem[] {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return [];

  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  return rawSearchItems
    .map((rawItem) => {
      const item = localizeItem(rawItem, lang);
      const haystack = normalizeSearchText(
        `${rawItem.title} ${rawItem.titleEn} ${rawItem.category} ${rawItem.categoryEn} ${rawItem.excerpt} ${rawItem.excerptEn} ${rawItem.keywords} ${rawItem.keywordsEn}`
      );
      const localizedTitle = normalizeSearchText(item.title);
      const localizedCategory = normalizeSearchText(item.category);
      const score = words.reduce((total, word) => {
        if (localizedTitle.includes(word)) return total + 4;
        if (localizedCategory.includes(word)) return total + 2;
        if (haystack.includes(word)) return total + 1;
        return total;
      }, 0);

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}

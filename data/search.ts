import { equipment } from "@/data/equipment";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import { getProjectDetailHref } from "@/lib/projects";
import { legacyContentFallbackEnabled } from "@/lib/siteApi";
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
  "Công trình giao thông hàng hải": "giao-thong-hang-hai",
  "Công trình hạ tầng kỹ thuật": "ha-tang-ky-thuat",
};

const baseRawSearchItems: RawSearchItem[] = [
  {
    title: "Trang chủ",
    titleEn: "Home",
    category: "Trang",
    categoryEn: "Page",
    href: "/",
    excerpt: "Tổng quan website Công Ty Cổ phần Xây Dựng Hữu Thành.",
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
    excerpt: "Thông tin công ty, sứ mệnh, tầm nhìn và năng lực thi công.",
    excerptEn: "Company information, mission, vision and construction capability.",
    keywords: "gioi thieu cong ty su menh tam nhin lich su tong quan",
    keywordsEn: "about company mission vision history overview",
  },
  {
    title: "Dự án",
    titleEn: "Projects",
    category: "Trang",
    categoryEn: "Page",
    href: "/du-an",
    excerpt: "Danh sách dự án thuộc công trình giao thông hàng hải và công trình hạ tầng kỹ thuật.",
    excerptEn: "Project portfolio covering marine transportation works and technical infrastructure works.",
    keywords: "du an cong trinh cau duong cang bien thuy loi nao vet ha tang",
    keywordsEn: "projects construction roads bridges seaport infrastructure hydraulic dredging",
  },
  {
    title: "Thiết bị",
    titleEn: "Equipment",
    category: "Trang",
    categoryEn: "Page",
    href: "/thiet-bi",
    excerpt: "Hệ thống thiết bị, máy móc và phương tiện thi công.",
    excerptEn: "Construction equipment, machinery and vessel fleet.",
    keywords: "thiet bi may moc phuong tien tau keo xa lan cau nao vet may dao",
    keywordsEn: "equipment machinery fleet tugboat barge crane dredger excavator",
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
];

function projectToSearchItem(project: Project): RawSearchItem {
  return {
    title: project.name,
    titleEn: project.nameEn,
    category: "Dự án",
    categoryEn: "Project",
    href: getProjectDetailHref(project),
    excerpt: `${project.category} tại ${project.location}. ${project.description}`,
    excerptEn: `${project.categoryEn} in ${project.location}. ${project.descriptionEn}`,
    keywords: `${project.name} ${project.category} ${project.location} ${project.year} ${project.description}`,
    keywordsEn: `${project.nameEn} ${project.categoryEn} ${project.location} ${project.year} ${project.descriptionEn}`,
  };
}

function equipmentToSearchItem(item: (typeof equipment)[number]): RawSearchItem {
  return {
    title: item.name,
    titleEn: item.nameEn,
    category: "Thiết bị",
    categoryEn: "Equipment",
    href: `/thiet-bi#thiet-bi-${item.id}`,
    excerpt: item.description,
    excerptEn: item.descriptionEn,
    keywords: `${item.name} ${item.description} ${item.specs.join(" ")}`,
    keywordsEn: `${item.nameEn} ${item.descriptionEn} ${item.specsEn.join(" ")}`,
  };
}

function newsToSearchItem(item: NewsItem): RawSearchItem {
  return {
    title: item.title,
    titleEn: item.titleEn,
    category: item.category,
    categoryEn: item.categoryEn,
    href: `/tin-tuc#tin-tuc-${item.id}`,
    excerpt: item.excerpt,
    excerptEn: item.excerptEn,
    keywords: `${item.title} ${item.category} ${item.excerpt}`,
    keywordsEn: `${item.titleEn} ${item.categoryEn} ${item.excerptEn}`,
  };
}

function localizeItem(item: RawSearchItem, lang: Lang): SearchItem {
  return {
    title: lang === "vi" ? item.title : item.titleEn,
    category: lang === "vi" ? item.category : item.categoryEn,
    href: item.href,
    excerpt: lang === "vi" ? item.excerpt : item.excerptEn,
    keywords: `${item.keywords} ${item.keywordsEn}`,
  };
}

export function searchSite(query: string, lang: Lang, extras?: { projects?: Project[]; news?: NewsItem[] }): SearchItem[] {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return [];

  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  const projectItems = legacyContentFallbackEnabled
    ? mergeProjectsWithStaticPriority(extras?.projects ?? [])
    : extras?.projects ?? [];
  const rawSearchItems = [
    ...baseRawSearchItems,
    ...projectItems.map(projectToSearchItem),
    ...(legacyContentFallbackEnabled ? equipment.map(equipmentToSearchItem) : []),
    ...(extras?.news ?? []).map(newsToSearchItem),
  ];

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

function mergeProjectsWithStaticPriority(customProjects: Project[]) {
  const staticIds = new Set(projects.map((project) => project.id));
  return [...projects, ...customProjects.filter((project) => !staticIds.has(project.id))];
}

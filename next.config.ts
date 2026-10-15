import type { NextConfig } from "next";

function getCmsApiOrigin() {
  try {
    const origin = new URL(process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://huuthanhco.onrender.com");
    return ["http:", "https:"].includes(origin.protocol) ? origin.origin : "https://huuthanhco.onrender.com";
  } catch {
    return "https://huuthanhco.onrender.com";
  }
}

const cmsApiOrigin = getCmsApiOrigin();

const legacyStaticRedirects = [
  ["/home.html", "/"],
  ["/trang-chu.html", "/"],
  ["/gioi-thieu.html", "/gioi-thieu"],
  ["/Gioi-thieu-Huu-Thanh-1.html", "/gioi-thieu"],
  ["/Tam-nhin-su-menh-3.html", "/gioi-thieu"],
  ["/Tam-nhin--su-menh-3.html", "/gioi-thieu"],
  ["/Dinh-huong-phat-trien-58.html", "/gioi-thieu"],
  ["/Mot-so-cong-trinh-tieu-bieu-56.html", "/du-an"],
  ["/Mot-so-cong-trinh-tieu-bieu-57.html", "/du-an"],
  ["/cong-trinh.html", "/du-an"],
  ["/dich-vu.html", "/thi-cong-cau-cang"],
  ["/Xay-dung-cac-cong-trinh-duong-thuy-4.html", "/thi-cong-cau-cang"],
  ["/dong-coc.html", "/thi-cong-cau-cang"],
  ["/thi-cong-ke.html", "/du-an"],
  ["/thiet-bi.html", "/thiet-bi"],
  ["/cu-van.html", "/thiet-bi"],
  ["/tin-tuc.html", "/tin-tuc"],
  ["/tuyen-dung.html", "/tuyen-dung"],
  ["/Lien-he.html", "/lien-he"],
  ["/tai-lieu.html", "/gioi-thieu"],
] as const;

const legacyProjectRedirects = [
  ["10", "/du-an"],
  ["11", "/du-an"],
  ["12", "/du-an"],
  ["13", "/du-an"],
  ["14", "/du-an"],
  ["15", "/du-an"],
  ["16", "/du-an"],
  ["18", "/du-an/nao-vet-kenh-tri-ton-an-giang-dp98ddf58f-8ba9-432e-9160-b945e68996dc"],
  ["19", "/du-an/xay-dung-ke-bao-ve-bo-nhat-tan-doan-nt4-nt5-dpf215ef8b-496c-4975-aeba-eb8134297df9"],
  ["20", "/du-an"],
  ["21", "/du-an"],
  ["22", "/thi-cong-cau-cang"],
  ["24", "/du-an"],
  ["25", "/du-an"],
  ["26", "/du-an/xay-dung-cang-quoc-te-thi-vai-70-000-dwt-dpaab0955e-1ed3-483f-9883-ac30d7ce0ed6"],
  ["27", "/du-an/xay-dung-va-nang-cap-cang-sowatco-long-binh-dp9c5e5239-d5ad-41ad-86cb-e3cf8a468473"],
  ["28", "/thi-cong-cau-cang"],
  ["3", "/du-an"],
  ["4", "/du-an"],
  ["57", "/du-an/cai-tao-nang-cap-cau-cang-nha-may-nhiet-dien-hiep-phuoc-40-000dwt-dpab57f062-fbdb-4096-a5e4-d3a741787f20"],
  ["59", "/du-an/xay-dung-va-lap-dat-cau-cang-bo-20-000dwt-cang-dong-xuyen-dp572d172d-3f41-401a-bc3b-ca3c251bab9c"],
  ["66", "/du-an"],
  ["70", "/du-an"],
  ["81", "/thi-cong-cau-cang"],
  ["83", "/du-an/thi-cong-cau-cang-30-000dwt-ben-b5-cang-go-dau-dp327710f4-0466-4a36-932f-ff98f7979bd5"],
  ["84", "/thi-cong-cau-cang"],
  ["122", "/du-an/thi-cong-noi-dai-cau-cang-giai-doan-3-cang-ha-luu-vung-tau-dp343783f5-b36a-41ef-a5fa-7ccd43f12fdc"],
] as const;

const legacyEquipmentIds = ["9", "29", "31", "32", "33", "34", "35", "36", "65"] as const;
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${cmsApiOrigin}`,
  "frame-src https://player.vimeo.com https://www.google.com",
  "media-src 'self' https:",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      ...legacyStaticRedirects.map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/tin-chi-tiet/1/:slug*", destination: "/gioi-thieu", permanent: true },
      ...legacyEquipmentIds.map((id) => ({
        source: `/tin-chi-tiet/${id}/:slug*`,
        destination: "/thiet-bi",
        permanent: true,
      })),
      ...legacyProjectRedirects.map(([id, destination]) => ({
        source: `/tin-chi-tiet/${id}/:slug*`,
        destination,
        permanent: true,
      })),
      { source: "/tin-chi-tiet/:id/:slug*", destination: "/du-an", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/media/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/news/import-google-doc",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;

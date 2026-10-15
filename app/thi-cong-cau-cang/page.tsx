import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anchor, ArrowRight, CheckCircle2, HardHat, Waves } from "lucide-react";
import { absoluteSiteUrl, SITE_URL } from "@/lib/siteMetadata";

const PAGE_PATH = "/thi-cong-cau-cang";

export const metadata: Metadata = {
  title: "Công ty thi công cầu cảng, cảng biển chuyên nghiệp",
  description:
    "Hữu Thành chuyên thi công cầu cảng, cảng biển và công trình hàng hải: đóng cọc, kết cấu bến, nạo vét, đê kè và hạ tầng kỹ thuật trên toàn quốc.",
  keywords: [
    "công ty xây dựng cầu cảng",
    "công ty thi công cầu cảng",
    "thi công cảng biển",
    "xây dựng công trình hàng hải",
    "nhà thầu cầu cảng",
  ],
  alternates: { canonical: absoluteSiteUrl(PAGE_PATH) },
  openGraph: {
    type: "website",
    url: absoluteSiteUrl(PAGE_PATH),
    title: "Công ty thi công cầu cảng, cảng biển | Hữu Thành",
    description:
      "Năng lực thi công cầu cảng, cảng biển, đóng cọc, nạo vét và hạ tầng hàng hải của Hữu Thành.",
    images: [
      {
        url: absoluteSiteUrl("/images/dich-vu/huu-thanh-co_132828830902135317.jpg"),
        alt: "Hữu Thành thi công công trình cầu cảng và cảng biển",
      },
    ],
  },
};

const capabilities = [
  "Thi công cầu cảng, bến cảng và kết cấu phục vụ giao thông hàng hải",
  "Đóng cọc bê tông, cọc thép và thi công kết cấu dưới nước",
  "Nạo vét luồng, khu nước trước bến và san lấp mặt bằng",
  "Thi công đê kè, bảo vệ bờ và hạ tầng kỹ thuật sau cảng",
  "Huy động thiết bị chuyên dụng và tổ chức thi công theo tiến độ dự án",
];

const featuredProjects = [
  {
    name: "Bến số 3 – Khu bến cảng Dung Quất",
    detail: "Công trình cầu cảng có khả năng tiếp nhận tàu trọng tải đến 70.000 DWT.",
    href: "/du-an/du-an-ben-so-3-khu-ben-cang-dung-quat-1-co-trong-tai-cap-tau-len-den-70-000-dwt-dp943e4404-ccab-4a80-ac27-69b154bc56dc",
  },
  {
    name: "Nối dài cầu cảng – Cảng Hạ lưu Vũng Tàu",
    detail: "Thi công nối dài cầu cảng giai đoạn 3 phục vụ khai thác cảng.",
    href: "/du-an/thi-cong-noi-dai-cau-cang-giai-doan-3-cang-ha-luu-vung-tau-dp343783f5-b36a-41ef-a5fa-7ccd43f12fdc",
  },
  {
    name: "Cầu cảng 30.000 DWT – Bến B5 Cảng Gò Dầu",
    detail: "Công trình cầu cảng chuyên dụng tại khu vực cảng Gò Dầu.",
    href: "/du-an/thi-cong-cau-cang-30-000dwt-ben-b5-cang-go-dau-dp327710f4-0466-4a36-932f-ff98f7979bd5",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${absoluteSiteUrl(PAGE_PATH)}#service`,
      name: "Thi công cầu cảng và cảng biển",
      serviceType: "Thi công xây dựng công trình cầu cảng, cảng biển và công trình hàng hải",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Việt Nam" },
      url: absoluteSiteUrl(PAGE_PATH),
      description:
        "Dịch vụ thi công cầu cảng, cảng biển, đóng cọc, kết cấu bến, nạo vét, đê kè và hạ tầng kỹ thuật của Công ty Cổ phần Xây dựng Hữu Thành.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Thi công cầu cảng", item: absoluteSiteUrl(PAGE_PATH) },
      ],
    },
  ],
};

export default function PortConstructionPage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate overflow-hidden bg-slate-950 py-24 text-white sm:py-32">
        <Image
          src="/images/dich-vu/huu-thanh-co_132828830902135317.jpg"
          alt="Công trình cầu cảng do Hữu Thành thi công"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/35" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-400">
            Công trình giao thông hàng hải
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Công ty thi công cầu cảng, cảng biển chuyên nghiệp
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            Công ty Cổ phần Xây dựng Hữu Thành thực hiện các công trình cầu cảng, cảng biển,
            bến thủy nội địa và hạ tầng hàng hải với đội ngũ kỹ sư giàu kinh nghiệm cùng hệ
            thống thiết bị thi công chuyên dụng.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3.5 font-bold text-white transition hover:bg-sky-500"
            >
              Liên hệ tư vấn <ArrowRight size={18} />
            </Link>
            <Link
              href="/du-an?loai=giao-thong-hang-hai"
              className="inline-flex items-center gap-2 rounded-lg border border-white/35 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Xem dự án đã thực hiện
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-sky-700">Năng lực thi công</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Giải pháp đồng bộ cho công trình cầu cảng
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Hữu Thành tổ chức thi công theo điều kiện thực tế của từng vùng nước, yêu cầu tải
              trọng khai thác và tiến độ dự án. Phạm vi công việc được phối hợp từ công tác nền
              móng, kết cấu bến đến các hạng mục hạ tầng liên quan.
            </p>
            <ul className="mt-8 space-y-4">
              {capabilities.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-sky-600" size={21} />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { icon: Anchor, title: "Kinh nghiệm chuyên ngành", text: "Tập trung vào cầu cảng, cảng biển và công trình thủy." },
              { icon: HardHat, title: "Đội ngũ kỹ thuật", text: "Kỹ sư và nhân sự thi công có kinh nghiệm tại nhiều dự án thực tế." },
              { icon: Waves, title: "Thiết bị chuyên dụng", text: "Năng lực huy động thiết bị phục vụ thi công trên bờ và dưới nước." },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <Icon className="text-sky-700" size={30} />
                <h3 className="mt-4 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-sky-700">Dự án tiêu biểu</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black text-slate-950 sm:text-4xl">
            Kinh nghiệm được chứng minh qua các công trình thực tế
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article key={project.href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold leading-7 text-slate-950">{project.name}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">{project.detail}</p>
                <Link href={project.href} className="mt-6 inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-900">
                  Xem chi tiết <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#003b8f] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-black">Trao đổi về dự án cầu cảng của bạn</h2>
            <p className="mt-3 max-w-2xl text-blue-100">
              Liên hệ Hữu Thành để trao đổi yêu cầu kỹ thuật, phạm vi công việc và kế hoạch triển khai.
            </p>
          </div>
          <Link href="/lien-he" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-[#003b8f] hover:bg-blue-50">
            Liên hệ Hữu Thành <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

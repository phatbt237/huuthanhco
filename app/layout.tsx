import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteChrome from "@/components/SiteChrome";
import { absoluteSiteUrl, SITE_URL } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Công ty Cổ phần Xây dựng Hữu Thành | Thi công công trình chuyên nghiệp",
    template: "%s | Hữu Thành Construction",
  },
  description:
    "Hữu Thành - Đơn vị thi công công trình thủy công, cảng biển, kè sông và hạ tầng giao thông uy tín tại Việt Nam. Hơn 15 năm kinh nghiệm, 200+ dự án hoàn thành.",
  keywords: ["xây dựng", "thi công", "thủy công", "cảng biển", "kè sông", "hạ tầng", "Hữu Thành"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "vi_VN",
    siteName: "Hữu Thành Construction",
    title: "Công ty Cổ phần Xây dựng Hữu Thành",
    description: "Đơn vị thi công công trình thủy công, cảng biển và hạ tầng giao thông uy tín tại Việt Nam.",
    images: [
      {
        url: absoluteSiteUrl("/images/hero/Flash-4_132827290261925965.jpg"),
        alt: "Công ty Cổ phần Xây dựng Hữu Thành",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Công ty Cổ phần Xây dựng Hữu Thành",
    description: "Đơn vị thi công công trình chuyên nghiệp tại Việt Nam.",
    images: [absoluteSiteUrl("/images/hero/Flash-4_132827290261925965.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Công ty Cổ phần Xây dựng Hữu Thành",
  alternateName: "Hữu Thành Construction",
  url: SITE_URL,
  logo: absoluteSiteUrl("/images/huu-thanh-logo.png"),
  taxID: "0309349692",
  description: "Đơn vị thi công công trình thủy công, cảng biển và hạ tầng giao thông uy tín tại Việt Nam.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "16 Nguyễn Văn Lượng, Phường An Nhơn",
    addressLocality: "TP. Hồ Chí Minh",
    addressRegion: "TP. Hồ Chí Minh",
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+84-981-806-676",
    email: "huuthanhco09@gmail.com",
    contactType: "customer service",
    availableLanguage: "Vietnamese",
  },
  sameAs: ["https://www.facebook.com/HuuThanhJSC"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}

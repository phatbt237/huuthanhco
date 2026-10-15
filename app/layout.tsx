import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteChrome from "@/components/SiteChrome";
import { absoluteSiteUrl, SITE_URL } from "@/lib/siteMetadata";

const iconVersion = "20260608-2";
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Công ty Cổ phần Xây dựng Hữu Thành | Thi công công trình chuyên nghiệp",
    template: "%s | Hữu Thành Construction",
  },
  description:
    "Công ty Cổ phần Xây dựng Hữu Thành chuyên thi công cầu cảng, cảng biển, công trình hàng hải, thủy công, đê kè và hạ tầng kỹ thuật tại Việt Nam.",
  keywords: [
    "công ty xây dựng cầu cảng",
    "thi công cầu cảng",
    "xây dựng cảng biển",
    "công trình hàng hải",
    "thi công thủy công",
    "đê kè",
    "hạ tầng kỹ thuật",
    "Công ty Cổ phần Xây dựng Hữu Thành",
  ],
  icons: {
    icon: [
      { url: `/favicon.ico?v=${iconVersion}`, sizes: "any" },
      { url: `/icon.png?v=${iconVersion}`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: `/favicon.ico?v=${iconVersion}`,
    apple: [{ url: `/apple-touch-icon.png?v=${iconVersion}`, type: "image/png", sizes: "180x180" }],
  },
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

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Công ty Cổ phần Xây dựng Hữu Thành",
      legalName: "Công ty Cổ phần Xây dựng Hữu Thành",
      alternateName: ["Hữu Thành Construction", "Hữu Thành Corp."],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteSiteUrl("/images/huu-thanh-logo.png"),
      },
      foundingDate: "2009",
      taxID: "0309349692",
      description:
        "Công ty xây dựng chuyên thi công cầu cảng, cảng biển, công trình hàng hải, thủy công, đê kè và hạ tầng kỹ thuật tại Việt Nam.",
      knowsAbout: [
        "Thi công cầu cảng",
        "Xây dựng cảng biển",
        "Công trình hàng hải",
        "Thi công thủy công",
        "Đê kè và hạ tầng kỹ thuật",
      ],
      areaServed: { "@type": "Country", name: "Việt Nam" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "16 Nguyễn Văn Lượng, Phường An Nhơn",
        addressLocality: "Thành phố Hồ Chí Minh",
        addressRegion: "Thành phố Hồ Chí Minh",
        addressCountry: "VN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+84-28-7309-3068",
        email: "huuthanhco09@gmail.com",
        contactType: "customer service",
        availableLanguage: ["Vietnamese", "English"],
      },
      sameAs: ["https://www.facebook.com/HuuThanhJSC"],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: "Hữu Thành Construction",
      inLanguage: "vi-VN",
      publisher: { "@id": organizationId },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.className} h-full`} data-scroll-behavior="smooth">
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

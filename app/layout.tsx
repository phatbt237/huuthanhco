import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://huuthanh.vn"),
  title: {
    default: "Công ty TNHH Xây dựng Hữu Thành | Thi công công trình chuyên nghiệp",
    template: "%s | Hữu Thành Construction",
  },
  description:
    "Hữu Thành - Đơn vị thi công công trình thủy công, cảng biển, kè sông và hạ tầng giao thông uy tín tại Việt Nam. Hơn 15 năm kinh nghiệm, 200+ dự án hoàn thành.",
  keywords: ["xây dựng", "thi công", "thủy công", "cảng biển", "kè sông", "hạ tầng", "Hữu Thành"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Hữu Thành Construction",
    title: "Công ty TNHH Xây dựng Hữu Thành",
    description: "Đơn vị thi công công trình thủy công, cảng biển và hạ tầng giao thông uy tín tại Việt Nam.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Công ty TNHH Xây dựng Hữu Thành",
    description: "Đơn vị thi công công trình chuyên nghiệp tại Việt Nam.",
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
  name: "Công ty TNHH Xây dựng Hữu Thành",
  alternateName: "Hữu Thành Construction",
  url: "https://huuthanh.vn",
  logo: "https://huuthanh.vn/logo.png",
  description: "Đơn vị thi công công trình thủy công, cảng biển và hạ tầng giao thông uy tín tại Việt Nam.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Đường Nguyễn Hữu Thọ, Phường Tân Phong",
    addressLocality: "Quận 7",
    addressRegion: "TP. Hồ Chí Minh",
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+84-901-234-567",
    contactType: "customer service",
    availableLanguage: "Vietnamese",
  },
  sameAs: ["https://facebook.com/huuthanh"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

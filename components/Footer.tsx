"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Globe, Video, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSetting, useSiteSettings } from "@/lib/siteApi";

export default function Footer() {
  const { t } = useLanguage();
  const settings = useSiteSettings("company");

  const quickLinks = [
    { href: "/gioi-thieu", label: t("Giới thiệu", "About") },
    { href: "/du-an", label: t("Dự án", "Projects") },
    { href: "/thiet-bi", label: t("Thiết bị", "Equipment") },
    { href: "/tin-tuc", label: t("Tin tức", "News") },
    { href: "/tuyen-dung", label: t("Tuyển dụng", "Careers") },
    { href: "/lien-he", label: t("Liên hệ", "Contact") },
  ];

  const services = [
    t("Thi công cầu đường", "Road & Bridge Construction"),
    t("Xây dựng cảng biển", "Port Construction"),
    t("Công trình thủy lợi", "Hydraulic Works"),
    t("Nạo vét luồng hàng hải", "Maritime Channel Dredging"),
    t("Kè bờ sông", "Riverbank Reinforcement"),
    t("Ép cọc bê tông", "Concrete Pile Driving"),
  ];

  return (
    <footer style={{ backgroundColor: "#0A1628" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/69ba7546394f41773827398.jpg"
                alt="Logo Hữu Thành"
                className="w-12 h-12 object-contain rounded"
              />
              <div>
                <div className="text-white font-bold text-xl leading-tight">Hữu Thành</div>
                <div className="text-orange-400 text-xs tracking-widest uppercase">Construction</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t(
                "Công ty Cổ phần Xây dựng Hữu Thành - Đơn vị thi công công trình thủy công, cảng biển và hạ tầng uy tín tại Việt Nam.",
                "Huu Thanh Construction Co., Ltd. — A trusted contractor for hydraulic works, port construction and infrastructure in Vietnam."
              )}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors duration-200" aria-label="Facebook">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors duration-200" aria-label="Youtube">
                <Video size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors duration-200" aria-label="LinkedIn">
                <Share2 size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6 pb-3 border-b border-white/10">
              {t("Liên kết nhanh", "Quick Links")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-orange-400 text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-500 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6 pb-3 border-b border-white/10">
              {t("Lĩnh vực", "Services")}
            </h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item} className="text-white/60 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange-500 inline-block" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6 pb-3 border-b border-white/10">
              {t("Liên hệ", "Contact")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  {getSetting(settings, "company.address")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-orange-400 shrink-0" />
                <a href={`tel:${String(getSetting(settings, "company.phone")).replace(/\D/g, "")}`} className="text-white/60 hover:text-orange-400 text-sm transition-colors">
                  {getSetting(settings, "company.phone")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-orange-400 shrink-0" />
                <a href={`mailto:${getSetting(settings, "company.email")}`} className="text-white/60 hover:text-orange-400 text-sm transition-colors">
                  {getSetting(settings, "company.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            {t(
              "© 2024 Công ty Cổ phần Xây dựng Hữu Thành. Bảo lưu mọi quyền.",
              "© 2024 Huu Thanh Construction Co., Ltd. All rights reserved."
            )}
          </p>
          <p className="text-white/40 text-sm">
            {t("MST: 0123456789 | ĐKKD: Sở KH&ĐT TP.HCM", "Tax ID: 0123456789 | Business Reg.: HCMC Dept. of Planning")}
          </p>
        </div>
      </div>
    </footer>
  );
}

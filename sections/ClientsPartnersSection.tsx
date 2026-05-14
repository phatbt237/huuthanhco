"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  { name: "Phan Vũ", logo: "/images/partners/phan-vu.png" },
  { name: "Vina Kyoei Steel", logo: "/images/partners/vina-kyoei.png" },
  { name: "Thị Vải International Port", logo: "/images/partners/tvp.png" },
  { name: "Hải Linh", logo: "/images/partners/hai-linh.png" },
  { name: "SOWATCO", logo: "/images/partners/sowatco.png" },
];

const partners = [
  { name: "Nhân Luật Group", logo: "/images/partners/nhan-luat.png" },
  { name: "Cảng Đồng Xuyên", logo: "/images/partners/dong-xuyen.png" },
  { name: "FICO Cement", logo: "/images/partners/fico.png" },
  { name: "HPE", logo: "/images/partners/hpe.png" },
  { name: "Hòa Phát", logo: "/images/partners/hoa-phat.png" },
];

function LogoGrid({
  title,
  items,
}: {
  title: string;
  items: { name: string; logo: string }[];
}) {
  return (
    <div>
      <h3 className="mb-6 text-center text-2xl font-bold uppercase tracking-wide text-slate-900">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="group flex min-h-40 items-center justify-center border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
          >
            <img
              src={item.logo}
              alt={`Logo ${item.name}`}
              className="max-h-20 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsPartnersSection() {
  const { t } = useLanguage();

  return (
    <section id="khach-hang-doi-tac" className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
            {t("Khách hàng & Đối tác", "Clients & Partners")}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-950 md:text-5xl">
            {t(
              "Đồng hành cùng các đơn vị trong hệ sinh thái xây dựng và hạ tầng",
              "Partnering across the construction and infrastructure ecosystem"
            )}
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            {t(
              "Hữu Thành xây dựng quan hệ hợp tác dựa trên năng lực thi công, tiến độ, chất lượng và sự phối hợp rõ ràng trong từng dự án.",
              "Huu Thanh builds partnerships through execution capability, schedule discipline, quality, and clear project coordination."
            )}
          </p>
        </div>

        <div className="space-y-14">
          <LogoGrid title={t("Khách hàng", "Clients")} items={clients} />
          <LogoGrid title={t("Đối tác", "Partners")} items={partners} />
        </div>
      </div>
    </section>
  );
}

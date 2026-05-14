"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  HardHat,
  ShieldCheck,
  Target,
} from "lucide-react";

const profilePdfPath = "/docs/ho-so-nang-luc-huu-thanh-2026.pdf";
const organizationChartPath = "/images/so-do-to-chuc-huu-thanh.svg";

const stats = [
  { value: "15+", label: "Năm kinh nghiệm" },
  { value: "200+", label: "Dự án hoàn thành" },
  { value: "50+", label: "Thiết bị thi công" },
  { value: "300+", label: "Nhân sự & cộng tác" },
];

const capabilities = [
  "Thi công hạ tầng giao thông, cầu đường và nền móng",
  "Công trình thủy công, kè sông, cảng và bến thủy nội địa",
  "Nạo vét, gia cố bờ, xử lý nền đất yếu",
  "Quản lý tiến độ, chất lượng và an toàn tại công trường",
];

const values = [
  {
    icon: ShieldCheck,
    title: "An toàn",
    desc: "Kiểm soát rủi ro ngay từ biện pháp thi công, coi an toàn là điều kiện bắt buộc trên mọi công trường.",
  },
  {
    icon: Award,
    title: "Chất lượng",
    desc: "Thi công đúng kỹ thuật, nghiệm thu rõ ràng và duy trì tiêu chuẩn chất lượng ổn định qua từng hạng mục.",
  },
  {
    icon: Target,
    title: "Tiến độ",
    desc: "Tổ chức nhân lực, thiết bị và vật tư theo kế hoạch thực tế để hạn chế gián đoạn thi công.",
  },
  {
    icon: Eye,
    title: "Minh bạch",
    desc: "Báo cáo rõ tiến độ, khối lượng và các vấn đề phát sinh để chủ đầu tư luôn nắm được tình hình dự án.",
  },
];

const timeline = [
  { year: "2009", title: "Thành lập", desc: "Hữu Thành khởi đầu với định hướng tập trung vào thi công hạ tầng và công trình thủy công." },
  { year: "2012", title: "Mở rộng thiết bị", desc: "Đầu tư thêm phương tiện thủy, máy móc nền móng và năng lực thi công ven sông, ven biển." },
  { year: "2015", title: "Dự án cảng biển", desc: "Tham gia các hạng mục cảng, bến thủy và công trình hạ tầng kỹ thuật có yêu cầu tiến độ cao." },
  { year: "2018", title: "Chuẩn hóa quản lý", desc: "Tăng cường quy trình quản lý chất lượng, an toàn và kiểm soát hồ sơ nghiệm thu tại công trường." },
  { year: "2024", title: "Tăng tốc phát triển", desc: "Tiếp tục mở rộng năng lực thi công, hướng đến các dự án hạ tầng quy mô lớn và bền vững." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden bg-slate-950 py-28 md:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.32em] text-orange-400">Giới thiệu</span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">
              Công Ty Cổ phần Xây Dựng Hữu Thành
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Nhà thầu xây dựng hạ tầng với năng lực thi công thực tế, thiết bị đồng bộ và đội ngũ giàu kinh nghiệm trong các công trình thủy công, cảng biển, cầu đường và kè sông.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/du-an"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
              >
                Xem dự án <ArrowRight size={17} />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center border border-white/30 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-slate-950"
              >
                Liên hệ hợp tác
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-18 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1100&q=85"
                alt="Công trường xây dựng"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-orange-500 px-6 py-5 text-white">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm font-semibold uppercase tracking-wider">Năm xây dựng niềm tin</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Tổng quan</span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
                Năng lực thi công được xây dựng từ công trường thực tế
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Hữu Thành tập trung vào các dự án hạ tầng có yêu cầu kỹ thuật, tiến độ và an toàn cao. Chúng tôi tổ chức thi công dựa trên kế hoạch rõ ràng, phối hợp chặt chẽ với chủ đầu tư, tư vấn giám sát và các bên liên quan để đưa công trình về đích ổn định.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {capabilities.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 shrink-0 text-orange-500" size={19} />
                    <span className="text-sm font-semibold leading-6 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-10 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((item) => (
            <div key={item.label} className="bg-slate-950 px-5 py-8 text-center">
              <div className="text-4xl font-bold text-orange-400">{item.value}</div>
              <div className="mt-2 text-sm font-semibold text-white/65">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="su-menh-tam-nhin" className="scroll-mt-32 bg-slate-50 py-18 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-orange-500 text-white">
                <Eye size={23} />
              </div>
              <h2 className="text-3xl font-bold text-slate-950">Tầm nhìn</h2>
              <p className="mt-4 leading-8 text-slate-600">
                Trở thành nhà thầu hạ tầng đáng tin cậy trong lĩnh vực thủy công, cảng biển và giao thông, được lựa chọn bởi năng lực thi công, tính kỷ luật và cam kết đồng hành dài hạn.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-orange-500 text-white">
                <Target size={23} />
              </div>
              <h2 className="text-3xl font-bold text-slate-950">Sứ mệnh</h2>
              <p className="mt-4 leading-8 text-slate-600">
                Cung cấp giải pháp thi công hiệu quả, an toàn và bền vững; góp phần phát triển hạ tầng địa phương, tạo giá trị cho chủ đầu tư, người lao động và cộng đồng.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="gia-tri-cot-loi" className="scroll-mt-32 bg-white py-18 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Giá trị cốt lõi</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 md:text-5xl">Kỷ luật trong thi công, rõ ràng trong cam kết</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.45 }}
                className="border border-slate-200 p-6 transition-colors hover:border-orange-300"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-500">
                  <item.icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-18 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">Lĩnh vực hoạt động</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Tập trung vào những hạng mục đòi hỏi năng lực thi công thực tế
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Building2, title: "Hạ tầng giao thông", desc: "Cầu đường, đường nội bộ, hạ tầng kỹ thuật và các hạng mục phụ trợ." },
              { icon: HardHat, title: "Nền móng", desc: "Thi công móng, xử lý nền đất yếu, đào đắp và gia cố mặt bằng." },
              { icon: ShieldCheck, title: "Thủy công", desc: "Kè sông, bến thủy, cảng, công trình ven sông và ven biển." },
              { icon: Target, title: "Quản lý dự án", desc: "Kiểm soát tiến độ, chất lượng, an toàn và phối hợp nghiệm thu." },
            ].map((item) => (
              <div key={item.title} className="border border-white/10 p-6">
                <item.icon className="text-orange-400" size={27} />
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="so-do-to-chuc" className="scroll-mt-32 bg-slate-50 py-18 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Sơ đồ tổ chức</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 md:text-5xl">
              Cơ cấu tổ chức Công ty
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Cơ cấu tổ chức được thiết kế để rút ngắn luồng phối hợp giữa điều hành, kỹ thuật, vật tư và đội thi công, giúp dự án phản hồi nhanh với các yêu cầu thực tế tại hiện trường.
            </p>
            </div>
            <a
              href={organizationChartPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-orange-500 hover:text-orange-500"
            >
              <FileText size={17} />
              Xem ảnh lớn
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-6"
          >
            <img
              src={organizationChartPath}
              alt="Sơ đồ tổ chức Công ty Cổ phần Xây Dựng Hữu Thành"
              className="min-w-[1000px] w-full"
            />
          </motion.div>
        </div>
      </section>

      <section id="ho-so-nang-luc" className="scroll-mt-32 bg-white py-18 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-slate-950 text-white">
            <div className="grid lg:grid-cols-[1fr_0.85fr]">
              <div className="p-8 md:p-12">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">Hồ sơ năng lực</span>
                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                  Tải hồ sơ năng lực Hữu Thành 2026
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-white/70">
                  Tài liệu PDF tổng hợp thông tin doanh nghiệp, năng lực thi công, thiết bị, nhân sự và kinh nghiệm dự án. Phù hợp để gửi cho chủ đầu tư, đối tác và đơn vị tư vấn khi cần đánh giá năng lực.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={profilePdfPath}
                    download
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                  >
                    <Download size={18} />
                    Tải bản PDF
                  </a>
                  <a
                    href={profilePdfPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-slate-950"
                  >
                    <FileText size={18} />
                    Xem online
                  </a>
                </div>
              </div>
              <div className="relative min-h-72 bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-55"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1000&q=85')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                    <div className="text-5xl font-bold text-orange-400">PDF</div>
                    <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/75">
                      Hồ sơ năng lực 2026
                    </div>
                    <div className="mt-4 text-sm text-white/60">Dung lượng khoảng 21MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lich-su" className="scroll-mt-32 bg-white py-18 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Lịch sử</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 md:text-5xl">Hành trình phát triển</h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-slate-200 md:left-1/2" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  className={`relative grid gap-6 pl-12 md:grid-cols-2 md:pl-0 ${index % 2 === 0 ? "" : "md:[&>*:first-child]:col-start-2"}`}
                >
                  <div className="absolute left-[9px] top-2 h-3 w-3 bg-orange-500 ring-4 ring-white md:left-1/2 md:-translate-x-1/2" />
                  <div className="border border-slate-200 bg-white p-6 shadow-sm">
                    <span className="text-2xl font-bold text-orange-500">{item.year}</span>
                    <h3 className="mt-2 text-xl font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

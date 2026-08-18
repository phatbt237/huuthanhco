"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import { Award, Eye, ShieldCheck, Target, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CompanyProfileFlipbook from "./CompanyProfileFlipbook";
import GroundbreakingCarousel from "./GroundbreakingCarousel";

export default function AboutPage() {
  const { lang, t } = useLanguage();

  const timeline = [
    { year: "2024", title: t("Khẳng định năng lực nhà thầu chuyên nghiệp", "Affirming professional contractor capability"), desc: t("Tiếp tục mở rộng năng lực thi công công trình cảng biển, thủy lợi, đường thủy và hạ tầng kỹ thuật.", "Continued strengthening construction capability across seaports, hydraulic works, waterways and infrastructure.") },
    { year: "2021", title: t("Thi công cầu cảng 30.000DWT", "30,000DWT wharf construction"), desc: t("Tham gia thi công gói thầu cầu cảng 30.000DWT thuộc dự án Cảng Gò Dầu B, Đồng Nai.", "Participated in the 30,000DWT wharf package at Go Dau B Port, Dong Nai.") },
    { year: "2020", title: t("Dấu ấn công trình 80.000DWT", "80,000DWT project milestone"), desc: t("Tự hào là nhà thầu đầu tiên của Việt Nam xây dựng công trình cảng chuyên dụng xuất nhập xăng dầu và khí LNG quy mô lên đến 80.000DWT.", "Proud to be the first Vietnamese contractor to build a specialized petroleum and LNG import-export port project up to 80,000DWT.") },
    { year: "2015", title: t("Mở rộng lĩnh vực thi công", "Expanding construction scope"), desc: t("Tăng cường đội ngũ kỹ thuật, thiết bị và kinh nghiệm thi công công trình thủy lợi, giao thông hàng hải, đường thủy.", "Strengthened technical teams, equipment and experience in hydraulic, maritime and inland waterway construction.") },
    { year: "2009", title: t("Thành lập công ty", "Company founded"), desc: t("Công ty Cổ phần Xây dựng Hữu Thành được thành lập, xác định Uy Tín và Chất Lượng là mục tiêu chiến lược.", "Huu Thanh Construction Joint Stock Company was founded, setting Prestige and Quality as strategic goals.") },
  ];

  const values = [
    { icon: ShieldCheck, title: t("An toàn", "Safety"), desc: t("An toàn lao động là ưu tiên hàng đầu trong mọi hoạt động thi công.", "Worker safety is the top priority in every construction activity.") },
    { icon: Award, title: t("Chất lượng", "Quality"), desc: t("Mọi công trình đều được thi công đúng kỹ thuật, đảm bảo chất lượng theo tiêu chuẩn Việt Nam và quốc tế.", "Every project is built to precise technical standards, meeting both Vietnamese and international quality requirements.") },
    { icon: Target, title: t("Tiến độ", "On Schedule"), desc: t("Cam kết hoàn thành đúng tiến độ, không để chậm trễ ảnh hưởng đến kế hoạch của chủ đầu tư.", "Committed to on-time delivery so delays never affect the investor's plans.") },
    { icon: Eye, title: t("Minh bạch", "Transparency"), desc: t("Báo cáo tiến độ và tài chính minh bạch, xây dựng niềm tin với đối tác và khách hàng.", "Transparent progress and financial reporting to build trust with partners and clients.") },
    { icon: Users, title: t("Cộng đồng", "Community"), desc: t("Thi công có trách nhiệm với địa phương, hạn chế ảnh hưởng môi trường và đồng hành cùng các hoạt động xã hội nơi dự án đi qua.", "Building responsibly with local communities, reducing environmental impact and supporting social initiatives wherever our projects operate.") },
  ];

  return (
    <main className="about-page-document overflow-x-clip">
      {/* Hero */}
      <section
        className="relative py-32 flex items-center"
        style={{ backgroundColor: "#0D1B2A" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sky-600 text-xs font-bold uppercase tracking-widest">
              {t("Về chúng tôi", "About Us")}
            </span>
            <h1 className="mt-4 text-4xl font-bold uppercase leading-tight tracking-wide text-white md:text-5xl">
              {t("Giới thiệu công ty", "About the Company")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Hơn 17 năm xây dựng niềm tin, gắn kết với từng công trình trên khắp Việt Nam.",
                "Over 17 years of building trust, committed to every project across Vietnam."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company overview */}
      <section className="bg-slate-50/70 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#003b8f]">
                <span className="h-5 w-1 rounded-full bg-[#003b8f]" aria-hidden="true" />
                {t("Tổng quan công ty", "Company Overview")}
              </span>
              <h2 className="mt-5 max-w-3xl text-[32px] font-extrabold uppercase leading-[1.08] sm:text-[40px] lg:text-[46px]">
                {lang === "en" ? (
                  <>
                    <span className="block text-[#d71920]">Huu Thanh</span>
                    <span className="block text-[#003b8f]">Construction Corporation</span>
                  </>
                ) : (
                  <>
                    <span className="block text-[#003b8f]">Công ty Cổ phần</span>
                    <span className="block whitespace-nowrap">
                      <span className="text-[#003b8f]">Xây dựng </span>
                      <span className="text-[#d71920]">Hữu Thành</span>
                    </span>
                  </>
                )}
              </h2>
              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-600">
                <p>
                  {t(
                    "Công ty Cổ phần Xây dựng Hữu Thành là một trong những doanh nghiệp hàng đầu về xây dựng các công trình giao thông hàng hải, cảng biển, cảng thủy nội địa, thủy lợi, đê kè và các công trình cơ sở hạ tầng của Việt Nam, được thành lập năm 2009.",
                    "Huu Thanh Construction Joint Stock Company, established in 2009, is one of Vietnam's leading enterprises in maritime transport works, seaports, inland waterway ports, hydraulic structures, dikes, embankments and infrastructure projects."
                  )}
                </p>
                <p>
                  {t(
                    "Trong suốt quá trình hoạt động, Hữu Thành đã xây dựng được đội ngũ cán bộ kỹ thuật và quản lý công trình có trình độ chuyên môn cao, có bề dày kinh nghiệm về thi công công trình thủy lợi, giao thông hàng hải, đường thủy.",
                    "Throughout its operation, Huu Thanh has built a team of highly qualified technical and project management personnel with extensive experience in hydraulic, maritime and inland waterway construction."
                  )}
                </p>
                <p>
                  {t(
                    "Nhiều công trình tiêu biểu do Hữu Thành thực hiện đã góp phần vào sự nghiệp công nghiệp hóa hiện đại hóa đất nước, trong đó tự hào là nhà thầu đầu tiên của Việt Nam xây dựng công trình cảng chuyên dụng xuất nhập xăng dầu và khí LNG quy mô lên đến 80.000DWT.",
                    "Many signature projects delivered by Huu Thanh have contributed to Vietnam's industrialization and modernization, including the proud milestone of being the first Vietnamese contractor to build a specialized petroleum and LNG import-export port project up to 80,000DWT."
                  )}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GroundbreakingCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* History intro */}
      <section className="relative isolate overflow-hidden bg-slate-950 py-24">
        <Image
          src="/images/hero/Flash-7_132827290711634447.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,18,33,0.96)_0%,rgba(8,27,48,0.90)_46%,rgba(8,27,48,0.58)_100%)]" />
        <div className="absolute inset-y-0 right-0 -z-10 w-1/3 bg-[linear-gradient(135deg,transparent_0%,rgba(249,115,22,0.14)_100%)]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">
              {t("Lịch sử hình thành và phát triển", "History and Development")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">
              {t("Uy Tín và Chất Lượng là mục tiêu chiến lược", "Prestige and Quality as strategic goals")}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-6 text-[17px] leading-8 text-slate-200"
          >
            <p>
              {t(
                "Từ khi thành lập, Hữu Thành đã xác định mục tiêu chiến lược của mình là Uy Tín và Chất Lượng để trở thành một nhà thầu chuyên nghiệp hàng đầu của Việt Nam và khu vực trong lĩnh vực xây dựng các công trình thủy lợi; giao thông hàng hải, đường thủy.",
                "Since its establishment, Huu Thanh has defined Prestige and Quality as strategic goals to become a leading professional contractor in Vietnam and the region in hydraulic, maritime and inland waterway construction."
              )}
            </p>
            <p>
              {t(
                "Hữu Thành sẽ liên tục không ngừng đổi mới về công nghệ, thiết bị, nâng cao trình độ quản lý, cải thiện điều kiện làm việc nhằm nâng cao an toàn - chất lượng - tiến độ và hạ giá thành sản phẩm, bảo vệ sức khoẻ người lao động, bảo vệ môi trường.",
                "Huu Thanh continuously innovates technology and equipment, improves management capability and working conditions to enhance safety, quality and schedule performance, reduce costs, protect worker health and preserve the environment."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-50 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center mb-5">
                <Eye className="text-white" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("Tầm nhìn", "Vision")}</h2>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  "Trở thành nhà thầu xây dựng thủy công hàng đầu khu vực Đông Nam Á vào năm 2030, được tin tưởng bởi các chủ đầu tư trong và ngoài nước nhờ chất lượng, tiến độ và công nghệ thi công tiên tiến.",
                  "To become the leading hydraulic construction contractor in Southeast Asia by 2030, trusted by domestic and international investors for quality, schedule adherence, and advanced construction technology."
                )}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-50 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center mb-5">
                <Target className="text-white" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("Sứ mệnh", "Mission")}</h2>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  "Cung cấp các giải pháp xây dựng tối ưu, góp phần phát triển hạ tầng bền vững cho đất nước. Mang lại giá trị thực cho khách hàng, cơ hội phát triển cho nhân viên và đóng góp tích cực cho cộng đồng xã hội.",
                  "To deliver optimal construction solutions that contribute to sustainable infrastructure development. Creating real value for clients, growth opportunities for employees, and positive contributions to society."
                )}
              </p>
            </motion.div>
          </div>

          {/* Core values */}
          <SectionTitle
            label={t("Giá trị cốt lõi", "Core Values")}
            title={t("Những giá trị chúng tôi theo đuổi", "Values We Pursue")}
            center
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-sky-600" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CompanyProfileFlipbook />

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            label={t("Lịch sử", "History")}
            title={t("Hành trình phát triển", "Our Development Journey")}
            center
          />
          <div className="mt-14 relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`flex items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 flex items-center ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 bg-white rounded-2xl p-6 shadow-sm
                      border-l-4 border-sky-600
                      md:border-l-0 md:border md:border-slate-100
                      ${i % 2 === 0 ? "md:text-right" : ""}`}
                    >
                      <span className="text-sky-600 font-bold text-xl">{item.year}</span>
                      <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="hidden md:block w-10 h-0.5 bg-slate-300 shrink-0" />
                  </div>
                  <div className="hidden md:block w-4 h-4 rounded-full bg-sky-600 shrink-0 relative z-10 ring-4 ring-slate-50 shadow-md" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

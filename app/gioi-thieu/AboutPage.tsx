"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { Eye, Target, Heart, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const timeline = [
    { year: "2024", title: t("Nhà thầu uy tín quốc gia", "National Reputable Contractor"), desc: t("Được vinh danh là Nhà thầu uy tín toàn quốc, tiếp tục khẳng định vị thế hàng đầu trong ngành.", "Honored as the National Reputable Contractor, further cementing a leading position in the industry.") },
    { year: "2020", title: t("100+ dự án hoàn thành", "100+ Projects Completed"), desc: t("Cột mốc 100 dự án hoàn thành, tổng giá trị hợp đồng vượt 500 tỷ đồng.", "Milestone of 100 completed projects, with total contract value exceeding VND 500 billion.") },
    { year: "2018", title: t("Chứng nhận ISO 9001:2015", "ISO 9001:2015 Certified"), desc: t("Nhận chứng chỉ ISO 9001:2015 về hệ thống quản lý chất lượng, khẳng định tiêu chuẩn quốc tế.", "Awarded ISO 9001:2015 certification for quality management, affirming international standards.") },
    { year: "2015", title: t("Dự án cảng biển đầu tiên", "First Port Project"), desc: t("Trúng thầu và hoàn thành thành công dự án cảng tổng hợp Cát Lái, đánh dấu bước ngoặt quan trọng.", "Won and successfully completed the Cat Lai general port project — a major turning point.") },
    { year: "2012", title: t("Mở rộng quy mô", "Scale Expansion"), desc: t("Đầu tư thêm phương tiện thủy và mở rộng hoạt động sang lĩnh vực nạo vét luồng hàng hải.", "Invested in additional watercraft and expanded into maritime channel dredging.") },
    { year: "2009", title: t("Thành lập công ty", "Company Founded"), desc: t("Công ty TNHH Xây dựng Hữu Thành chính thức được thành lập tại TP. Hồ Chí Minh với vốn điều lệ 10 tỷ đồng.", "Huu Thanh Construction Co., Ltd. was officially established in Ho Chi Minh City with charter capital of VND 10 billion.") },
  ];

  const values = [
    { icon: Award, title: t("Chất lượng", "Quality"), desc: t("Mọi công trình đều được thi công đúng kỹ thuật, đảm bảo chất lượng theo tiêu chuẩn Việt Nam và quốc tế.", "Every project is built to precise technical standards, meeting both Vietnamese and international quality requirements.") },
    { icon: Target, title: t("Tiến độ", "On Schedule"), desc: t("Cam kết hoàn thành đúng tiến độ, không để chậm trễ ảnh hưởng đến kế hoạch của chủ đầu tư.", "Committed to on-time delivery so delays never affect the investor's plans.") },
    { icon: Heart, title: t("An toàn", "Safety"), desc: t("An toàn lao động là ưu tiên hàng đầu trong mọi hoạt động thi công.", "Worker safety is the top priority in every construction activity.") },
    { icon: Eye, title: t("Minh bạch", "Transparency"), desc: t("Báo cáo tiến độ và tài chính minh bạch, xây dựng niềm tin với đối tác và khách hàng.", "Transparent progress and financial reporting to build trust with partners and clients.") },
  ];

  return (
    <>
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
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              {t("Về chúng tôi", "About Us")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
              {t("Giới thiệu công ty", "About the Company")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Hơn 15 năm xây dựng niềm tin, gắn kết với từng công trình trên khắp Việt Nam.",
                "Over 15 years of building trust, committed to every project across Vietnam."
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
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
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
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
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
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-orange-500" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                      border-l-4 border-orange-500
                      md:border-l-0 md:border md:border-slate-100
                      ${i % 2 === 0 ? "md:text-right" : ""}`}
                    >
                      <span className="text-orange-500 font-bold text-xl">{item.year}</span>
                      <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="hidden md:block w-10 h-0.5 bg-slate-300 shrink-0" />
                  </div>
                  <div className="hidden md:block w-4 h-4 rounded-full bg-orange-500 shrink-0 relative z-10 ring-4 ring-slate-50 shadow-md" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

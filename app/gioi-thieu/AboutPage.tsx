"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { Eye, Target, Heart, Award } from "lucide-react";

const timeline = [
  { year: "2009", title: "Thành lập công ty", desc: "Công ty TNHH Xây dựng Hữu Thành chính thức được thành lập tại TP. Hồ Chí Minh với vốn điều lệ 10 tỷ đồng." },
  { year: "2012", title: "Mở rộng quy mô", desc: "Đầu tư thêm phương tiện thủy và mở rộng hoạt động sang lĩnh vực nạo vét luồng hàng hải." },
  { year: "2015", title: "Dự án cảng biển đầu tiên", desc: "Trúng thầu và hoàn thành thành công dự án cảng tổng hợp Cát Lái, đánh dấu bước ngoặt quan trọng." },
  { year: "2018", title: "Chứng nhận ISO 9001:2015", desc: "Nhận chứng chỉ ISO 9001:2015 về hệ thống quản lý chất lượng, khẳng định tiêu chuẩn quốc tế." },
  { year: "2020", title: "100+ dự án hoàn thành", desc: "Cột mốc 100 dự án hoàn thành, tổng giá trị hợp đồng vượt 500 tỷ đồng." },
  { year: "2024", title: "Nhà thầu uy tín quốc gia", desc: "Được vinh danh là Nhà thầu uy tín toàn quốc, tiếp tục khẳng định vị thế hàng đầu trong ngành." },
];

const values = [
  { icon: Award, title: "Chất lượng", desc: "Mọi công trình đều được thi công đúng kỹ thuật, đảm bảo chất lượng theo tiêu chuẩn Việt Nam và quốc tế." },
  { icon: Target, title: "Tiến độ", desc: "Cam kết hoàn thành đúng tiến độ, không để chậm trễ ảnh hưởng đến kế hoạch của chủ đầu tư." },
  { icon: Heart, title: "An toàn", desc: "An toàn lao động là ưu tiên hàng đầu trong mọi hoạt động thi công." },
  { icon: Eye, title: "Minh bạch", desc: "Báo cáo tiến độ và tài chính minh bạch, xây dựng niềm tin với đối tác và khách hàng." },
];

export default function AboutPage() {
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
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Về chúng tôi</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
              Giới thiệu công ty
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              Hơn 15 năm xây dựng niềm tin, gắn kết với từng công trình trên khắp Việt Nam.
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Tầm nhìn</h2>
              <p className="text-slate-600 leading-relaxed">
                Trở thành nhà thầu xây dựng thủy công hàng đầu khu vực Đông Nam Á vào năm 2030, được tin tưởng bởi các chủ đầu tư trong và ngoài nước nhờ chất lượng, tiến độ và công nghệ thi công tiên tiến.
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Sứ mệnh</h2>
              <p className="text-slate-600 leading-relaxed">
                Cung cấp các giải pháp xây dựng tối ưu, góp phần phát triển hạ tầng bền vững cho đất nước. Mang lại giá trị thực cho khách hàng, cơ hội phát triển cho nhân viên và đóng góp tích cực cho cộng đồng xã hội.
              </p>
            </motion.div>
          </div>

          {/* Core values */}
          <SectionTitle label="Giá trị cốt lõi" title="Những giá trị chúng tôi theo đuổi" center />
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
          <SectionTitle label="Lịch sử" title="Hành trình phát triển" center />
          <div className="mt-14 relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1">
                    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                      <span className="text-orange-500 font-bold text-xl">{item.year}</span>
                      <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-sm shrink-0 shadow-lg">
                    {i + 1}
                  </div>
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

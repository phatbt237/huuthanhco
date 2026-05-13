"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, DollarSign, ChevronDown, CheckCircle2 } from "lucide-react";
import { jobs } from "@/data/jobs";

export default function CareersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Gia nhập đội ngũ</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Tuyển dụng</h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              Cùng Hữu Thành xây dựng những công trình để đời cho đất nước.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-slate-200 rounded-2xl overflow-hidden hover:border-orange-200 transition-colors duration-200"
              >
                {/* Header */}
                <button
                  className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                >
                  <div className="flex-1">
                    <h2 className="font-bold text-slate-900 text-lg mb-3">{job.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-orange-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-orange-400" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign size={14} className="text-orange-400" /> {job.salary}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${expanded === job.id ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {expanded === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-slate-100">
                        <p className="text-slate-600 text-sm leading-relaxed mt-4 mb-4">{job.description}</p>
                        <p className="font-semibold text-slate-800 text-sm mb-3">Yêu cầu:</p>
                        <ul className="space-y-2 mb-6">
                          {job.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 size={15} className="text-orange-500 shrink-0 mt-0.5" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setApplied(job.id)}
                          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            applied === job.id
                              ? "bg-green-500 text-white cursor-default"
                              : "bg-orange-500 hover:bg-orange-600 text-white"
                          }`}
                        >
                          {applied === job.id ? "✓ Đã ứng tuyển thành công" : "Ứng tuyển ngay"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 bg-slate-50 rounded-2xl p-8 text-center">
            <p className="text-slate-600 text-sm leading-relaxed">
              Không tìm thấy vị trí phù hợp? Gửi CV của bạn đến{" "}
              <a href="mailto:tuyendung@huuthanh.vn" className="text-orange-500 font-semibold">
                tuyendung@huuthanh.vn
              </a>{" "}
              — chúng tôi luôn chào đón nhân tài.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

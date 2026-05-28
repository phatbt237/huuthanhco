"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, DollarSign, ChevronDown, CheckCircle2 } from "lucide-react";
import { jobs } from "@/data/jobs";
import { useLanguage } from "@/contexts/LanguageContext";
import { mergeById } from "@/lib/cmsContent";
import { useCmsContent } from "@/lib/useCmsContent";
import { submitJobApplication } from "@/lib/siteApi";

export default function CareersPage() {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent();
  const jobItems = mergeById(jobs, cmsContent.jobs);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applicationError, setApplicationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const handleApply = async (job: (typeof jobItems)[number]) => {
    setApplicationError("");
    setIsSubmitting(true);
    try {
      await submitJobApplication({
        jobId: null,
        fullName: applicationForm.fullName,
        phone: applicationForm.phone,
        email: applicationForm.email || undefined,
        positionApplied: lang === "vi" ? job.title : job.titleEn,
        message: applicationForm.message,
      }, cvFile);
      setApplied(job.id);
      setApplicationForm({ fullName: "", phone: "", email: "", message: "" });
      setCvFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
    } catch {
      setApplicationError(t("Không gửi được hồ sơ. Vui lòng thử lại.", "Could not submit your application. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCvFile = (file: File | null) => {
    setApplicationError("");
    if (!file) {
      setCvFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setApplicationError(t("File CV tối đa 5MB.", "CV file must be 5MB or smaller."));
      if (cvInputRef.current) cvInputRef.current.value = "";
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setApplicationError(t("CV cần là file PDF.", "CV must be a PDF file."));
      if (cvInputRef.current) cvInputRef.current.value = "";
      return;
    }

    setCvFile(file);
  };

  const clearCvFile = () => {
    setCvFile(null);
    if (cvInputRef.current) cvInputRef.current.value = "";
  };

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
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              {t("Gia nhập đội ngũ", "Join Our Team")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
              {t("Tuyển dụng", "Careers")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Cùng Hữu Thành xây dựng những công trình để đời cho đất nước.",
                "Join Huu Thanh in building lasting infrastructure for the nation."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {jobItems.map((job, i) => (
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
                    <h2 className="font-bold text-slate-900 text-lg mb-3">
                      {lang === "vi" ? job.title : job.titleEn}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-orange-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-orange-400" />
                        {lang === "vi" ? job.type : job.typeEn}
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
                        <p className="text-slate-600 text-sm leading-relaxed mt-4 mb-4">
                          {lang === "vi" ? job.description : job.descriptionEn}
                        </p>
                        <p className="font-semibold text-slate-800 text-sm mb-3">
                          {t("Yêu cầu:", "Requirements:")}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {(lang === "vi" ? job.requirements : job.requirementsEn).map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 size={15} className="text-orange-500 shrink-0 mt-0.5" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 rounded-xl bg-slate-50 p-4">
                          {applied === job.id ? (
                            <div className="rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white">
                              {t("✓ Đã ứng tuyển thành công", "✓ Application submitted")}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {applicationError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{applicationError}</div>}
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <input required value={applicationForm.fullName} onChange={(e) => setApplicationForm({ ...applicationForm, fullName: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" placeholder={t("Họ và tên", "Full name")} />
                                <input required value={applicationForm.phone} onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" placeholder={t("Số điện thoại", "Phone")} />
                              </div>
                              <input type="email" value={applicationForm.email} onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" placeholder="Email" />
                              <label className="block rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-600">
                                <span className="mb-2 block font-semibold text-slate-800">{t("Tải file CV", "Upload CV file")}</span>
                                <input
                                  ref={cvInputRef}
                                  type="file"
                                  accept=".pdf,application/pdf"
                                  onClick={(event) => {
                                    event.currentTarget.value = "";
                                  }}
                                  onChange={(event) => handleCvFile(event.target.files?.[0] ?? null)}
                                  className="block w-full text-sm"
                                />
                                {cvFile && (
                                  <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                                    <span>
                                      {t("Đã chọn:", "Selected:")} {cvFile.name}
                                    </span>
                                    <button type="button" onClick={clearCvFile} className="font-black text-red-600 underline-offset-2 hover:underline">
                                      {t("Xóa / chọn lại", "Remove / choose again")}
                                    </button>
                                  </div>
                                )}
                              </label>
                              <textarea value={applicationForm.message} onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" placeholder={t("Lời nhắn", "Message")} />
                              <button
                                disabled={isSubmitting || !applicationForm.fullName || !applicationForm.phone}
                                onClick={() => void handleApply(job)}
                                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isSubmitting ? t("Đang gửi...", "Sending...") : t("Ứng tuyển ngay", "Apply Now")}
                              </button>
                            </div>
                          )}
                        </div>
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
              {t(
                "Không tìm thấy vị trí phù hợp? Gửi CV của bạn đến",
                "Didn't find a suitable position? Send your CV to"
              )}{" "}
              <a href="mailto:tuyendung@huuthanh.vn" className="text-orange-500 font-semibold">
                tuyendung@huuthanh.vn
              </a>{" "}
              {t("— chúng tôi luôn chào đón nhân tài.", "— we always welcome talented candidates.")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

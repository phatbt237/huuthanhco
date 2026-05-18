"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSetting, submitConsultation, useSiteSettings } from "@/lib/siteApi";

export default function ContactPage() {
  const { t } = useLanguage();
  const settings = useSiteSettings("company");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const contactInfo = [
    {
      icon: MapPin,
      title: t("Địa chỉ", "Address"),
      value: getSetting(settings, "company.address"),
    },
    {
      icon: Phone,
      title: t("Hotline", "Hotline"),
      value: getSetting(settings, "company.phone"),
      href: `tel:${String(getSetting(settings, "company.phone")).replace(/\D/g, "")}`,
    },
    {
      icon: Mail,
      title: "Email",
      value: getSetting(settings, "company.email"),
      href: `mailto:${getSetting(settings, "company.email")}`,
    },
    {
      icon: Clock,
      title: t("Giờ làm việc", "Working Hours"),
      value: getSetting(settings, "company.workingHours"),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await submitConsultation({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        service: "Tư vấn từ website",
        message: form.message,
      });
      setSubmitted(true);
    } catch {
      setError(t("Không gửi được yêu cầu. Vui lòng thử lại.", "Could not send your request. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              {t("Liên hệ", "Contact")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
              {t("Liên hệ với chúng tôi", "Contact Us")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn.",
                "We are always ready to support and answer any of your questions."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                {t("Thông tin liên hệ", "Contact Information")}
              </h2>
              <div className="space-y-6 mb-10">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {info.title}
                      </p>
                      {info.href ? (
                        <a href={info.href} className="text-slate-700 font-medium hover:text-orange-500 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-slate-700 font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden h-72 bg-slate-100 border border-slate-200">
                <iframe
                  src={getSetting(settings, "company.mapEmbedUrl")}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("Bản đồ Hữu Thành", "Huu Thanh Map")}
                />
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                {t("Gửi yêu cầu tư vấn", "Send a Consultation Request")}
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <CheckCircle2 className="text-green-500 mb-4" size={56} />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {t("Gửi thành công!", "Sent successfully!")}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {t(
                      "Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ lại trong vòng 24 giờ.",
                      "We have received your request and will get back to you within 24 hours."
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("Họ và tên", "Full Name")} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-slate-700 text-sm"
                        placeholder={t("Nguyễn Văn A", "John Smith")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("Số điện thoại", "Phone Number")} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-slate-700 text-sm"
                        placeholder="0901 234 567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-slate-700 text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("Nội dung", "Message")} <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-slate-700 text-sm resize-none"
                      placeholder={t("Mô tả dự án bạn cần tư vấn...", "Describe the project you need consultation for...")}
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors duration-200 shadow-md hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={16} />
                    {isSubmitting ? t("Đang gửi...", "Sending...") : t("Gửi yêu cầu", "Send Request")}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

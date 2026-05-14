"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const contactInfo = [
    {
      icon: MapPin,
      title: t("Địa chỉ", "Address"),
      value: "123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh",
    },
    {
      icon: Phone,
      title: t("Hotline", "Hotline"),
      value: "0901 234 567",
      href: "tel:0901234567",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@huuthanh.vn",
      href: "mailto:info@huuthanh.vn",
    },
    {
      icon: Clock,
      title: t("Giờ làm việc", "Working Hours"),
      value: t("Thứ 2 - Thứ 7: 7:30 - 17:30", "Mon - Sat: 7:30 AM - 5:30 PM"),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580560896!2d106.69927!3d10.73535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f8985e43519%3A0x4e7d5e3e8e90e36b!2zUXXhuq1uIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2svn!4v1620000000000!5m2!1svi!2svn"
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
                    type="submit"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors duration-200 shadow-md hover:shadow-orange-500/30"
                  >
                    <Send size={16} />
                    {t("Gửi yêu cầu", "Send Request")}
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

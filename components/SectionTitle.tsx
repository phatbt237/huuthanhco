"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionTitle({
  label,
  title,
  subtitle,
  light = false,
  center = false,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={center ? "text-center" : ""}
    >
      {label && (
        <span className="inline-block text-orange-500 text-xs font-bold uppercase tracking-widest mb-3 border-l-2 border-orange-500 pl-3">
          {label}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold leading-tight mb-4 ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base leading-relaxed max-w-2xl ${
            center ? "mx-auto" : ""
          } ${light ? "text-white/60" : "text-slate-500"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

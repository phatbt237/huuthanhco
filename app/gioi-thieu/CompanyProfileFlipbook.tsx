"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { forwardRef, useRef, useState } from "react";
import type { CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const PDF_URL = "/docs/ho-so-nang-luc-huu-thanh-2026.pdf";
const PAGE_COUNT = 67;

const profilePages = Array.from(
  { length: PAGE_COUNT },
  (_, index) => `/docs/ho-so-nang-luc-pages/page-${String(index + 1).padStart(3, "0")}.webp`
);

type FlipBookHandle = {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
    turnToPage: (page: number) => void;
  };
};

type FlipBookEvent = {
  data: number;
};

type FlipBookProps = {
  children: ReactNode;
  width: number;
  height: number;
  size: "fixed" | "stretch";
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  startPage: number;
  drawShadow: boolean;
  flippingTime: number;
  usePortrait: boolean;
  startZIndex: number;
  autoSize: boolean;
  maxShadowOpacity: number;
  showCover: boolean;
  mobileScrollSupport: boolean;
  clickEventForward: boolean;
  useMouseEvents: boolean;
  swipeDistance: number;
  showPageCorners: boolean;
  disableFlipByClick: boolean;
  className?: string;
  style?: CSSProperties;
  onFlip?: (event: FlipBookEvent) => void;
};

const PageFlipBook = HTMLFlipBook as unknown as ForwardRefExoticComponent<
  FlipBookProps & RefAttributes<FlipBookHandle>
>;

const ProfilePage = forwardRef<HTMLDivElement, { pageNumber: number; src: string }>(
  ({ pageNumber, src }, ref) => (
    <div ref={ref} className="relative overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]">
      <img
        src={src}
        alt={`Trang ${pageNumber} hồ sơ năng lực Hữu Thành 2026`}
        className="h-full w-full select-none object-contain"
        loading={pageNumber <= 4 ? "eager" : "lazy"}
        draggable={false}
      />
      <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold text-white">
        {pageNumber}
      </span>
    </div>
  )
);

ProfilePage.displayName = "ProfilePage";

export default function CompanyProfileFlipbook() {
  const { t } = useLanguage();
  const flipBookRef = useRef<FlipBookHandle>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const canGoBack = pageIndex > 0;
  const canGoNext = pageIndex < PAGE_COUNT - 1;

  const goBack = () => {
    if (canGoBack) {
      flipBookRef.current?.pageFlip().flipPrev("bottom");
    }
  };

  const goNext = () => {
    if (canGoNext) {
      flipBookRef.current?.pageFlip().flipNext("bottom");
    }
  };

  return (
    <section id="ho-so-nang-luc" className="scroll-mt-28 bg-white py-20 md:scroll-mt-36 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">
              {t("Hồ sơ năng lực", "Company Profile")}
            </span>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              {t("Hồ sơ năng lực Hữu Thành 2026", "Huu Thanh Company Profile 2026")}
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={PDF_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-700"
            >
              <ExternalLink size={18} />
              {t("Xem PDF gốc", "View PDF")}
            </a>
            <a
              href={PDF_URL}
              download
              className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-sky-600 hover:text-sky-700"
            >
              <Download size={18} />
              {t("Tải hồ sơ", "Download")}
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] bg-slate-100 px-3 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-200 sm:px-8 md:py-12"
        >
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/80 to-transparent" />

          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label={t("Trang trước", "Previous page")}
            className="absolute left-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg ring-1 ring-slate-200 transition hover:bg-sky-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:flex"
          >
            <ChevronLeft size={30} />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label={t("Trang sau", "Next page")}
            className="absolute right-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg ring-1 ring-slate-200 transition hover:bg-sky-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:flex"
          >
            <ChevronRight size={30} />
          </button>

          <div className="relative mx-auto max-w-6xl">
            <div className="relative flex justify-center">
              <PageFlipBook
                ref={flipBookRef}
                width={520}
                height={735}
                size="stretch"
                minWidth={300}
                maxWidth={560}
                minHeight={424}
                maxHeight={792}
                startPage={0}
                drawShadow
                flippingTime={950}
                usePortrait
                startZIndex={10}
                autoSize
                maxShadowOpacity={0.45}
                showCover
                mobileScrollSupport
                clickEventForward
                useMouseEvents
                swipeDistance={20}
                showPageCorners
                disableFlipByClick={false}
                className="profile-flipbook"
                onFlip={(event) => setPageIndex(event.data)}
              >
                {profilePages.map((src, index) => (
                  <ProfilePage key={src} pageNumber={index + 1} src={src} />
                ))}
              </PageFlipBook>
            </div>
          </div>

          <div className="relative z-10 mt-7 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow ring-1 ring-slate-200 disabled:opacity-30"
                aria-label={t("Trang trước", "Previous page")}
              >
                <ChevronLeft size={24} />
              </button>
              <span className="min-w-24 text-center text-sm font-bold text-slate-700">
                {pageIndex + 1} / {PAGE_COUNT}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow ring-1 ring-slate-200 disabled:opacity-30"
                aria-label={t("Trang sau", "Next page")}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="hidden text-sm font-bold text-slate-700 md:block">
              {pageIndex + 1} / {PAGE_COUNT}
            </div>
            <input
              type="range"
              min={0}
              max={PAGE_COUNT - 1}
              step={1}
              value={pageIndex}
              onChange={(event) => {
                const nextPage = Number(event.target.value);
                flipBookRef.current?.pageFlip().turnToPage(nextPage);
                setPageIndex(nextPage);
              }}
              aria-label={t("Chọn trang hồ sơ năng lực", "Select company profile page")}
              className="h-2 w-full max-w-md cursor-pointer accent-sky-600"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

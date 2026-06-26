"use client";

import { useEffect, useState } from "react";

export default function CountUp({ to, suffix = "", duration = 2000 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(to * easeProgress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [to, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

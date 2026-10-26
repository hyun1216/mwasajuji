'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Check initial position
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[430px] w-full pointer-events-none flex justify-end px-5 z-40">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        title="맨 위로"
        className={`pointer-events-auto w-11 h-11 rounded-full bg-[#18181B] text-[#FAF7F2] shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-stone-700/50 flex items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}

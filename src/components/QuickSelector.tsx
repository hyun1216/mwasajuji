'use client';

import { useState } from 'react';
import { Sparkles, Dices, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TARGET_OPTIONS = [
  { id: 'bestie', label: '찐친 🤪' },
  { id: 'awkward', label: '어색한 지인 🤝' },
  { id: 'coworker', label: '직장 동료 💼' },
  { id: 'couple', label: '연인/썸 💖' },
  { id: 'parents', label: '부모님 🏡' },
];

const PRICE_OPTIONS = [
  { id: 'under_10k', label: '1만원대 (가성비)' },
  { id: '20k_30k', label: '2~3만원대 (적당)' },
  { id: '40k_50k', label: '4~5만원대 (호감)' },
  { id: 'over_100k', label: '10만원 이상 (플렉스)' },
];

const VIBE_OPTIONS = [
  { id: 'funny', label: '웃긴/센스있는 🤣' },
  { id: 'practical', label: '실용적인 생존템 🍳' },
  { id: 'healing', label: '꿀잠/위로템 🌙' },
  { id: 'luxury', label: '스몰럭셔리 감성 ✨' },
];

interface QuickSelectorProps {
  onSearch: (target: string, price: string, vibe: string) => void;
}

export default function QuickSelector({ onSearch }: QuickSelectorProps) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [priceIndex, setPriceIndex] = useState(1);
  const [vibeIndex, setVibeIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomize = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % TARGET_OPTIONS.length);
      setPriceIndex((prev) => (prev + 1) % PRICE_OPTIONS.length);
      setVibeIndex((prev) => (prev + 1) % VIBE_OPTIONS.length);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 70);
  };

  const handleFind = () => {
    onSearch(
      TARGET_OPTIONS[targetIndex].id,
      PRICE_OPTIONS[priceIndex].id,
      VIBE_OPTIONS[vibeIndex].id
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white p-5 shadow-xl border border-zinc-700/50">
      {/* Decorative gradient glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="relative flex items-center justify-between mb-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-bold text-orange-300">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>3초 선물 퀵 셀렉터</span>
        </div>

        <button
          onClick={handleRandomize}
          disabled={isSpinning}
          className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-full transition-all active:scale-95 border border-white/5"
        >
          <Dices className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>랜덤 뽑기</span>
        </button>
      </div>

      <h2 className="text-lg font-bold tracking-tight text-white/95 mb-4 leading-snug">
        선물 고르기 막막할 땐?<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
          단 3가지 조건
        </span>
        으로 바로 결정!
      </h2>

      {/* Interactive Slot Machine Form */}
      <div className="space-y-2.5 mb-5 relative">
        {/* Row 1: Target */}
        <div className="flex items-center gap-2 bg-zinc-800/80 rounded-2xl p-2.5 border border-zinc-700/60">
          <span className="text-xs font-semibold text-zinc-400 shrink-0 w-12 pl-1">누구?</span>
          <button
            onClick={() => setTargetIndex((prev) => (prev + 1) % TARGET_OPTIONS.length)}
            className="flex-1 text-left flex items-center justify-between bg-zinc-900/90 hover:bg-zinc-700/60 px-3 py-2 rounded-xl text-sm font-semibold text-orange-300 transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={targetIndex}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="truncate"
              >
                {TARGET_OPTIONS[targetIndex].label}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-zinc-400 font-normal ml-1">터치 변경</span>
          </button>
          <span className="text-xs font-medium text-zinc-300 pr-1 shrink-0">에게</span>
        </div>

        {/* Row 2: Price */}
        <div className="flex items-center gap-2 bg-zinc-800/80 rounded-2xl p-2.5 border border-zinc-700/60">
          <span className="text-xs font-semibold text-zinc-400 shrink-0 w-12 pl-1">예산?</span>
          <button
            onClick={() => setPriceIndex((prev) => (prev + 1) % PRICE_OPTIONS.length)}
            className="flex-1 text-left flex items-center justify-between bg-zinc-900/90 hover:bg-zinc-700/60 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-300 transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={priceIndex}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="truncate"
              >
                {PRICE_OPTIONS[priceIndex].label}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-zinc-400 font-normal ml-1">터치 변경</span>
          </button>
          <span className="text-xs font-medium text-zinc-300 pr-1 shrink-0">로</span>
        </div>

        {/* Row 3: Vibe */}
        <div className="flex items-center gap-2 bg-zinc-800/80 rounded-2xl p-2.5 border border-zinc-700/60">
          <span className="text-xs font-semibold text-zinc-400 shrink-0 w-12 pl-1">분위기?</span>
          <button
            onClick={() => setVibeIndex((prev) => (prev + 1) % VIBE_OPTIONS.length)}
            className="flex-1 text-left flex items-center justify-between bg-zinc-900/90 hover:bg-zinc-700/60 px-3 py-2 rounded-xl text-sm font-semibold text-rose-300 transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={vibeIndex}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="truncate"
              >
                {VIBE_OPTIONS[vibeIndex].label}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-zinc-400 font-normal ml-1">터치 변경</span>
          </button>
          <span className="text-xs font-medium text-zinc-300 pr-1 shrink-0">거 줘!</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleFind}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-[0.98] font-bold text-white text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <span>3초 만에 인생 선물 찾기</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

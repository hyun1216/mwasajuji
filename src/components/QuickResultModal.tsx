'use client';

import { useState } from 'react';
import { ProductItem } from '@/types/gift';
import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ExternalLink, Sparkles, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import Image from 'next/image';

interface QuickResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ProductItem[];
  criteriaTitle: string;
}

export default function QuickResultModal({
  isOpen,
  onClose,
  items,
  criteriaTitle,
}: QuickResultModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toggleLike, isLiked } = useGiftStore();
  const { showToast } = useToastStore();

  if (!isOpen) return null;

  const currentItem = items[currentIndex];

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShare = async (item: ProductItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `[모사주지] ${item.name}`,
          text: `${item.editorComment}\n가격: ${item.price.toLocaleString()}원`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `[모사주지 추천] ${item.name} (${item.price.toLocaleString()}원)\n${item.editorComment}\n${window.location.href}`
      );
      showToast('추천 상품 정보가 복사되었습니다! 🎁', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[390px] bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>3초 퀵 매칭 Top 3 ({currentIndex + 1}/3)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Criteria badge */}
        <div className="px-5 py-2 bg-zinc-800/50 text-[11px] text-zinc-300 font-medium truncate">
          🎯 조건: <span className="text-white font-semibold">{criteriaTitle}</span>
        </div>

        {/* Card Content Area */}
        {currentItem ? (
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60 shadow-inner group">
                  <Image
                    src={currentItem.imageUrl}
                    alt={currentItem.name}
                    fill
                    sizes="350px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  {/* Burden Score Badge on top of image */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 shadow-md">
                    {currentItem.burdenBadgeText}
                  </div>
                </div>

                {/* Brand & Title */}
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    {currentItem.brand}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug mt-0.5">
                    {currentItem.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-xl font-extrabold text-orange-400">
                      {currentItem.price.toLocaleString()}원
                    </span>
                    {currentItem.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        {currentItem.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>

                {/* Editor Comment Box */}
                <div className="p-3.5 rounded-2xl bg-zinc-800/90 border border-zinc-700/80 text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="text-orange-400 font-bold block mb-1">
                    💬 에디터 한마디
                  </span>
                  &ldquo;{currentItem.editorComment}&rdquo;
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-10 text-center text-zinc-400 text-sm">
            해당 조건에 딱 맞는 상품을 찾는 중입니다...
          </div>
        )}

        {/* Footer Navigation & Actions */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 space-y-3">
          {/* Deck Prev/Next Arrows */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                currentIndex === 0
                  ? 'text-zinc-600 border-zinc-800 opacity-50 cursor-not-allowed'
                  : 'text-zinc-300 border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전 카드</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {items.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-orange-500'
                      : 'w-2 bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === items.length - 1}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                currentIndex === items.length - 1
                  ? 'text-zinc-600 border-zinc-800 opacity-50 cursor-not-allowed'
                  : 'text-zinc-300 border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <span>다음 카드</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          {currentItem && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleLike(currentItem.id);
                  showToast(
                    isLiked(currentItem.id)
                      ? '찜 목록에서 제외되었습니다.'
                      : '찜 목록에 추가되었습니다! ❤️',
                    'info'
                  );
                }}
                className={`p-3 rounded-2xl border transition-all active:scale-95 ${
                  isLiked(currentItem.id)
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
                aria-label="찜하기"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked(currentItem.id) ? 'fill-rose-400' : ''
                  }`}
                />
              </button>

              <button
                onClick={() => handleShare(currentItem)}
                className="p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 active:scale-95"
                aria-label="공유하기"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <a
                href={currentItem.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-orange-500/20"
              >
                <span>구매 링크 확인하기</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

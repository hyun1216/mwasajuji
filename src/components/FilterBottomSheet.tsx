'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { AVAILABLE_TAGS } from '@/data/mockProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw } from 'lucide-react';

export default function FilterBottomSheet() {
  const { 
    isFilterSheetOpen, 
    setIsFilterSheetOpen, 
    selectedTags, 
    toggleTag, 
    clearTags 
  } = useGiftStore();

  if (!isFilterSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0"
        onClick={() => setIsFilterSheetOpen(false)}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative z-10 w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl p-5 border-t border-zinc-200"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-zinc-300 rounded-full mx-auto mb-4" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900">상황 & 테마 태그 필터</h3>
            <p className="text-xs text-zinc-400 mt-0.5">원하는 상황을 다중 선택해보세요</p>
          </div>
          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Options Grid */}
        <div className="py-5">
          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>#{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="flex items-center gap-1 px-4 py-3 rounded-2xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          )}

          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md active:scale-[0.99]"
          >
            {selectedTags.length > 0
              ? `${selectedTags.length}개 태그 적용하기`
              : '전체 보기'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

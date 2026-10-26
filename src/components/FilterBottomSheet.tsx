'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { AVAILABLE_TAGS } from '@/data/mockProducts';
import { motion } from 'framer-motion';
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0"
        onClick={() => setIsFilterSheetOpen(false)}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative z-10 w-full max-w-[430px] bg-[#FAF7F2] rounded-t-3xl shadow-2xl p-6 border-t border-stone-200"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#E14337]">
              Situation & Theme
            </div>
            <h3 className="text-base font-black text-[#18181B] tracking-tight">
              상황 & 테마 태그 필터
            </h3>
          </div>
          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="p-2 text-stone-400 hover:text-black rounded-full hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Options Grid */}
        <div className="py-5">
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200/80 hover:border-stone-400'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>#{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-200">
          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="flex items-center gap-1 px-4 py-3 rounded-xl text-xs font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          )}

          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#18181B] hover:bg-black text-[#FAF7F2] text-xs font-black transition-all shadow-xs active:scale-[0.99] tracking-tight"
          >
            {selectedTags.length > 0
              ? `${selectedTags.length}개 태그 필터 적용`
              : '전체 상품 보기'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

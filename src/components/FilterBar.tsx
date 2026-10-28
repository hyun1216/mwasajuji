'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { PRICE_CHIPS } from '@/data/mockProducts';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PriceRangeType } from '@/types/gift';

export default function FilterBar() {
  const {
    selectedPrice,
    selectedTags,
    setSelectedPrice,
    setIsFilterSheetOpen,
    resetFilters,
  } = useGiftStore();

  const isFiltered = 
    selectedPrice !== 'all' || 
    selectedTags.length > 0;

  return (
    <div className="space-y-2 pt-1">
      {/* 1. Horizontal Price Chips (전체, 모바일 예의범절용, 사회적 체면 유지용...) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 scroll-smooth">
        {PRICE_CHIPS.map((chip) => {
          const isSelected = selectedPrice === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedPrice(chip.id as PriceRangeType)}
              className={`px-3.5 py-1.5 rounded-full text-xs tracking-tight shrink-0 transition-all font-bold cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200/90 hover:border-gray-400'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* 2. Bottom Controls: Tag Sheet Trigger (상황 태그) */}
      <div className="flex items-center justify-end gap-1.5">
        {isFiltered && (
          <button
            onClick={resetFilters}
            aria-label="필터 초기화"
            className="p-1.5 rounded-full text-stone-400 hover:text-[#18181B] hover:bg-stone-200/50 transition-colors"
            title="필터 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight border transition-all ${
            selectedTags.length > 0
              ? 'bg-[#E14337] text-white border-[#E14337]'
              : 'bg-white text-stone-700 border-stone-200/90 hover:border-stone-400'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>상황 태그</span>
          {selectedTags.length > 0 && (
            <span className="w-3.5 h-3.5 rounded-full bg-white text-[#E14337] text-[9px] flex items-center justify-center font-black">
              {selectedTags.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

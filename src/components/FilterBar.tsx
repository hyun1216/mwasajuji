'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { PRICE_CHIPS } from '@/data/mockProducts';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PriceRangeType, GenderType } from '@/types/gift';

export default function FilterBar() {
  const {
    selectedPrice,
    selectedGender,
    selectedTags,
    setSelectedPrice,
    setSelectedGender,
    setIsFilterSheetOpen,
    resetFilters,
  } = useGiftStore();

  const isFiltered = 
    selectedPrice !== 'all' || 
    selectedGender !== 'all' || 
    selectedTags.length > 0;

  return (
    <div className="space-y-2.5 pt-1">
      {/* Top Controls: Gender Segment + Tag Sheet Trigger */}
      <div className="flex items-center justify-between gap-2">
        {/* Gender Segmented Control */}
        <div className="flex items-center p-0.5 bg-stone-200/60 rounded-full border border-stone-200">
          {(
            [
              { id: 'all', label: '전체' },
              { id: 'female', label: '여성용' },
              { id: 'male', label: '남성용' },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGender(g.id as GenderType)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all ${
                selectedGender === g.id
                  ? 'bg-white text-[#18181B] shadow-xs'
                  : 'text-stone-500 hover:text-[#18181B]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Right Side: Detailed Filter Button + Reset Button */}
        <div className="flex items-center gap-1.5">
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

      {/* Horizontal Price Chips with user's editorial labels */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
        {PRICE_CHIPS.map((chip) => {
          const isSelected = selectedPrice === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedPrice(chip.id as PriceRangeType)}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-tight shrink-0 transition-all ${
                isSelected
                  ? 'bg-stone-900 text-[#FAF7F2] font-black'
                  : 'bg-white text-stone-600 border border-stone-200/80 font-medium hover:border-stone-400'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

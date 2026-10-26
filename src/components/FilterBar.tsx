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
      {/* Top Filter Controls: Gender Segment + Bottom Sheet Filter Trigger */}
      <div className="flex items-center justify-between gap-2">
        {/* Gender Segmented Control */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-xl">
          {(
            [
              { id: 'all', label: '전체' },
              { id: 'female', label: '여성' },
              { id: 'male', label: '남성' },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGender(g.id as GenderType)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedGender === g.id
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Right Side: Detailed Tag Filter Button + Reset Button */}
        <div className="flex items-center gap-1.5">
          {isFiltered && (
            <button
              onClick={resetFilters}
              aria-label="필터 초기화"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              title="필터 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              selectedTags.length > 0
                ? 'bg-orange-50 border-orange-300 text-orange-600'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>상황 태그</span>
            {selectedTags.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Price Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
        {PRICE_CHIPS.map((chip) => {
          const isSelected = selectedPrice === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedPrice(chip.id as PriceRangeType)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
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

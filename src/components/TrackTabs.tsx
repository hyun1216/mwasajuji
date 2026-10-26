'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { RELATIONSHIP_CATEGORIES, THEME_CATEGORIES, SNS_CATEGORIES } from '@/data/mockProducts';

export default function TrackTabs() {
  const { 
    activeTrack, 
    selectedCategory, 
    setActiveTrack, 
    setSelectedCategory 
  } = useGiftStore();

  const categories = 
    activeTrack === 'relationship' 
      ? RELATIONSHIP_CATEGORIES 
      : activeTrack === 'theme'
      ? THEME_CATEGORIES
      : SNS_CATEGORIES;

  return (
    <div className="space-y-3.5 pt-1">
      {/* Magazine Index Style Segment */}
      <div className="flex items-center border-b border-stone-200 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveTrack('relationship')}
          className={`relative pb-2.5 px-3 text-xs font-black tracking-tight whitespace-nowrap transition-all ${
            activeTrack === 'relationship'
              ? 'text-[#18181B]'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <span>누구 줄까?</span>
          {activeTrack === 'relationship' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18181B]" />
          )}
        </button>

        <button
          onClick={() => setActiveTrack('theme')}
          className={`relative pb-2.5 px-3 text-xs font-black tracking-tight whitespace-nowrap transition-all ${
            activeTrack === 'theme'
              ? 'text-[#18181B]'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <span>무슨 날이야?</span>
          {activeTrack === 'theme' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18181B]" />
          )}
        </button>

        <button
          onClick={() => setActiveTrack('sns_hot')}
          className={`relative pb-2.5 px-3 text-xs font-black tracking-tight whitespace-nowrap transition-all ${
            activeTrack === 'sns_hot'
              ? 'text-[#18181B]'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>요즘 핫한 거</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E14337] animate-pulse" />
          </span>
          {activeTrack === 'sns_hot' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18181B]" />
          )}
        </button>
      </div>

      {/* Horizontal Editorial Sub-Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 scroll-smooth">
        {/* '전체보기' Chip */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200/80 hover:border-stone-400'
          }`}
        >
          ALL
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200/80 hover:border-stone-400'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

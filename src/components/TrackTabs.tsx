'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { RELATIONSHIP_CATEGORIES, THEME_CATEGORIES } from '@/data/mockProducts';
import { Users, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackTabs() {
  const { 
    activeTrack, 
    selectedCategory, 
    setActiveTrack, 
    setSelectedCategory 
  } = useGiftStore();

  const categories = activeTrack === 'relationship' 
    ? RELATIONSHIP_CATEGORIES 
    : THEME_CATEGORIES;

  return (
    <div className="space-y-3 pt-1">
      {/* 2-Track Main Switcher */}
      <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-2xl">
        <button
          onClick={() => setActiveTrack('relationship')}
          className={`relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTrack === 'relationship'
              ? 'text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          {activeTrack === 'relationship' && (
            <motion.div
              layoutId="trackTab"
              className="absolute inset-0 bg-white rounded-xl shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-orange-500" />
            <span>관계 중심 (시그니처)</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTrack('theme')}
          className={`relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTrack === 'theme'
              ? 'text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          {activeTrack === 'theme' && (
            <motion.div
              layoutId="trackTab"
              className="absolute inset-0 bg-white rounded-xl shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rose-500" />
            <span>이벤트/기념일 중심</span>
          </span>
        </button>
      </div>

      {/* Horizontal Sub-Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 scroll-smooth">
        {/* '전체' Chip */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
            selectedCategory === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          전체보기
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
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

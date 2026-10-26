'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, clearSearchQuery } = useGiftStore();

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3.5 text-stone-400 pointer-events-none" />
        <input
          id="main-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="선물 이름, 팩폭 코멘트 검색 (예: 립밤, 머그컵, 집들이)"
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200/90 rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#18181B] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearchQuery}
            aria-label="검색어 지우기"
            className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

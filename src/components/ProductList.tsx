'use client';

import { useMemo } from 'react';
import { useGiftStore } from '@/store/useGiftStore';
import ProductCard from './ProductCard';
import { RotateCcw, Sparkles } from 'lucide-react';

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-xs animate-pulse space-y-2.5">
      {/* Compact Height Skeleton Image */}
      <div className="h-[175px] sm:h-[195px] w-full bg-stone-100 rounded-2xl" />
      {/* Skeleton Body */}
      <div className="space-y-2 pt-0.5">
        <div className="w-full h-8 bg-stone-100 rounded-2xl" />
        <div className="w-20 h-3 bg-stone-100 rounded-full" />
        <div className="w-4/5 h-4 bg-stone-200 rounded-md" />
        <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
          <div className="w-24 h-5 bg-stone-200 rounded-md" />
          <div className="flex gap-1.5">
            <div className="w-8 h-7 bg-stone-100 rounded-xl" />
            <div className="w-20 h-7 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const {
    products,
    isLoading,
    activeTrack,
    selectedCategory,
    selectedPrice,
    selectedGender,
    selectedTags,
    searchQuery,
    clearSearchQuery,
    resetFilters,
  } = useGiftStore();

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 0. Search Query filter (matches product title/name, editorComment, brand, tags)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = item.name.toLowerCase().includes(query);
        const matchComment = item.editorComment.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchTitle && !matchComment && !matchBrand && !matchTags) {
          return false;
        }
      } else {
        // 1. Track filter
        if (item.track !== activeTrack) {
          return false;
        }

        // 2. Main Category filter
        if (selectedCategory !== 'all' && item.mainCategory !== selectedCategory) {
          return false;
        }
      }

      // 3. Price filter
      if (selectedPrice !== 'all') {
        if (selectedPrice === 'under_10k' && item.price >= 10000) return false;
        if (selectedPrice === '20k_30k' && (item.price < 10000 || item.price >= 40000)) return false;
        if (selectedPrice === '40k_50k' && (item.price < 40000 || item.price >= 70000)) return false;
        if (selectedPrice === 'over_100k' && item.price < 70000) return false;
      }

      // 4. Gender filter
      if (selectedGender !== 'all' && item.gender !== 'all' && item.gender !== selectedGender) {
        return false;
      }

      // 5. Situation Tags
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some((tag) => item.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [products, activeTrack, selectedCategory, selectedPrice, selectedGender, selectedTags, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between px-1 border-b border-stone-200/80 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              loading archive...
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400 animate-pulse">
            <Sparkles className="w-3 h-3 text-[#E14337]" />
            <span>DB 연결 중</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </div>
    );
  }

  const isSearching = Boolean(searchQuery.trim());

  return (
    <div className="space-y-3 pb-24">
      {/* Magazine Editorial Count Header */}
      <div className="flex items-center justify-between px-1 border-b border-stone-200/80 pb-2">
        {isSearching ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#E14337]">
              &apos;{searchQuery.trim()}&apos;
            </span>
            <span className="text-xs font-bold text-stone-700">
              검색 결과 ({filteredProducts.length}개)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              curated items
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="text-xs font-black text-[#18181B]">
              {filteredProducts.length}
            </span>
          </div>
        )}

        {isSearching ? (
          <button
            onClick={clearSearchQuery}
            className="text-[11px] font-bold text-stone-500 hover:text-black underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>검색 초기화</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500">
            <Sparkles className="w-3 h-3 text-[#E14337]" />
            <span>실패 확률 0% 보장 큐레이션</span>
          </div>
        )}
      </div>

      {/* 1-column layout: Spacious & Full Title Visibility */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-3.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center rounded-2xl bg-white border border-dashed border-stone-300">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400 font-black text-sm">
            ?
          </div>
          <h4 className="text-sm font-black text-[#18181B] tracking-tight">
            {isSearching
              ? `'${searchQuery.trim()}' 검색 결과가 없습니다`
              : '매칭되는 선물이 없습니다'}
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-[260px] mx-auto tracking-tight leading-relaxed">
            {isSearching
              ? '상품명이나 에디터 팩폭 코멘트에 포함된 다른 단어로 검색해 보세요.'
              : '필터 조건을 조금만 더 가볍게 설정해보세요.'}
          </p>
          <button
            onClick={isSearching ? clearSearchQuery : resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18181B] text-[#FAF7F2] text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSearching ? '검색어 지우고 전체 보기' : '필터 전체 초기화'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useGiftStore } from '@/store/useGiftStore';
import ProductCard from './ProductCard';
import { RotateCcw, Sparkles } from 'lucide-react';

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/70 shadow-xs animate-pulse">
      {/* 16:9 Skeleton Image */}
      <div className="aspect-[16/9] w-full bg-stone-200" />
      {/* Skeleton Body */}
      <div className="p-3.5 pt-2.5 space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-3 bg-stone-200 rounded-sm" />
          <div className="w-48 h-3 bg-stone-100 rounded-sm" />
        </div>
        <div className="w-12 h-2.5 bg-stone-100 rounded-sm" />
        <div className="w-3/4 h-4 bg-stone-200 rounded-sm" />
        <div className="w-24 h-5 bg-stone-200 rounded-sm pt-1" />
        <div className="pt-2 border-t border-stone-100 flex gap-2">
          <div className="w-8 h-7 bg-stone-100 rounded-lg" />
          <div className="flex-1 h-7 bg-stone-200 rounded-lg" />
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
    resetFilters,
  } = useGiftStore();

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Track filter
      if (item.track !== activeTrack) {
        return false;
      }

      // 2. Main Category filter
      if (selectedCategory !== 'all' && item.mainCategory !== selectedCategory) {
        return false;
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
  }, [products, activeTrack, selectedCategory, selectedPrice, selectedGender, selectedTags]);

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

  return (
    <div className="space-y-3 pb-24">
      {/* Magazine Editorial Count Header */}
      <div className="flex items-center justify-between px-1 border-b border-stone-200/80 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
            curated items
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="text-xs font-black text-[#18181B]">
            {filteredProducts.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500">
          <Sparkles className="w-3 h-3 text-[#E14337]" />
          <span>실패 확률 0% 보장 큐레이션</span>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-3.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 px-6 text-center rounded-2xl bg-white border border-dashed border-stone-300">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400 font-black text-sm">
            ?
          </div>
          <h4 className="text-sm font-black text-[#18181B] tracking-tight">
            매칭되는 선물이 없습니다
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-[220px] mx-auto tracking-tight">
            필터 조건을 조금만 더 가볍게 설정해보세요.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18181B] text-[#FAF7F2] text-xs font-bold shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>필터 전체 초기화</span>
          </button>
        </div>
      )}
    </div>
  );
}

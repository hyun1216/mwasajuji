'use client';

import { useMemo } from 'react';
import { useGiftStore } from '@/store/useGiftStore';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import ProductCard from './ProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';

export default function ProductList() {
  const {
    activeTrack,
    selectedCategory,
    selectedPrice,
    selectedGender,
    selectedTags,
    resetFilters,
  } = useGiftStore();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((item) => {
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
        if (selectedPrice === 'under_10k' && item.price > 20000) return false;
        if (selectedPrice === '20k_30k' && (item.price < 20000 || item.price > 39999)) return false;
        if (selectedPrice === '40k_50k' && (item.price < 40000 || item.price > 69999)) return false;
        if (selectedPrice === 'over_100k' && item.price < 70000) return false;
      }

      // 4. Gender filter
      if (selectedGender !== 'all' && item.gender !== 'all' && item.gender !== selectedGender) {
        return false;
      }

      // 5. Situation Tags (AND or OR matching: item must have at least one of selected tags)
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some((tag) => item.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [activeTrack, selectedCategory, selectedPrice, selectedGender, selectedTags]);

  return (
    <div className="space-y-3.5 pb-20">
      {/* List Header Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-zinc-500">
          총 <strong className="text-zinc-900 font-extrabold">{filteredProducts.length}</strong>개의 큐레이션 선물
        </span>
        <span className="text-[11px] text-zinc-400">
          에디터 검증 완료
        </span>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center rounded-3xl bg-zinc-50 border border-dashed border-zinc-200">
          <PackageOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-zinc-800">
            조건에 맞는 선물이 없어요!
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-[220px] mx-auto">
            가격대나 상세 태그 조건을 조금 더 넓혀보세요.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>필터 조건 초기화</span>
          </button>
        </div>
      )}
    </div>
  );
}

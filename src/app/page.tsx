'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TrackTabs from '@/components/TrackTabs';
import FilterBar from '@/components/FilterBar';
import FilterBottomSheet from '@/components/FilterBottomSheet';
import ProductList from '@/components/ProductList';
import LikedDrawer from '@/components/LikedDrawer';
import ScrollToTop from '@/components/ScrollToTop';
import BurdenModal from '@/components/BurdenModal';
import SearchBar from '@/components/SearchBar';
import { useGiftStore } from '@/store/useGiftStore';

export default function Home() {
  const [isLikedOpen, setIsLikedOpen] = useState(false);
  const { loadProducts } = useGiftStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 Supabase 'products' 테이블에서 데이터 페칭
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="flex-1 flex flex-col bg-[#F9F8F6]">
      {/* 1. Header */}
      <Header onOpenLiked={() => setIsLikedOpen(true)} />

      {/* 2. Main Content Body */}
      <main className="flex-1 px-4 pt-3 space-y-4">
        {/* Search Bar */}
        <section aria-label="선물 검색">
          <SearchBar />
        </section>

        {/* Editorial Sub Title */}
        <section aria-label="선물 카테고리">
          <div className="flex items-center justify-between mb-1 px-0.5">
            <span className="text-[10px] font-black tracking-widest uppercase text-stone-400">
              ARCHIVE 2026
            </span>
            <span className="text-[11px] font-bold text-[#E14337] tracking-tight">
              실시간 큐레이션 ON
            </span>
          </div>
          <TrackTabs />
        </section>

        {/* Filtering Options: Price Chips, Gender, Tags */}
        <section aria-label="필터 옵션">
          <FilterBar />
        </section>

        {/* Product Cards List */}
        <section aria-label="선물 목록">
          <ProductList />
        </section>
      </main>

      {/* 3. Editorial Footer */}
      <footer className="py-8 px-5 bg-[#FAF7F2] border-t border-stone-200/80 text-center text-stone-400 text-[11px] space-y-2.5">
        <div className="font-black text-sm tracking-tighter text-[#18181B] lowercase">
          뭐사주지<span className="text-[#E14337]">.</span>
        </div>
        <p className="text-stone-500 font-medium">선 넘지 않는 선물 큐레이션 가이드</p>
        
        {/* 경제적 이해관계 표시 (공정위 권고 고지 문구) */}
        <div className="py-2.5 px-3.5 rounded-xl bg-stone-100/90 border border-stone-200 text-stone-500 text-[10px] leading-relaxed break-keep max-w-[380px] mx-auto text-center font-medium">
          이 포스팅은 선물하기 큐레이터 활동의 일환으로, 주문 발생 시 일정액의 수수료를 제공받습니다.
        </div>

        <p className="text-[10px] text-stone-400 font-mono tracking-wider pt-1">
          MWASAJUJI © 2026. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* Overlays / Modals */}
      <FilterBottomSheet />

      <LikedDrawer
        isOpen={isLikedOpen}
        onClose={() => setIsLikedOpen(false)}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />

      {/* Burden Index Philosophy Modal */}
      <BurdenModal />
    </div>
  );
}

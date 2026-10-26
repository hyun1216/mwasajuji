'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TrackTabs from '@/components/TrackTabs';
import FilterBar from '@/components/FilterBar';
import FilterBottomSheet from '@/components/FilterBottomSheet';
import ProductList from '@/components/ProductList';
import LikedDrawer from '@/components/LikedDrawer';

export default function Home() {
  const [isLikedOpen, setIsLikedOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Header */}
      <Header onOpenLiked={() => setIsLikedOpen(true)} />

      {/* 2. Main Content Body */}
      <main className="flex-1 px-4 pt-4 space-y-6">
        {/* 2-Track & Sub Category Selector */}
        <section aria-label="선물 카테고리">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <h2 className="text-sm font-extrabold text-zinc-900 tracking-tight">
              맞춤 큐레이션 탐색
            </h2>
            <span className="text-[11px] text-zinc-400 font-medium">
              모바일 원터치 조작
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

      {/* 3. Footer */}
      <footer className="py-6 px-4 bg-zinc-50 border-t border-zinc-100 text-center text-zinc-400 text-[11px] space-y-1">
        <p className="font-semibold text-zinc-600">모사주지 (mwasajuji) - 선물 고민 끝!</p>
        <p>실제 사용자의 고민 흐름에 맞춘 큐레이션 플랫폼</p>
      </footer>

      {/* Overlays / Modals */}
      <FilterBottomSheet />

      <LikedDrawer
        isOpen={isLikedOpen}
        onClose={() => setIsLikedOpen(false)}
      />
    </div>
  );
}

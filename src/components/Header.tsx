'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, Share2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenLiked: () => void;
}

export default function Header({ onOpenLiked }: HeaderProps) {
  const { likedIds } = useGiftStore();
  const { showToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFocusSearch = () => {
    const input = document.getElementById('main-search-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleShareService = async () => {
    if (typeof window === 'undefined') return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '뭐사주지 - 선 넘지 않는 선물 큐레이션',
          text: '센스 있는 선물 큐레이션. 1초 만에 찜하고 카톡으로 툭 던지기!',
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('링크가 복사되었습니다! 🎁', 'success');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 transition-all">
      <div className="flex items-center justify-between">
        {/* Editorial Logo */}
        <Link href="/" className="flex items-end gap-2 sm:gap-2.5 group">
          <Image
            src="/logo.png"
            alt="뭐사주지"
            width={2172}
            height={724}
            priority
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 tracking-tight pb-0.5 select-none whitespace-nowrap">
            선 넘지 않는 선물 큐레이션
          </span>
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFocusSearch}
            aria-label="선물 검색하기"
            className="p-2.5 rounded-full text-stone-700 hover:text-black hover:bg-stone-200/50 active:scale-95 transition-all cursor-pointer"
            title="검색"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>

          <button
            onClick={handleShareService}
            aria-label="공유하기"
            className="p-2.5 rounded-full text-stone-700 hover:text-black hover:bg-stone-200/50 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 stroke-[2.2]" />
          </button>

          <button
            onClick={onOpenLiked}
            aria-label="찜한 선물 보기"
            className="relative p-2.5 rounded-full text-stone-700 hover:text-black hover:bg-stone-200/50 active:scale-95 transition-all"
          >
            <Heart
              className={`w-4 h-4 stroke-[2.2] ${
                mounted && likedIds.length > 0
                  ? 'text-[#E14337] fill-[#E14337]'
                  : ''
              }`}
            />
            {mounted && likedIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 bg-[#E14337] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {likedIds.length > 99 ? '99+' : likedIds.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

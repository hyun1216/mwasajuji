'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
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
    <header className="sticky top-0 z-30 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-stone-200/70 px-5 py-4 transition-all">
      <div className="flex items-center justify-between">
        {/* Editorial Logo */}
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter text-[#18181B] font-sans lowercase select-none">
              뭐사주지<span className="text-[#E14337]">.</span>
            </span>
            <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 uppercase bg-[#18181B] text-[#FAF7F2] rounded-xs">
              issue #01
            </span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 tracking-tight mt-0.5">
            선 넘지 않는 선물 큐레이션
          </span>
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShareService}
            aria-label="공유하기"
            className="p-2.5 rounded-full text-stone-700 hover:text-black hover:bg-stone-200/50 active:scale-95 transition-all"
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

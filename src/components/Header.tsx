'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, Share2, Sparkles } from 'lucide-react';
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
          title: '모사주지 - 모바일 특화 선물 큐레이션',
          text: '관계와 부담 지수로 찾는 실패 없는 선물 추천 서비스!',
          url: window.location.href,
        });
        showToast('서비스 링크가 공유되었습니다!', 'success');
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('링크가 클립보드에 복사되었습니다! 🎁', 'success');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-zinc-100 px-4 py-3.5 transition-all">
      <div className="flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 font-sans">
                모사주지
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium -mt-0.5">
              관계와 부담 지수로 찾는 선물 큐레이션
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShareService}
            aria-label="공유하기"
            className="p-2.5 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenLiked}
            aria-label="찜한 선물 보기"
            className="relative p-2.5 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <Heart className={`w-5 h-5 ${mounted && likedIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {mounted && likedIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {likedIds.length > 99 ? '99+' : likedIds.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

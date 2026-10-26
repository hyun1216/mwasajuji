'use client';

import { ProductItem } from '@/types/gift';
import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, ArrowUpRight, Share2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleLike, isLiked, setIsBurdenModalOpen } = useGiftStore();
  const { showToast } = useToastStore();
  const liked = isLiked(product.id);

  // Discount percentage calculation
  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleToggleLike = () => {
    toggleLike(product.id);
    showToast(
      liked ? '찜 목록에서 제외되었습니다.' : '위시리스트에 저장되었습니다 🖤',
      'info'
    );
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `[뭐사주지] ${product.name}`,
          text: `"${product.editorComment}"\n가격: ${product.price.toLocaleString()}원`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `[뭐사주지 픽] ${product.name} (${product.price.toLocaleString()}원)\n💬 ${product.editorComment}\n${window.location.href}`
      );
      showToast('추천 링크가 복사되었습니다! 🎁', 'success');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden border border-stone-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between group transition-shadow hover:shadow-md"
    >
      <div>
        {/* 1. Slim Wide Aspect (16:9) Image Container */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 430px) 100vw, 400px"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Compact Sticker Badge (Clickable to open BurdenModal) */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsBurdenModalOpen(true);
              }}
              title="부담지수란? 클릭하여 알아보기"
              className="rotate-[-2deg] px-2 py-0.5 bg-[#FAF7F2] hover:bg-white text-[#18181B] text-[10px] font-black border border-[#18181B] shadow-[1.5px_2px_0px_#18181B] tracking-tight flex items-center gap-1 active:scale-95 transition-all cursor-pointer group/badge"
            >
              <span>{product.burdenBadgeText}</span>
              <span className="w-3 h-3 rounded-full bg-stone-200/90 group-hover/badge:bg-[#18181B] group-hover/badge:text-white flex items-center justify-center text-[8px] font-bold text-stone-600 transition-colors">
                ?
              </span>
            </button>
          </div>

          {/* Slim Floating Wish Heart Button */}
          <button
            onClick={handleToggleLike}
            aria-label="위시리스트 추가"
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-xs ${
              liked
                ? 'bg-[#E14337] text-white'
                : 'bg-white/90 text-stone-600 hover:text-black hover:bg-white'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 stroke-[2.2] ${liked ? 'fill-white' : ''}`}
            />
          </button>
        </div>

        {/* 2. Compact Body Area (p-3.5 pt-3) */}
        <div className="p-3.5 pt-2.5">
          {/* 에디터 팩폭 한마디 (전체 노출) */}
          <div className="mb-1.5 flex items-start gap-1.5">
            <span className="text-[10px] font-black text-[#E14337] tracking-tight shrink-0 mt-0.5">
              [에디터 팩폭]
            </span>
            <p className="text-[11px] font-medium text-stone-600 tracking-tight leading-relaxed break-keep">
              {product.editorComment}
            </p>
          </div>

          {/* Brand & Product Name */}
          <div className="mb-1.5">
            <span className="text-[9px] font-black tracking-wider text-stone-400 uppercase block">
              {product.brand}
            </span>
            <h3 className="text-xs font-bold text-[#18181B] leading-snug tracking-tight truncate">
              {product.name}
            </h3>
          </div>

          {/* Price Typography */}
          <div className="flex items-baseline gap-1.5 mb-2.5">
            {discountRate && discountRate > 0 && (
              <span className="text-sm font-black text-[#E14337] tracking-tight">
                {discountRate}%
              </span>
            )}
            <span className="text-base font-black text-[#18181B] tracking-tight">
              {product.price.toLocaleString()}
              <span className="text-[11px] font-bold ml-0.5">원</span>
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through tracking-tight">
                {product.originalPrice.toLocaleString()}원
              </span>
            )}
          </div>

          {/* 3. Action Bar */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
            <button
              onClick={handleShare}
              aria-label="공유하기"
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-black hover:bg-stone-50 active:scale-95 transition-all"
              title="공유하기"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2]" />
            </button>

            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-[#18181B] hover:bg-black text-[#FAF7F2] text-[11px] font-bold flex items-center justify-center gap-1 active:scale-[0.99] transition-all tracking-tight"
            >
              <span>선물하러 가기</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </a>
          </div>

          {/* 경제적 이해관계 고지 (공정위 권고 캡션) */}
          <p className="text-[9px] text-stone-400 text-center tracking-tight pt-1.5 leading-none">
            이 포스팅은 선물하기 큐레이터 활동의 일환으로, 주문 발생 시 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      </div>
    </motion.article>
  );
}

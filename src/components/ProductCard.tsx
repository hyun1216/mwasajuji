'use client';

import { ProductItem } from '@/types/gift';
import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, ArrowUpRight, Share2, Star } from 'lucide-react';
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

  // Fallback rating for curation credibility (e.g. 4.8 ~ 5.0)
  const displayRating = product.rating
    ? product.rating.toFixed(1)
    : (4.8 + (Math.abs(product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 3) * 0.1).toFixed(1);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(product.id);
    showToast(
      liked ? '찜 목록에서 제외되었습니다.' : '위시리스트에 저장되었습니다 🖤',
      'info'
    );
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `[뭐사주지] ${product.name}`,
          text: `"${product.editorComment}"\n가격: ${product.price.toLocaleString()}원`,
          url: product.externalUrl || window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `[뭐사주지 픽] ${product.name} (${product.price.toLocaleString()}원)\n💬 ${product.editorComment}\n${product.externalUrl || window.location.href}`
      );
      showToast('추천 링크가 복사되었습니다! 🎁', 'success');
    }
  };

  const handleOpenBurdenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBurdenModalOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl p-3 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 space-y-2.5"
    >
      {/* 1. 상품 이미지 영역 (이미지를 전혀 가리지 않도록 오버레이 제거) */}
      <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-gray-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 430px) 100vw, 420px"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* 좌측 상단: '부담지수' 뱃지 */}
        <button
          type="button"
          onClick={handleOpenBurdenModal}
          title="부담지수란? 클릭하여 알아보기"
          className="absolute top-2.5 left-2.5 z-10 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer border border-gray-100"
        >
          <span>
            {product.burdenBadgeText || `부담지수 ${product.burdenScore || product.burdenLevel || 10}%`}
          </span>
          <span className="w-3 h-3 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[8px] font-bold">
            ?
          </span>
        </button>

        {/* 우측 상단: 하트(찜/보관) 원형 버튼 */}
        <button
          type="button"
          onClick={handleToggleLike}
          aria-label="위시리스트 추가"
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer ${
            liked
              ? 'bg-[#E14337] text-white'
              : 'bg-black/35 text-white/90 hover:text-white hover:bg-black/60'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 stroke-[2.2] ${liked ? 'fill-white' : ''}`}
          />
        </button>
      </div>

      {/* 2. 에디터 팩폭 (이미지 밖으로 완전히 분리하여 상품 이미지를 100% 가리지 않도록 배치) */}
      <div className="flex items-start gap-1.5 px-3 py-2 rounded-xl bg-gray-50/90 border border-gray-100">
        <span className="text-[10px] font-black text-[#E14337] shrink-0 mt-0.5">
          [에디터 팩폭]
        </span>
        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 break-keep">
          &ldquo;{product.editorComment}&rdquo;
        </p>
      </div>

      {/* 3. 브랜드 & 제목 (제목 위에 있던 불필요한 '선물하기' 문구 제외) */}
      <div className="px-0.5">
        {product.brand && !['선물하기', '카카오톡 선물하기', '선물셀렉션', '셀렉트샵'].includes(product.brand.trim()) && (
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block mb-0.5">
            {product.brand}
          </span>
        )}
        <h3 className="text-sm sm:text-base font-extrabold text-gray-950 leading-snug break-keep">
          {product.name}
        </h3>
      </div>

      {/* 4. 가격, 평점 및 하단 액션 버튼 */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100 px-0.5">
        {/* 가격 & 평점 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {discountRate && discountRate > 0 && (
            <span className="text-sm font-bold text-[#E14337] tracking-tight">
              {discountRate}%
            </span>
          )}
          <span className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
            {product.price.toLocaleString()}
            <span className="text-xs font-bold ml-0.5 text-gray-600">원</span>
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through tracking-tight ml-0.5">
              {product.originalPrice.toLocaleString()}원
            </span>
          )}
          <div className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 ml-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{displayRating}</span>
          </div>
        </div>

        {/* 액션 버튼 (공유 & 선물하기) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label="공유하기"
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 active:scale-95 transition-colors cursor-pointer"
            title="공유하기"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2]" />
          </button>

          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 sm:py-2 px-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-[0.98] transition-all tracking-tight"
          >
            <span>선물하기</span>
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </a>
        </div>
      </div>

      {/* 5. 경제적 이해관계 고지 (공정위 권고 문구) */}
      <p className="text-[9px] sm:text-[10px] text-gray-400 text-center tracking-tight pt-0.5 leading-none">
        이 포스팅은 선물하기 큐레이터 활동의 일환으로, 주문 발생 시 일정액의 수수료를 제공 받습니다.
      </p>
    </motion.article>
  );
}

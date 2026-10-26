'use client';

import { ProductItem } from '@/types/gift';
import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { Heart, ExternalLink, Share2, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleLike, isLiked } = useGiftStore();
  const { showToast } = useToastStore();
  const liked = isLiked(product.id);

  // Discount percentage calculation
  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Burden badge style based on score
  const isHighBurden = product.burdenScore >= 30;

  const handleToggleLike = () => {
    toggleLike(product.id);
    showToast(
      liked ? '찜 목록에서 제외되었습니다.' : '찜 목록에 추가되었습니다! ❤️',
      'info'
    );
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `[모사주지] ${product.name}`,
          text: `에디터 픽: "${product.editorComment}"\n가격: ${product.price.toLocaleString()}원`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `[모사주지] ${product.name} (${product.price.toLocaleString()}원)\n💬 ${product.editorComment}\n${window.location.href}`
      );
      showToast('상품 추천 정보가 복사되었습니다! 🎁', 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-4 border border-zinc-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top: 1:1 Image with Overlays */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 mb-3.5 group">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 430px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Burden Score Badge (Differentiator) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm ${
                isHighBurden
                  ? 'bg-rose-500/90 text-white border border-rose-300/30'
                  : 'bg-zinc-900/80 text-amber-300 border border-white/20'
              }`}
            >
              {isHighBurden ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-200" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="truncate max-w-[210px]">{product.burdenBadgeText}</span>
            </div>
          </div>

          {/* Floating Like Button */}
          <button
            onClick={handleToggleLike}
            aria-label="찜하기"
            className={`absolute bottom-2.5 right-2.5 p-2.5 rounded-full backdrop-blur-md border shadow-md transition-all active:scale-90 ${
              liked
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-white/90 text-zinc-600 border-white/50 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Brand & Title */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span>{product.brand}</span>
            <div className="flex gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[10px] font-medium text-zinc-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          {discountRate && discountRate > 0 && (
            <span className="text-base font-extrabold text-rose-500">
              {discountRate}%
            </span>
          )}
          <span className="text-lg font-extrabold text-zinc-900">
            {product.price.toLocaleString()}원
          </span>
          {product.originalPrice && (
            <span className="text-xs text-zinc-400 line-through">
              {product.originalPrice.toLocaleString()}원
            </span>
          )}
        </div>

        {/* Editor Comment Quote (Curated comment) */}
        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80 text-[12px] text-zinc-700 leading-relaxed font-medium mb-4">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>에디터 큐레이션 코멘트</span>
          </div>
          <p className="italic text-zinc-600">
            &ldquo;{product.editorComment}&rdquo;
          </p>
        </div>
      </div>

      {/* Action Buttons: Buy Link & Share */}
      <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
        <button
          onClick={handleShare}
          aria-label="카카오톡/링크 공유"
          className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 active:scale-95 transition-all"
          title="공유하기"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-sm"
        >
          <span>선물하러 가기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

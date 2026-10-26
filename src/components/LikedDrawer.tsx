'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { motion } from 'framer-motion';
import { X, Heart, ArrowUpRight, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface LikedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LikedDrawer({ isOpen, onClose }: LikedDrawerProps) {
  const { likedIds, products, toggleLike } = useGiftStore();

  if (!isOpen) return null;

  const likedProducts = products.filter((item) =>
    likedIds.includes(item.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative z-10 w-full max-w-[430px] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[85vh] flex flex-col border-t sm:border border-stone-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#18181B] text-[#FAF7F2] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#18181B] tracking-tight">
                위시리스트 ({likedProducts.length})
              </h3>
              <p className="text-[11px] text-stone-500">
                선물할 때 꺼내보는 프라이빗 보관함
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-black rounded-full hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {likedProducts.length > 0 ? (
            likedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200/70 shadow-xs"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black tracking-wider text-stone-400 uppercase">
                    {product.brand}
                  </span>
                  <h4 className="text-sm font-bold text-[#18181B] line-clamp-1 tracking-tight">
                    {product.name}
                  </h4>
                  <div className="text-xs font-black text-[#E14337] mt-0.5 tracking-tight">
                    {product.price.toLocaleString()}원
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#18181B] text-[#FAF7F2] hover:bg-black"
                    title="선물하러 가기"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="p-2 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-[#E14337]"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <Heart className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-600">
                저장된 선물이 없습니다
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                마음에 드는 선물의 하트를 탭해보세요.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

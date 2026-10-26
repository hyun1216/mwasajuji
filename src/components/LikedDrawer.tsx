'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ExternalLink, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface LikedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LikedDrawer({ isOpen, onClose }: LikedDrawerProps) {
  const { likedIds, toggleLike } = useGiftStore();

  if (!isOpen) return null;

  const likedProducts = MOCK_PRODUCTS.filter((item) =>
    likedIds.includes(item.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                내가 찜한 선물 ({likedProducts.length})
              </h3>
              <p className="text-xs text-zinc-400">
                기억해두고 선물할 때 바로 꺼내보세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {likedProducts.length > 0 ? (
            likedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/80 transition-all"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-xs font-extrabold text-orange-500 mt-0.5">
                    {product.price.toLocaleString()}원
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    title="구매하러 가기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="p-2 rounded-xl bg-white border border-zinc-200 text-rose-500 hover:bg-rose-50"
                    title="찜 취소"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-14 text-center">
              <Heart className="w-10 h-10 text-zinc-200 mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-500">
                아직 찜한 선물이 없어요!
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                마음에 드는 선물의 하트 버튼을 눌러보세요.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

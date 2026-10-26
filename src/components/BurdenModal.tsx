'use client';

import { useGiftStore } from '@/store/useGiftStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Sparkles, Check } from 'lucide-react';

const BURDEN_LEVELS = [
  {
    range: '5% ~ 10%',
    priceText: '1만원 미만',
    emoji: '☕',
    title: '가벼운 한 입 품앗이',
    desc: '커피나 간식급. 나중에 굳이 비싼 걸로 되갚지 않아도 양심의 가책 0%인 안전지대!',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    range: '15% ~ 30%',
    priceText: '1만 ~ 3만원대',
    emoji: '🎁',
    title: '생일 국룰 안전빵 품앗이',
    desc: '치킨이나 밥 한 끼 정도! 상대방도 다음 기념일에 부담 없이 기분 좋게 갚을 수 있는 골든존.',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    range: '35% ~ 50%',
    priceText: '3만 ~ 5만원대',
    emoji: '💼',
    title: '성의 가득 체면 품앗이',
    desc: '정성이 듬뿍 들어간 선물. 상대방도 다음 내 생일에 3~5만원대 예산을 장전해야 해서 살짝 긴장!',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    range: '55% ~ 70%',
    priceText: '5만 ~ 7만원대',
    emoji: '🚨',
    title: '친밀감 검증 필수 품앗이',
    desc: '어색한 사이면 부담 폭발! 상대방도 내 생일에 5만원 이상 쏠 각오가 되어 있어야 평화가 유지됩니다.',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  {
    range: '75% ~ 100%',
    priceText: '7만 ~ 10만원 이상',
    emoji: '👑',
    title: '본격 적금 품앗이 혈투',
    desc: '"너 내 생일 때 기대한다?" 상대방은 다음 내 생일에 적금 깨서 10만원권을 수표급으로 보답해야 하는 극한의 품앗이 빚더미.',
    badgeBg: 'bg-red-50 text-red-800 border-red-200',
  },
];

export default function BurdenModal() {
  const { isBurdenModalOpen, setIsBurdenModalOpen } = useGiftStore();

  if (!isBurdenModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        {/* Backdrop click to close */}
        <div 
          className="absolute inset-0"
          onClick={() => setIsBurdenModalOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-[400px] bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col justify-between"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <div className="flex items-center gap-1.5">
                <span className="p-1.5 rounded-lg bg-stone-100 text-[#E14337]">
                  <Scale className="w-4 h-4 stroke-[2.2]" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E14337] block">
                    HOW IT WORKS
                  </span>
                  <h2 className="text-sm font-black text-[#18181B] tracking-tight">
                    부담지수(품앗이 지수)란?
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setIsBurdenModalOpen(false)}
                aria-label="닫기"
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Core Philosophy Banner */}
            <div className="my-4 p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#18181B]">
                <Sparkles className="w-3.5 h-3.5 text-[#E14337]" />
                <span>"선물은 결국 돌아오는 품앗이니까!"</span>
              </div>
              <p className="text-[11px] font-medium text-stone-600 leading-relaxed break-keep">
                내가 10만원짜리를 받으면, 다음 상대방 생일에도 10만원짜리를 돌려줘야 수지타산이 맞잖아요?
              </p>
              <p className="text-[11px] font-medium text-stone-600 leading-relaxed break-keep">
                <strong className="text-[#18181B] font-bold">10만원(100%)을 기준</strong>으로, 선물을 받는 상대방이 다음에 되갚아야 할 <strong className="text-[#E14337] font-bold">심리적·경제적 품앗이 무게감</strong>을 수치화한 지표입니다.
              </p>
            </div>

            {/* Level Guide List */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block px-1">
                금액대별 품앗이 기준표
              </span>

              {BURDEN_LEVELS.map((item) => (
                <div
                  key={item.range}
                  className="p-2.5 bg-white/80 rounded-xl border border-stone-200/70 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-xs font-black text-[#18181B]">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-stone-400 font-medium">
                        {item.priceText}
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${item.badgeBg}`}
                      >
                        {item.range}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed break-keep">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={() => setIsBurdenModalOpen(false)}
            className="w-full py-3 bg-[#18181B] hover:bg-black text-[#FAF7F2] text-xs font-black rounded-xl active:scale-98 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>이해했어요! 선물 고르러 가기</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cake, 
  Home, 
  Briefcase, 
  Coffee, 
  Bath, 
  Laugh, 
  Heart, 
  Moon, 
  Dumbbell, 
  Flame, 
  Gift, 
  Crown, 
  Sparkles, 
  Feather,
  ChevronDown, 
  ChevronUp,
  Sparkle
} from 'lucide-react';
import { useGiftStore } from '@/store/useGiftStore';
import { TrackType, MainCategoryType, PriceRangeType } from '@/types/gift';

export interface CategoryNavProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
  className?: string;
}

type TabType = 'theme' | 'price' | 'all';

interface ThemeCategoryItem {
  id: string;
  label: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  track: TrackType;
  categoryId: MainCategoryType | 'all';
}

interface PriceCategoryItem {
  id: string;
  label: string;
  priceTag: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  priceValue: PriceRangeType;
  track?: TrackType;
  categoryId?: MainCategoryType | 'all';
}

const THEME_CATEGORIES: ThemeCategoryItem[] = [
  { id: 'birthday', label: '생일', emoji: '🎂', icon: Cake, track: 'relationship', categoryId: 'bestie' },
  { id: 'housewarming', label: '집들이', emoji: '🏠', icon: Home, track: 'theme', categoryId: 'housewarming' },
  { id: 'coworker', label: '직장동료', emoji: '💼', icon: Briefcase, track: 'relationship', categoryId: 'coworker' },
  { id: 'light_gift', label: '가벼운선물', emoji: '☕', icon: Coffee, track: 'theme', categoryId: 'work_life' },
  { id: 'living', label: '리빙/홈', emoji: '🛁', icon: Bath, track: 'relationship', categoryId: 'single_life' },
  { id: 'useless', label: '웃긴선물', emoji: '🤣', icon: Laugh, track: 'theme', categoryId: 'useless' },
  { id: 'couple', label: '소중한사람', emoji: '💖', icon: Heart, track: 'relationship', categoryId: 'couple' },
  { id: 'comfort', label: '힐링/위로', emoji: '🌙', icon: Moon, track: 'theme', categoryId: 'comfort' },
  { id: 'fitness', label: '운동/갓생', emoji: '💪', icon: Dumbbell, track: 'theme', categoryId: 'fitness' },
  { id: 'viral', label: '요즘핫한거', emoji: '🔥', icon: Flame, track: 'sns_hot', categoryId: 'viral' },
];

const PRICE_CATEGORIES: PriceCategoryItem[] = [
  { id: 'zero_burden', label: '호불호 0%', priceTag: '실패확률 제로', emoji: '🕊️', icon: Feather, priceValue: 'all', track: 'relationship', categoryId: 'awkward' },
  { id: 'under_10k', label: '1만원 미만', priceTag: '모바일 예의범절', emoji: '☕', icon: Coffee, priceValue: 'under_10k' },
  { id: '20k_30k', label: '1~3만원대', priceTag: '사회적 체면 유지', emoji: '🎁', icon: Gift, priceValue: '20k_30k' },
  { id: '40k_50k', label: '4~5만원대', priceTag: '친밀감 검증 완료', emoji: '✨', icon: Sparkles, priceValue: '40k_50k' },
  { id: 'over_100k', label: '10만원 이상', priceTag: 'VIP 전용', emoji: '👑', icon: Crown, priceValue: 'over_100k' },
];

export default function CategoryNav({
  selectedCategory: selectedCategoryProp,
  onSelectCategory,
  className = '',
}: CategoryNavProps) {
  const {
    activeTrack,
    selectedCategory: storeSelectedCategory,
    selectedPrice,
    setActiveTrack,
    setSelectedCategory,
    setSelectedPrice,
  } = useGiftStore();

  const [activeTab, setActiveTab] = useState<TabType>('theme');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [, startTransition] = useTransition();

  // Scroll detection with requestAnimationFrame for butter-smooth 60fps performance
  const lastScrollYRef = useRef(0);
  const isTickingRef = useRef(false);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (!isTickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollYRef.current;

          // 1. 최상단 근처 도달 시 (scrollY <= 20) -> 자동으로 시원하게 펼침
          if (currentScrollY <= 20) {
            setIsCollapsed(false);
          } 
          // 2. 아래로 스크롤 시 (scrollY > 50 & 스크롤 다운) -> 컴팩트하게 접힘
          else if (currentScrollY > 50 && diff > 8) {
            setIsCollapsed(true);
          }

          lastScrollYRef.current = currentScrollY;
          isTickingRef.current = false;
        });
        isTickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle Tab Switch
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'all') {
      startTransition(() => {
        setSelectedCategory('all');
        setSelectedPrice('all');
      });
      onSelectCategory?.('all');
    }
  };

  // Handle Theme Item Select
  const handleSelectThemeItem = (item: ThemeCategoryItem) => {
    startTransition(() => {
      setActiveTrack(item.track);
      setSelectedCategory(item.categoryId);
    });
    onSelectCategory?.(item.id);
  };

  // Handle Price Item Select
  const handleSelectPriceItem = (item: PriceCategoryItem) => {
    startTransition(() => {
      setSelectedPrice(item.priceValue);
      if (item.categoryId && item.track) {
        setActiveTrack(item.track);
        setSelectedCategory(item.categoryId);
      }
    });
    onSelectCategory?.(item.id);
  };

  // Determine current active category ID for UI highlight
  const effectiveCategory = selectedCategoryProp ?? storeSelectedCategory;

  const isThemeItemSelected = (item: ThemeCategoryItem) => {
    if (selectedCategoryProp) {
      return selectedCategoryProp === item.id;
    }
    return activeTrack === item.track && storeSelectedCategory === item.categoryId;
  };

  const isPriceItemSelected = (item: PriceCategoryItem) => {
    if (selectedCategoryProp) {
      return selectedCategoryProp === item.id;
    }
    if (item.id === 'zero_burden') {
      return storeSelectedCategory === 'awkward' && selectedPrice === 'all';
    }
    return selectedPrice === item.priceValue;
  };

  return (
    <div className={`space-y-2.5 pt-1 ${className}`}>
      {/* 1. Top Segment Navigation: [선물 테마 | 가격/부담지수 | 전체] + Collapse Toggle */}
      <div className="flex items-center justify-between gap-2">
        {/* Sliding Pill Segment Control */}
        <div className="flex-1 relative flex items-center p-1 bg-stone-100/90 rounded-2xl border border-stone-200/60 shadow-xs">
          {/* Tab 1: 선물 테마 */}
          <button
            type="button"
            onClick={() => handleTabChange('theme')}
            className={`relative flex-1 py-1.5 px-2 rounded-xl text-xs font-black tracking-tight text-center transition-colors cursor-pointer z-10 ${
              activeTab === 'theme' ? 'text-[#18181B]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {activeTab === 'theme' && (
              <motion.div
                layoutId="categoryNavActivePill"
                className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="flex items-center justify-center gap-1">
              <span>🎁</span>
              <span>선물 테마</span>
            </span>
          </button>

          {/* Tab 2: 가격/부담지수 */}
          <button
            type="button"
            onClick={() => handleTabChange('price')}
            className={`relative flex-1 py-1.5 px-2 rounded-xl text-xs font-black tracking-tight text-center transition-colors cursor-pointer z-10 ${
              activeTab === 'price' ? 'text-[#18181B]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {activeTab === 'price' && (
              <motion.div
                layoutId="categoryNavActivePill"
                className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="flex items-center justify-center gap-1">
              <span>🏷️</span>
              <span>가격/부담지수</span>
            </span>
          </button>

          {/* Tab 3: 전체 */}
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`relative flex-1 py-1.5 px-2 rounded-xl text-xs font-black tracking-tight text-center transition-colors cursor-pointer z-10 ${
              activeTab === 'all' ? 'text-[#18181B]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {activeTab === 'all' && (
              <motion.div
                layoutId="categoryNavActivePill"
                className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="flex items-center justify-center gap-1">
              <Sparkle className="w-3 h-3 text-[#E14337] fill-[#E14337]" />
              <span>전체</span>
            </span>
          </button>
        </div>

        {/* Cute Manual Toggle Button (ChevronUp / ChevronDown) */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? '카테고리 목록 펼치기' : '카테고리 목록 접기'}
          title={isCollapsed ? '카테고리 펼치기' : '카테고리 접기'}
          className="w-8 h-8 shrink-0 rounded-2xl flex items-center justify-center bg-stone-100 hover:bg-stone-200/80 text-stone-500 hover:text-stone-900 border border-stone-200/60 transition-all active:scale-95 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-stone-600 transition-transform duration-200" />
          ) : (
            <ChevronUp className="w-4 h-4 text-stone-600 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* 2. Interactive Category Container with Smooth Expand/Collapse Animation */}
      <AnimatePresence initial={false} mode="wait">
        {isCollapsed ? (
          /* ========================================================= */
          /* Collapsed View: Compact 1-Row Horizontal Scroll Chips     */
          /* ========================================================= */
          <motion.div
            key="collapsed-row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 scroll-smooth">
              {/* 'ALL' Chip */}
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setSelectedCategory('all');
                    setSelectedPrice('all');
                  });
                  onSelectCategory?.('all');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  effectiveCategory === 'all' && selectedPrice === 'all'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/70'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#E14337]" />
                <span>ALL 전체</span>
              </button>

              {activeTab === 'theme' || activeTab === 'all'
                ? THEME_CATEGORIES.map((cat) => {
                    const isSelected = isThemeItemSelected(cat);
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectThemeItem(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#18181B] text-white shadow-xs scale-[1.02]'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/70'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E14337]' : 'text-stone-500'}`} />
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })
                : PRICE_CATEGORIES.map((p) => {
                    const isSelected = isPriceItemSelected(p);
                    const IconComponent = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPriceItem(p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#18181B] text-white shadow-xs scale-[1.02]'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/70'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E14337]' : 'text-stone-500'}`} />
                        <span>{p.emoji}</span>
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* Expanded View: Minimal 4~5 Column Rounded-2xl Icon Grid   */
          /* ========================================================= */
          <motion.div
            key="expanded-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {activeTab === 'theme' ? (
              /* Theme Grid: 5열 (모바일 5열, 작고 콤팩트한 패딩) */
              <div className="grid grid-cols-5 gap-1.5">
                {THEME_CATEGORIES.map((cat) => {
                  const isSelected = isThemeItemSelected(cat);
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectThemeItem(cat)}
                      className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181B] border-[#18181B] text-white shadow-md scale-[1.02]'
                          : 'bg-[#FAF7F2]/90 hover:bg-stone-100/90 border-stone-200/60 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {/* Icon circle */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-colors ${
                          isSelected
                            ? 'bg-white/10 text-white'
                            : 'bg-white text-stone-700 shadow-2xs group-hover:bg-white/80'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#E14337]' : 'text-stone-600'}`} />
                      </div>

                      {/* Label + Emoji */}
                      <span className="text-[11px] font-bold text-center tracking-tight leading-tight line-clamp-1">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : activeTab === 'price' ? (
              /* Price/Burden Grid: 5열 */
              <div className="grid grid-cols-5 gap-1.5">
                {PRICE_CATEGORIES.map((p) => {
                  const isSelected = isPriceItemSelected(p);
                  const IconComponent = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPriceItem(p)}
                      className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181B] border-[#18181B] text-white shadow-md scale-[1.02]'
                          : 'bg-[#FAF7F2]/90 hover:bg-stone-100/90 border-stone-200/60 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {/* Icon circle */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-colors ${
                          isSelected
                            ? 'bg-white/10 text-white'
                            : 'bg-white text-stone-700 shadow-2xs group-hover:bg-white/80'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#E14337]' : 'text-stone-600'}`} />
                      </div>

                      {/* Label */}
                      <span className="text-[11px] font-bold text-center tracking-tight leading-tight line-clamp-1">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* All Tab View: 안내 문구 및 원클릭 전체 필터 해제 버튼 */
              <div className="p-3 bg-[#FAF7F2]/90 rounded-2xl border border-stone-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-4 h-4 text-[#E14337]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#18181B]">전체 큐레이션 둘러보기</h4>
                    <p className="text-[10px] text-stone-500 font-medium">모든 선물 아이템을 필터 없이 확인합니다.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setSelectedCategory('all');
                      setSelectedPrice('all');
                    });
                    onSelectCategory?.('all');
                  }}
                  className="px-3 py-1.5 bg-[#18181B] hover:bg-black text-white text-[11px] font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  전체 보기
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


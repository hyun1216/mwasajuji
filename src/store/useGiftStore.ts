import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  TrackType, 
  MainCategoryType, 
  PriceRangeType, 
  GenderType 
} from '@/types/gift';

interface GiftStoreState {
  // Track & Category
  activeTrack: TrackType;
  selectedCategory: MainCategoryType | 'all';
  
  // Filters
  selectedPrice: PriceRangeType;
  selectedGender: GenderType;
  selectedTags: string[];
  
  // UI State
  isFilterSheetOpen: boolean;
  isQuickModalOpen: boolean;
  
  // Saved / Liked items
  likedIds: string[];
  
  // Actions
  setActiveTrack: (track: TrackType) => void;
  setSelectedCategory: (cat: MainCategoryType | 'all') => void;
  setSelectedPrice: (price: PriceRangeType) => void;
  setSelectedGender: (gender: GenderType) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  resetFilters: () => void;
  
  setIsFilterSheetOpen: (open: boolean) => void;
  setIsQuickModalOpen: (open: boolean) => void;
  
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;
}

export const useGiftStore = create<GiftStoreState>()(
  persist(
    (set, get) => ({
      activeTrack: 'relationship',
      selectedCategory: 'bestie',
      selectedPrice: 'all',
      selectedGender: 'all',
      selectedTags: [],
      
      isFilterSheetOpen: false,
      isQuickModalOpen: false,
      
      likedIds: [],
      
      setActiveTrack: (track) => {
        set({ 
          activeTrack: track, 
          selectedCategory: track === 'relationship' ? 'bestie' : 'useless' 
        });
      },
      
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSelectedPrice: (price) => set({ selectedPrice: price }),
      setSelectedGender: (gender) => set({ selectedGender: gender }),
      
      toggleTag: (tag) => {
        const { selectedTags } = get();
        if (selectedTags.includes(tag)) {
          set({ selectedTags: selectedTags.filter((t) => t !== tag) });
        } else {
          set({ selectedTags: [...selectedTags, tag] });
        }
      },
      
      clearTags: () => set({ selectedTags: [] }),
      
      resetFilters: () => set({
        selectedPrice: 'all',
        selectedGender: 'all',
        selectedTags: [],
      }),
      
      setIsFilterSheetOpen: (open) => set({ isFilterSheetOpen: open }),
      setIsQuickModalOpen: (open) => set({ isQuickModalOpen: open }),
      
      toggleLike: (productId: string) => {
        const { likedIds } = get();
        if (likedIds.includes(productId)) {
          set({ likedIds: likedIds.filter((id) => id !== productId) });
        } else {
          set({ likedIds: [...likedIds, productId] });
        }
      },
      
      isLiked: (productId: string) => {
        return get().likedIds.includes(productId);
      },
    }),
    {
      name: 'mwasajuji-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({ likedIds: state.likedIds }),
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  TrackType, 
  MainCategoryType, 
  PriceRangeType, 
  GenderType,
  ProductItem 
} from '@/types/gift';
import { 
  fetchProductsFromDb, 
  updateProductLikesInDb, 
  insertProductToDb 
} from '@/lib/products';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

interface GiftStoreState {
  // Products from Supabase
  products: ProductItem[];
  isLoading: boolean;
  loadProducts: () => Promise<void>;

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
  isBurdenModalOpen: boolean;
  
  // Saved / Liked items
  likedIds: string[];

  // Custom User / Admin Added Products (fallback cache for offline or failed DB)
  customProducts: ProductItem[];
  
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
  setIsBurdenModalOpen: (open: boolean) => void;
  
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;

  addCustomProduct: (product: ProductItem) => Promise<boolean>;
  deleteCustomProduct: (productId: string) => void;
}

export const useGiftStore = create<GiftStoreState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      isLoading: false,

      loadProducts: async () => {
        set({ isLoading: true });
        try {
          const dbProducts = await fetchProductsFromDb();
          const { customProducts } = get();

          // Deduplicate: DB products have priority
          const seenIds = new Set<string>();
          const seenKeys = new Set<string>(); // name + externalUrl for extra safety

          const uniqueList: ProductItem[] = [];

          // 1) Add DB products first
          for (const item of dbProducts) {
            const key = `${item.name}__${item.externalUrl}`;
            if (!seenIds.has(item.id) && !seenKeys.has(key)) {
              seenIds.add(item.id);
              seenKeys.add(key);
              uniqueList.push(item);
            }
          }

          // 2) Add local customProducts only if NOT already present in DB
          const remainingCustom: ProductItem[] = [];
          for (const item of customProducts) {
            const key = `${item.name}__${item.externalUrl}`;
            if (!seenIds.has(item.id) && !seenKeys.has(key)) {
              seenIds.add(item.id);
              seenKeys.add(key);
              uniqueList.unshift(item); // newly added custom items on top
              remainingCustom.push(item);
            }
          }

          // Sync cleaned customProducts back to storage
          set({
            products: uniqueList,
            customProducts: remainingCustom,
            isLoading: false,
          });
        } catch (err) {
          console.error('Failed to load products in store:', err);
          set({ isLoading: false });
        }
      },

      activeTrack: 'relationship',
      selectedCategory: 'all',
      selectedPrice: 'all',
      selectedGender: 'all',
      selectedTags: [],
      
      isFilterSheetOpen: false,
      isQuickModalOpen: false,
      isBurdenModalOpen: false,
      
      likedIds: [],
      customProducts: [],
      
      setActiveTrack: (track) => {
        set({ 
          activeTrack: track, 
          selectedCategory: 'all' 
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
      setIsBurdenModalOpen: (open) => set({ isBurdenModalOpen: open }),
      
      toggleLike: (productId: string) => {
        const { likedIds, products } = get();
        const isLikedNow = !likedIds.includes(productId);
        
        // 1) Update likedIds list
        const nextLikedIds = isLikedNow
          ? [...likedIds, productId]
          : likedIds.filter((id) => id !== productId);

        // 2) Optimistic update for product likesCount
        const updatedProducts = products.map((p) => {
          if (p.id === productId) {
            const diff = isLikedNow ? 1 : -1;
            return {
              ...p,
              likesCount: Math.max(0, p.likesCount + diff),
            };
          }
          return p;
        });

        set({ likedIds: nextLikedIds, products: updatedProducts });

        // 3) Sync with Supabase in background
        updateProductLikesInDb(productId, isLikedNow);
      },
      
      isLiked: (productId: string) => {
        return get().likedIds.includes(productId);
      },

      addCustomProduct: async (product: ProductItem): Promise<boolean> => {
        try {
          // 1) Insert to Supabase DB first
          const inserted = await insertProductToDb(product);

          if (inserted) {
            // DB insert succeeded: place the official DB item at the top of products
            const { products } = get();
            const filtered = products.filter(
              (p) => p.id !== inserted.id && !(p.name === inserted.name && p.externalUrl === inserted.externalUrl)
            );
            set({
              products: [inserted, ...filtered],
            });
            return true;
          } else {
            // DB insert failed (e.g. offline): save to local customProducts as fallback
            const { customProducts, products } = get();
            set({
              customProducts: [product, ...customProducts],
              products: [product, ...products],
            });
            return true;
          }
        } catch (err) {
          console.error('addCustomProduct error:', err);
          return false;
        }
      },

      deleteCustomProduct: (productId: string) => {
        const { customProducts, products } = get();
        set({
          customProducts: customProducts.filter((p) => p.id !== productId),
          products: products.filter((p) => p.id !== productId),
        });
      },
    }),
    {
      name: 'mwasajuji-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({ 
        likedIds: state.likedIds,
        customProducts: state.customProducts,
      }),
    }
  )
);

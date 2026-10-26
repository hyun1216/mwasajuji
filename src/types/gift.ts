export type RelationshipType = 
  | 'bestie' 
  | 'awkward' 
  | 'coworker' 
  | 'parents' 
  | 'couple';

export type ThemeType = 
  | 'useless' 
  | 'single_life' 
  | 'comfort' 
  | 'work_life' 
  | 'fitness' 
  | 'sick' 
  | 'for_me';

export type MainCategoryType = RelationshipType | ThemeType;

export type TrackType = 'relationship' | 'theme';

export type GenderType = 'all' | 'female' | 'male';

export type PriceRangeType = 
  | 'all' 
  | 'under_10k'       // 가성비레전드 (~1만원대)
  | '20k_30k'         // 짜치지않는가격 (2~3만원대)
  | '40k_50k'         // 좋아해야주는가격 (4~5만원대)
  | 'over_100k';      // 돈많이 쓴 선물 (10만원 이상)

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  externalUrl: string;
  
  // 분류 메타
  track: TrackType;
  mainCategory: MainCategoryType;
  priceRange: PriceRangeType;
  gender: GenderType;
  tags: string[]; // ['생일', '카톡선물', '가벼운', '집들이', '위로', '감사', '합격/취업', '장난']

  // 차별화 요소
  burdenScore: number; // 0 ~ 100% (부담 지수)
  burdenBadgeText: string; // "부담 지수 0% (호불호 없는 카톡 1위)"
  editorComment: string; // "출근길에 가볍게 툭 던져주기 가장 안전한 아이템"
  
  likesCount: number;
  createdAt: string;
}

export interface QuickSelectFilter {
  target: RelationshipType | 'any';
  price: PriceRangeType | 'any';
  vibe: string;
}

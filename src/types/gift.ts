export type RelationshipType = 
  | 'bestie' 
  | 'awkward' 
  | 'coworker' 
  | 'parents' 
  | 'couple'
  | 'single_life'
  | 'for_me';

export type ThemeType = 
  | 'useless' 
  | 'housewarming' 
  | 'comfort' 
  | 'work_life' 
  | 'fitness' 
  | 'sick';

export type SnsCategoryType = 
  | 'viral' 
  | 'insta' 
  | 'fun' 
  | 'trending';

export type MainCategoryType = RelationshipType | ThemeType | SnsCategoryType;

export type TrackType = 'relationship' | 'theme' | 'sns_hot';

export type GenderType = 'all' | 'female' | 'male';

export type PriceRangeType = 
  | 'all' 
  | 'under_10k'       // 모바일 예의범절용 (1만원 미만)
  | '20k_30k'         // 사회적 체면 유지용 (1만~3만원대)
  | '40k_50k'         // 친밀감 검증 완료용 (4~5만원대)
  | 'over_100k';      // VIP 전용 (10만원 이상)

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

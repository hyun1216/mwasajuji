import { 
  ProductItem, 
  RelationshipType, 
  ThemeType, 
  MainCategoryType, 
  TrackType, 
  PriceRangeType, 
  GenderType 
} from './gift';

// Supabase Database Row Type (snake_case)
export interface DbProduct {
  id: string; // uuid or text
  name: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  image_url: string;
  external_url: string;
  track: 'relationship' | 'theme' | 'sns_hot';
  main_category: string;
  price_range: string;
  gender: 'all' | 'female' | 'male';
  tags: string[] | null;
  burden_score: number;
  burden_badge_text: string;
  editor_comment: string;
  likes_count: number;
  created_at: string;
}

// Convert DB snake_case row to Frontend camelCase ProductItem
export function fromDbProduct(row: DbProduct): ProductItem {
  return {
    id: String(row.id),
    name: row.name,
    brand: row.brand || '셀렉트샵',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    externalUrl: row.external_url || '#',
    track: (row.track as TrackType) || 'relationship',
    mainCategory: (row.main_category as MainCategoryType) || 'bestie',
    priceRange: (row.price_range as PriceRangeType) || '20k_30k',
    gender: (row.gender as GenderType) || 'all',
    tags: Array.isArray(row.tags) ? row.tags : [],
    burdenScore: Number(row.burden_score) || 0,
    burdenBadgeText: row.burden_badge_text || '부담지수 0% 🕊️ 실패확률 제로',
    editorComment: row.editor_comment || '',
    likesCount: Number(row.likes_count) || 0,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Convert Frontend camelCase ProductItem to DB snake_case payload
export function toDbProduct(item: Partial<ProductItem>): Partial<DbProduct> {
  const payload: Partial<DbProduct> = {};

  if (item.id) payload.id = item.id;
  if (item.name !== undefined) payload.name = item.name;
  if (item.brand !== undefined) payload.brand = item.brand;
  if (item.price !== undefined) payload.price = item.price;
  if (item.originalPrice !== undefined) payload.original_price = item.originalPrice;
  if (item.imageUrl !== undefined) payload.image_url = item.imageUrl;
  if (item.externalUrl !== undefined) payload.external_url = item.externalUrl;
  if (item.track !== undefined) payload.track = item.track;
  if (item.mainCategory !== undefined) payload.main_category = item.mainCategory;
  if (item.priceRange !== undefined) payload.price_range = item.priceRange;
  if (item.gender !== undefined) payload.gender = item.gender;
  if (item.tags !== undefined) payload.tags = item.tags;
  if (item.burdenScore !== undefined) payload.burden_score = item.burdenScore;
  if (item.burdenBadgeText !== undefined) payload.burden_badge_text = item.burdenBadgeText;
  if (item.editorComment !== undefined) payload.editor_comment = item.editorComment;
  if (item.likesCount !== undefined) payload.likes_count = item.likesCount;

  return payload;
}

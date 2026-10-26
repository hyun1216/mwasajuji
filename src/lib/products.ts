import { supabase } from './supabase';
import { ProductItem } from '@/types/gift';
import { DbProduct, fromDbProduct, toDbProduct } from '@/types/product';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

// 1. Fetch products from Supabase
export async function fetchProductsFromDb(): Promise<ProductItem[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase products select error:', error.message);
      return MOCK_PRODUCTS;
    }

    if (!data || data.length === 0) {
      // Return mock products if DB table is currently empty
      return MOCK_PRODUCTS;
    }

    return (data as DbProduct[]).map(fromDbProduct);
  } catch (err: any) {
    console.error('Failed to fetch products from Supabase:', err.message);
    return MOCK_PRODUCTS;
  }
}

// 2. Realtime Like Count Update in Supabase
export async function updateProductLikesInDb(
  productId: string,
  isLikedNow: boolean
): Promise<void> {
  try {
    // 1) Fetch current likes_count
    const { data, error } = await supabase
      .from('products')
      .select('likes_count')
      .eq('id', productId)
      .maybeSingle();

    if (error || !data) {
      // Item might be local mock item or not yet synced
      return;
    }

    const currentLikes = Number(data.likes_count) || 0;
    const newLikes = isLikedNow ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    // 2) Update DB
    await supabase
      .from('products')
      .update({ likes_count: newLikes })
      .eq('id', productId);
  } catch (err: any) {
    console.warn('Failed to update likes_count in Supabase:', err.message);
  }
}

// 3. Insert new product into Supabase (for Admin)
export async function insertProductToDb(
  product: ProductItem
): Promise<ProductItem | null> {
  try {
    const dbPayload = toDbProduct(product);
    // Remove client-generated custom ID if UUID is expected by DB, or keep it
    delete (dbPayload as any).id;

    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.warn('Failed to insert product into Supabase:', error.message);
      return null;
    }

    return fromDbProduct(data as DbProduct);
  } catch (err: any) {
    console.error('Insert product error:', err.message);
    return null;
  }
}

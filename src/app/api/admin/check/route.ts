import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/adminAuth';

export async function GET() {
  const isAdmin = await isUserAdmin();
  return NextResponse.json({ authenticated: isAdmin });
}

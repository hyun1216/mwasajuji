import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'mwasajuji_admin_session';
const SECRET_SALT = 'mwasajuji-secure-salt-2026';

export function getExpectedAdminToken(): string {
  const adminId = process.env.ADMIN_ID?.trim() || '';
  const adminPw = process.env.ADMIN_PASSWORD?.trim() || '';
  if (!adminId || !adminPw) return '';
  
  return crypto
    .createHash('sha256')
    .update(`${adminId}:${adminPw}:${SECRET_SALT}`)
    .digest('hex');
}

export function verifyAdminCredentials(id?: string, pw?: string): boolean {
  const targetId = process.env.ADMIN_ID?.trim() || '';
  const targetPw = process.env.ADMIN_PASSWORD?.trim() || '';
  if (!targetId || !targetPw) return false;
  return id?.trim() === targetId && pw?.trim() === targetPw;
}

export async function isUserAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  const expectedToken = getExpectedAdminToken();
  if (!sessionToken || !expectedToken) return false;
  return sessionToken === expectedToken;
}

export { COOKIE_NAME };

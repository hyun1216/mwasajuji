import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, getExpectedAdminToken, COOKIE_NAME } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json(
        { success: false, error: '아이디와 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(id, password)) {
      return NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const token = getExpectedAdminToken();
    const response = NextResponse.json({ success: true, message: '로그인되었습니다.' });

    // 7 days expiration
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

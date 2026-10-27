'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGiftStore } from '@/store/useGiftStore';
import { useToastStore } from '@/store/useToastStore';
import { ProductItem, TrackType, MainCategoryType, PriceRangeType, GenderType } from '@/types/gift';
import ProductCard from '@/components/ProductCard';
import { RELATIONSHIP_CATEGORIES, THEME_CATEGORIES, SNS_CATEGORIES } from '@/data/mockProducts';
import { calculateBurden } from '@/lib/burden';
import { 
  ArrowLeft, 
  Sparkles, 
  Link as LinkIcon, 
  Loader2, 
  CheckCircle2, 
  Edit3, 
  ExternalLink,
  Plus,
  Lock,
  LogOut,
  KeyRound,
  User,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

const SAMPLE_URLS = [
  { label: '카카오 선물 (논픽션 핸드크림)', url: 'https://gift.kakao.com/product/5812345' },
  { label: '29CM (이솝 룸스프레이)', url: 'https://product.29cm.co.kr/catalog/1234567' },
  { label: '네이버 쇼핑 (숙취해소제)', url: 'https://smartstore.naver.com/item/891011' },
];

export default function AdminPage() {
  const router = useRouter();
  const { addCustomProduct } = useGiftStore();
  const { showToast } = useToastStore();

  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzedProduct, setAnalyzedProduct] = useState<ProductItem | null>(null);

  // Auth states
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsCheckingAuth(true);
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      setIsAuthenticated(Boolean(data.authenticated));
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginId.trim() || !loginPw.trim()) {
      setLoginError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    try {
      setIsLoggingIn(true);
      setLoginError('');
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loginId.trim(), password: loginPw.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginPw('');
        showToast('관리자 인증에 성공했습니다.', 'success');
      } else {
        setLoginError(data.error || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setLoginError('로그인 처리 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setLoginPw('');
      showToast('로그아웃되었습니다.', 'info');
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Form editable states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [burdenScore, setBurdenScore] = useState<number>(10);
  const [burdenBadgeText, setBurdenBadgeText] = useState('');
  const [editorComment, setEditorComment] = useState('');
  const [track, setTrack] = useState<TrackType>('relationship');
  const [mainCategory, setMainCategory] = useState<MainCategoryType>('bestie');
  const [priceRange, setPriceRange] = useState<PriceRangeType>('20k_30k');
  const [gender, setGender] = useState<GenderType>('all');
  const [tagsString, setTagsString] = useState('');

  // Handle URL analyze
  const handleAnalyzeUrl = async () => {
    if (!inputUrl.trim()) {
      showToast('분석할 선물 링크를 입력해주세요.', 'warn');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || '분석에 실패했습니다.');
      }

      const p: ProductItem = data.product;
      setAnalyzedProduct(p);

      // Populate form fields
      setName(p.name);
      setBrand(p.brand);
      setPrice(p.price);
      setOriginalPrice(p.originalPrice || Math.round(p.price * 1.2));
      setImageUrl(p.imageUrl);
      setBurdenScore(p.burdenScore);
      setBurdenBadgeText(p.burdenBadgeText);
      setEditorComment(p.editorComment);
      setTrack(p.track);
      setMainCategory(p.mainCategory);
      setPriceRange(p.priceRange);
      setGender(p.gender);
      setTagsString(p.tags.join(', '));

      showToast('AI가 링크 분석을 완료했습니다! ✨', 'success');
    } catch (err: any) {
      showToast(err.message || '링크 분석 중 문제가 발생했습니다.', 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  // Build live preview product object
  const previewProduct: ProductItem | null = analyzedProduct
    ? {
        ...analyzedProduct,
        name: name || analyzedProduct.name,
        brand: brand || analyzedProduct.brand,
        price: Number(price) || analyzedProduct.price,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        imageUrl: imageUrl || analyzedProduct.imageUrl,
        burdenScore: Number(burdenScore),
        burdenBadgeText: burdenBadgeText || analyzedProduct.burdenBadgeText,
        editorComment: editorComment || analyzedProduct.editorComment,
        track,
        mainCategory,
        priceRange,
        gender,
        tags: tagsString
          ? tagsString.split(',').map((t) => t.trim()).filter(Boolean)
          : analyzedProduct.tags,
      }
    : null;

  // Final register
  const handleFinalRegister = async () => {
    if (isSubmitting || !previewProduct) return;

    if (!previewProduct.name || !previewProduct.price) {
      showToast('상품명과 가격을 입력해주세요.', 'warn');
      return;
    }

    try {
      setIsSubmitting(true);
      await addCustomProduct(previewProduct);
      showToast('홈페이지에 선물이 등록되었습니다! 🎁', 'success');

      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      showToast('등록 중 오류가 발생했습니다.', 'warn');
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F9F8F6] min-h-screen">
        <Loader2 className="w-8 h-8 text-[#E14337] animate-spin mb-3" />
        <p className="text-xs font-bold text-stone-500">관리자 인증 상태 확인 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col bg-[#F9F8F6] min-h-screen">
        <header className="sticky top-0 z-30 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-stone-200/70 px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-black py-1 px-2 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <h1 className="text-sm font-black text-[#18181B] tracking-tight">
              MWASAJUJI ADMIN
            </h1>
          </div>
          <div className="w-12" />
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 text-[#FAF7F2] shadow-sm mb-1">
                <Lock className="w-5 h-5 text-[#FAF7F2]" />
              </div>
              <h2 className="text-lg font-black text-[#18181B] tracking-tight">관리자 인증</h2>
              <p className="text-xs text-stone-500 font-medium leading-relaxed">
                안전한 상품 큐레이션을 위해<br />관리자 계정으로 로그인해주세요.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 text-center animate-in fade-in">
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-stone-700 tracking-wider">아이디 (ID)</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 absolute left-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="관리자 아이디 입력"
                    required
                    autoFocus
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#18181B] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-stone-700 tracking-wider">비밀번호 (PW)</label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 absolute left-3.5 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    placeholder="관리자 비밀번호 입력"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#18181B] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-600 transition-colors p-1"
                    title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || !loginId.trim() || !loginPw.trim()}
                className="w-full py-3 bg-[#18181B] hover:bg-black text-[#FAF7F2] rounded-xl text-xs font-black flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 transition-all shadow-xs cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E14337]" />
                    <span>인증 확인 중...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#E14337]" />
                    <span>관리자 로그인</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F9F8F6] min-h-screen">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-stone-200/70 px-4 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-black py-1 px-2 rounded-lg hover:bg-stone-200/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E14337] animate-pulse" />
          <h1 className="text-sm font-black text-[#18181B] tracking-tight">
            선물 자동 등록 관리자
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#E14337] py-1 px-2.5 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          title="관리자 로그아웃"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-5 space-y-6 max-w-lg mx-auto w-full">
        {/* URL Input Section */}
        <section className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-stone-100 rounded-xl text-[#18181B]">
              <Sparkles className="w-4 h-4 text-[#E14337]" />
            </div>
            <div>
              <h2 className="text-xs font-black text-[#18181B] tracking-tight">
                AI 링크 자동 분석 등록
              </h2>
              <p className="text-[11px] text-stone-500">
                선물 링크만 붙여넣으면 메타데이터 & 에디터 팩폭을 자동 생성합니다.
              </p>
            </div>
          </div>

          {/* Input Box */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <LinkIcon className="w-4 h-4 absolute left-3 text-stone-400" />
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://gift.kakao.com/... 또는 쇼핑몰 링크"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-stone-200 rounded-xl text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#18181B] transition-colors"
              />
            </div>

            {/* Sample Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-stone-400 font-bold shrink-0">
                테스트 예시:
              </span>
              {SAMPLE_URLS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputUrl(sample.url)}
                  className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 px-2 py-0.5 rounded-md transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeUrl}
              disabled={isLoading || !inputUrl.trim()}
              className="w-full py-3 rounded-xl bg-[#18181B] hover:bg-black text-[#FAF7F2] text-xs font-black flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E14337]" />
                  <span>AI가 링크 및 부담 지수를 분석 중입니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E14337]" />
                  <span>링크 자동 분석하기</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Preview & Edit Section */}
        {previewProduct && (
          <section className="space-y-5 animate-in fade-in duration-300">
            {/* Live Card Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                  LIVE CARD PREVIEW
                </span>
                <span className="text-[11px] font-bold text-[#E14337]">
                  실제 홈페이지 노출 모습
                </span>
              </div>
              <ProductCard product={previewProduct} />
            </div>

            {/* Detail Edit Form */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3.5">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100">
                <Edit3 className="w-4 h-4 text-stone-700" />
                <h3 className="text-xs font-black text-[#18181B] tracking-tight">
                  분석 결과 직접 다듬기
                </h3>
              </div>

              {/* Row 1: Brand & Name */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    브랜드
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:border-[#18181B]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    상품명
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              {/* Row 2: Price & Original Price */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    판매 가격 (원)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      const newPrice = Number(e.target.value);
                      setPrice(newPrice);
                      const b = calculateBurden(newPrice);
                      setBurdenScore(b.score);
                      setBurdenBadgeText(b.badgeText);
                    }}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:border-[#18181B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    정가 (선택, 원)
                  </label>
                  <input
                    type="number"
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-500 focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              {/* Row 3: Image URL */}
              <div>
                <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                  이미지 URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:border-[#18181B]"
                />
              </div>

              {/* Row 4: [에디터 팩폭] 코멘트 */}
              <div>
                <label className="text-[10px] font-bold text-[#E14337] mb-1 flex items-center justify-between">
                  <span>[에디터 팩폭] 한 줄 코멘트</span>
                  <span className="text-[9px] text-stone-400 font-normal">
                    솔직하고 위트 있는 팁
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={editorComment}
                  onChange={(e) => setEditorComment(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:border-[#18181B] leading-relaxed resize-none"
                />
              </div>

              {/* Row 5: 부담 지수 스티커 뱃지 */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    부담지수 (0~100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={burdenScore}
                    onChange={(e) => setBurdenScore(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:border-[#18181B]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    스티커 뱃지 문구
                  </label>
                  <input
                    type="text"
                    value={burdenBadgeText}
                    onChange={(e) => setBurdenBadgeText(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              {/* Row 6: Track & Category */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    대분류 트랙
                  </label>
                  <select
                    value={track}
                    onChange={(e) => {
                      const t = e.target.value as TrackType;
                      setTrack(t);
                      if (t === 'relationship') setMainCategory('bestie');
                      else if (t === 'theme') setMainCategory('useless');
                      else setMainCategory('viral');
                    }}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="relationship">누구 줄까? (관계/대상)</option>
                    <option value="theme">무슨 날이야? (이벤트/테마)</option>
                    <option value="sns_hot">요즘 핫한 거 (SNS/트렌드)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    중분류 카테고리
                  </label>
                  <select
                    value={mainCategory}
                    onChange={(e) => setMainCategory(e.target.value as any)}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  >
                    {track === 'relationship'
                      ? RELATIONSHIP_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.label}
                          </option>
                        ))
                      : track === 'theme'
                      ? THEME_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.label}
                          </option>
                        ))
                      : SNS_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.label}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              {/* Row 7: Price Range & Tags */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    금액대 태그
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as PriceRangeType)}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="under_10k">모바일 예의범절용 (1만원 미만)</option>
                    <option value="20k_30k">사회적 체면 유지용 (1만~3만원대)</option>
                    <option value="40k_50k">친밀감 검증 완료용 (4~5만)</option>
                    <option value="over_100k">VIP 전용 (10만~)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                    성별 구분
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderType)}
                    className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="all">전체 공용</option>
                    <option value="female">여성 추천</option>
                    <option value="male">남성 추천</option>
                  </select>
                </div>
              </div>

              {/* Row 8: Tags (comma-separated) */}
              <div>
                <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                  상황 태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  placeholder="생일, 감사, 카톡선물"
                  className="w-full p-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:border-[#18181B]"
                />
              </div>

              {/* Final Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinalRegister}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#E14337] hover:bg-[#c9362b] disabled:bg-stone-400 text-white text-xs font-black flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>DB에 등록 중입니다...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>홈페이지에 최종 등록하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

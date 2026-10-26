import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  ProductItem, 
  PriceRangeType, 
  GenderType 
} from '@/types/gift';
import { calculateBurden } from '@/lib/burden';
import { isUserAdmin } from '@/lib/adminAuth';

interface ScrapeRequest {
  url: string;
}

// 1. Helper: Extract pure price number from string
function parsePriceNumber(text: string): number | null {
  if (!text) return null;
  const clean = text.replace(/,/g, '').trim();
  const match = clean.match(/\b([1-9][0-9]{2,7})\b/);
  if (match) {
    const val = parseInt(match[1], 10);
    // Exclude common delivery fees (2500, 3000) if targeted by error
    if (val >= 500 && val <= 50000000 && val !== 2500 && val !== 3000) {
      return val;
    }
  }
  return null;
}

// 2. Comprehensive HTML-wide Price Extractor
function extractAccuratePriceFromHtml(html: string, $: cheerio.CheerioAPI): number | null {
  // A. Check description meta tags (Kakao Gift: "지금 카카오톡 선물하기에서 5,900원")
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  const twDesc = $('meta[name="twitter:description"]').attr('content') || '';
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const descText = `${ogDesc} ${twDesc} ${metaDesc}`;

  const descPriceMatch = descText.match(/([1-9][0-9]{0,2}(?:,[0-9]{3})+|[1-9][0-9]{2,7})\s*원/);
  if (descPriceMatch) {
    const parsed = parseInt(descPriceMatch[1].replace(/,/g, ''), 10);
    if (parsed >= 500 && parsed <= 50000000 && parsed !== 2500 && parsed !== 3000) {
      return parsed;
    }
  }

  // B. Check dedicated meta tags
  const metaSelectors = [
    'meta[property="product:price:amount"]',
    'meta[property="og:price:amount"]',
    'meta[property="product:sale_price:amount"]',
    'meta[name="twitter:data1"]',
    'meta[name="twitter:data2"]',
    'meta[itemprop="price"]',
    'meta[name="price"]',
  ];

  for (const sel of metaSelectors) {
    const val = $(sel).attr('content');
    if (val) {
      const parsed = parsePriceNumber(val);
      if (parsed) return parsed;
    }
  }

  // C. Check JSON-LD (<script type="application/ld+json">)
  let jsonLdPrice: number | null = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    if (jsonLdPrice) return;
    try {
      const content = $(el).html();
      if (content) {
        const json = JSON.parse(content);
        const offers = json.offers || (Array.isArray(json) ? json.find(j => j.offers)?.offers : null);
        if (offers) {
          const p = Array.isArray(offers) ? offers[0]?.price : offers.price || offers.lowPrice;
          if (p) {
            const num = parseInt(String(p).replace(/[^0-9]/g, ''), 10);
            if (!isNaN(num) && num >= 500 && num !== 2500 && num !== 3000) jsonLdPrice = num;
          }
        }
        if (!jsonLdPrice && json.price) {
          const num = parseInt(String(json.price).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num) && num >= 500 && num !== 2500 && num !== 3000) jsonLdPrice = num;
        }
      }
    } catch {
      // ignore
    }
  });
  if (jsonLdPrice) return jsonLdPrice;

  // D. Search JavaScript state variables (window.__INITIAL_DATA__, __NEXT_DATA__, __PRELOADED_STATE__)
  const scriptRegex = /(?:["']?(?:salePrice|sellingPrice|finalPrice|discountPrice|discountedPrice|sale_price|price)["']?)\s*:\s*([1-9][0-9]{2,7})\b/gi;
  const scriptMatches = [...html.matchAll(scriptRegex)];
  if (scriptMatches.length > 0) {
    for (const sm of scriptMatches) {
      const val = parseInt(sm[1], 10);
      if (val >= 500 && val <= 50000000 && val !== 2500 && val !== 3000) {
        return val;
      }
    }
  }

  // E. Search DOM elements for selling price
  const domSelectors = [
    '[itemprop="price"]',
    '.selling_price',
    '.sale_price',
    '.product_price',
    '.final_price',
    '.total_price',
    'strong[class*="price" i]',
    'span[class*="price" i]',
    'em[class*="price" i]',
  ];
  for (const sel of domSelectors) {
    const text = $(sel).first().text().trim();
    if (text) {
      const parsed = parsePriceNumber(text);
      if (parsed) return parsed;
    }
  }

  // F. Search entire raw HTML body text for price with '원' (excluding delivery fee)
  const bodyMatches = [...html.matchAll(/(?:(?<!배송비\s*|배송\s*|택배\s*)([1-9][0-9]{0,2}(?:,[0-9]{3})+|[1-9][0-9]{2,7}))\s*원/g)];
  for (const bm of bodyMatches) {
    const val = parseInt(bm[1].replace(/,/g, ''), 10);
    if (val >= 500 && val <= 50000000 && val !== 2500 && val !== 3000) {
      return val;
    }
  }

  return null;
}

// 3. Fallback price estimate only when absolutely no price could be scraped
function estimatePriceByKeywords(name: string, description: string): number {
  const text = `${name} ${description}`.toLowerCase();

  if (text.includes('에어팟') || text.includes('다이슨') || text.includes('워치') || text.includes('태블릿') || text.includes('지갑')) {
    return 189000;
  }
  if (text.includes('향수') || text.includes('오드퍼퓸') || text.includes('호텔') || text.includes('와인') || text.includes('마사지기')) {
    return 89000;
  }
  if (text.includes('홍삼') || text.includes('영양제') || text.includes('캔들') || text.includes('디퓨저') || text.includes('잠옷') || text.includes('파자마')) {
    return 49000;
  }
  if (text.includes('핸드크림') || text.includes('텀블러') || text.includes('머그') || text.includes('립밤') || text.includes('바디워시') || text.includes('샤워')) {
    return 32000;
  }
  if (text.includes('쿠션') || text.includes('인형') || text.includes('장난') || text.includes('쓸모없는')) {
    return 21000;
  }
  if (text.includes('상품권') || text.includes('교환권') || text.includes('기프티콘')) {
    return 30000;
  }
  if (text.includes('숙취') || text.includes('젤리') || text.includes('초콜릿') || text.includes('양말') || text.includes('사탕') || text.includes('스낵') || text.includes('쿠키') || text.includes('간식')) {
    return 8900;
  }

  const variations = [9900, 14900, 19900, 24900, 29000, 35000, 42000];
  const idx = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % variations.length;
  return variations[idx];
}

// 4. Resolve Meta-Refresh or JS location.replace Redirect Stub (e.g. gift-link.kakao.com)
async function fetchWithRedirectResolution(initialUrl: string): Promise<{ html: string; finalUrl: string }> {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  };

  // 1st Fetch
  const res = await fetch(initialUrl, {
    headers,
    redirect: 'follow',
    next: { revalidate: 0 },
  });

  let html = await res.text();
  let finalUrl = initialUrl;

  // Check if response HTML is an intermediate redirect stub (e.g. gift-link.kakao.com, meta-refresh)
  const metaRefreshMatch = html.match(/http-equiv=["']refresh["'][^>]*url=([^"'>\s]+)/i);
  const jsReplaceMatch = html.match(/window\.location\.replace\(["']([^"']+)["']\)/i);
  const redirectTarget = metaRefreshMatch?.[1] || jsReplaceMatch?.[1];

  if (redirectTarget) {
    // Extract actual destination URL from query parameter if embedded (e.g. to=https%3A%2F%2Fgift.kakao.com%2Fproduct%2F7566630)
    let realUrl = redirectTarget;
    const toParamMatch = redirectTarget.match(/[?&]to=([^&]+)/);
    if (toParamMatch) {
      realUrl = decodeURIComponent(toParamMatch[1]);
    } else {
      realUrl = decodeURIComponent(redirectTarget);
    }

    try {
      // 2nd Fetch: Get actual target product page HTML
      const secondRes = await fetch(realUrl, {
        headers,
        redirect: 'follow',
        next: { revalidate: 0 },
      });
      if (secondRes.ok) {
        html = await secondRes.text();
        finalUrl = realUrl;
      }
    } catch (secondErr: any) {
      console.warn('Second fetch to redirect target failed:', secondErr.message);
    }
  }

  return { html, finalUrl };
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다. 먼저 로그인해주세요.' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as ScrapeRequest;
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: '유효한 선물 URL을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 1. Fetch target HTML and resolve any JS/Meta-Refresh redirect stubs
    let html = '';
    let resolvedUrl = url;
    try {
      const fetchResult = await fetchWithRedirectResolution(url);
      html = fetchResult.html;
      resolvedUrl = fetchResult.finalUrl;
    } catch (fetchErr: any) {
      console.warn('URL Fetch Failed, falling back to basic metadata:', fetchErr.message);
    }

    // 2. Parse OpenGraph, DOM, and multi-tier price
    let rawTitle = '';
    let rawImage = '';
    let rawDescription = '';
    let rawBrand = '';
    let rawPrice: number | null = null;

    if (html) {
      const $ = cheerio.load(html);

      // A. Title
      rawTitle =
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text().trim() ||
        '';

      rawTitle = rawTitle
        .replace(/\s*\|\s*29CM.*$/i, '')
        .replace(/\s*:\s*네이버\s*쇼핑.*$/i, '')
        .replace(/\s*-\s*카카오톡\s*선물하기.*$/i, '')
        .replace(/\s*\|\s*무신사.*$/i, '')
        .trim();

      // B. Image
      rawImage =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[property="og:image:secure_url"]').attr('content') ||
        $('link[rel="image_src"]').attr('href') ||
        $('img').first().attr('src') ||
        '';

      if (rawImage && rawImage.startsWith('/')) {
        try {
          const parsedUrl = new URL(resolvedUrl);
          rawImage = `${parsedUrl.origin}${rawImage}`;
        } catch {
          // ignore
        }
      }

      // C. Description & Brand
      rawDescription =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';

      rawBrand =
        $('meta[property="og:site_name"]').attr('content') ||
        $('meta[name="author"]').attr('content') ||
        '';

      // D. Multi-tier Price Extraction!
      rawPrice = extractAccuratePriceFromHtml(html, $);
    }

    // Fallbacks for title and image
    if (!rawTitle) {
      try {
        const urlObj = new URL(url);
        rawTitle = `${urlObj.hostname} 추천 선물`;
        if (!rawBrand) rawBrand = urlObj.hostname.replace('www.', '').split('.')[0];
      } catch {
        rawTitle = '추천 큐레이션 선물';
      }
    }

    if (!rawImage) {
      rawImage =
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
    }

    // 3. AI Analysis with Gemini API or Intelligent Fallback
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let aiResult: Partial<ProductItem> = {};

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
당신은 2030 모바일 선물 큐레이션 서비스 '뭐사주지'의 위트 있고 솔직한 시니어 에디터입니다.
다음 상품 메타데이터를 분석하여 선물의 실제 가격과 현실적인 관계, 부담 지수, 그리고 솔직한 팩폭 코멘트를 JSON 형식으로 생성해주세요.

[상품 메타데이터]
- 링크: ${url}
- 상품명/제목: ${rawTitle}
- 설명: ${rawDescription}
- 브랜드: ${rawBrand}
- 웹페이지에서 추출된 실제 가격: ${rawPrice ? `${rawPrice}원` : '미확인 (상품명을 바탕으로 실제 시중 판매 가격을 정밀 추정해주세요)'}

[요구사항]
1. name: 불필요한 홍보 문구를 제외한 깔끔한 상품명 (한국어, 30자 이내)
2. brand: 깔끔한 브랜드명
3. price: 실제 추출된 가격(${rawPrice ? `${rawPrice}` : '있다면 반영'})을 최우선으로 반영하고, 미확인 시 상품명에 맞는 현실적인 가격(숫자)
4. burdenScore: 0~100 사이 숫자 (부담 지수)
5. burdenBadgeText: 스티커 느낌의 엣지 있는 한마디 (예: "부담지수 0% 🕊️ 실패확률 제로", "부담지수 15% 🌿 감각적인 스몰럭셔리", "부담지수 35% 🚨 취향검증 필수")
6. editorComment: [에디터 팩폭] 위트 있고 뼈 때리는 솔직한 1~2줄 코멘트
7. track: "relationship" | "theme" | "sns_hot" (SNS 유행, 릴스/쇼츠 대란, 밈템일 경우 "sns_hot")
8. mainCategory: 
   - relationship일 경우: "bestie" | "awkward" | "coworker" | "parents" | "couple" | "single_life" | "for_me"
   - theme일 경우: "useless" | "housewarming" | "comfort" | "work_life" | "fitness" | "sick"
   - sns_hot일 경우: "viral" | "insta" | "fun" | "trending"
9. priceRange: 
   - 1만원 미만 (모바일 예의범절용): "under_10k"
   - 1만원 이상 ~ 3만원대 (사회적 체면 유지용): "20k_30k"
   - 4~5만원대 (친밀감 검증 완료용): "40k_50k"
   - 10만원 이상 (VIP 전용): "over_100k"
10. gender: "all" | "female" | "male"
11. tags: 상황/성격 해시태그 3개 배열

반드시 다른 설명 없이 순수한 JSON 객체만 응답하세요.
`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        
        const cleanedJson = textResponse
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        aiResult = JSON.parse(cleanedJson);
      } catch (aiErr: any) {
        console.warn('Gemini API call skipped or failed:', aiErr.message);
      }
    }

    // 4. Calculate Final Accurate Price
    const finalPrice =
      rawPrice ||
      (aiResult.price && aiResult.price > 0 ? aiResult.price : null) ||
      estimatePriceByKeywords(rawTitle, rawDescription);

    let fallbackPriceRange: PriceRangeType = '20k_30k';
    if (finalPrice < 10000) fallbackPriceRange = 'under_10k';
    else if (finalPrice <= 39999) fallbackPriceRange = '20k_30k';
    else if (finalPrice <= 69999) fallbackPriceRange = '40k_50k';
    else fallbackPriceRange = 'over_100k';

    // 예의범절용(under_10k)은 반드시 1만원 미만 상품만 허용
    let finalPriceRange: PriceRangeType = (aiResult.priceRange as any) || fallbackPriceRange;
    if (finalPrice < 10000) {
      finalPriceRange = 'under_10k';
    } else if (finalPriceRange === 'under_10k') {
      finalPriceRange = fallbackPriceRange;
    }

    const burden = calculateBurden(finalPrice);

    const finalProduct: ProductItem = {
      id: `custom-${Date.now()}`,
      name: aiResult.name || rawTitle.slice(0, 35),
      brand: aiResult.brand || rawBrand || '선물셀렉션',
      price: finalPrice,
      originalPrice: aiResult.originalPrice || Math.round(finalPrice * 1.2),
      imageUrl: rawImage,
      externalUrl: url,
      track: (aiResult.track as any) || 'relationship',
      mainCategory: (aiResult.mainCategory as any) || 'bestie',
      priceRange: finalPriceRange,
      gender: (aiResult.gender as GenderType) || 'all',
      tags: aiResult.tags && aiResult.tags.length > 0
        ? aiResult.tags
        : ['생일', '카톡선물', '센스템'],
      burdenScore: burden.score,
      burdenBadgeText: burden.badgeText,
      editorComment:
        aiResult.editorComment ||
        '지갑은 지키고 센스는 챙김. 호불호 없이 가볍게 던져주기 가장 안전한 아이템.',
      likesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      product: finalProduct,
      rawMetadata: {
        title: rawTitle,
        image: rawImage,
        description: rawDescription,
        brand: rawBrand,
        scrapedPrice: rawPrice,
        resolvedUrl,
      },
    });
  } catch (error: any) {
    console.error('Scrape API Error:', error);
    return NextResponse.json(
      { error: error.message || '상품 링크 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

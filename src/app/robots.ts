import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mwasajuji.kr';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/saebom', '/api/'], // 관리자 페이지 및 API 경로 검색엔진 크롤링 차단 로직
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

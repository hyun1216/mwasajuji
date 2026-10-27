import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mwasajuji.kr';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // 향후 상세 페이지나 신규 카테고리 경로 확장 시 아래 형태로 추가할 수 있습니다:
    // {
    //   url: `${baseUrl}/product/123`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ];
}  
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mwasajuji.kr"),
  title: "뭐사주지 (MWASAJUJI) | 선 넘지 않는 선물 큐레이션",
  description: "센스는 챙기고 부담은 덜어낸 모바일 선물 가이드. 관계, 예산, 팩폭 코멘트로 찾는 실패 없는 선물",
  openGraph: {
    title: "뭐사주지 | 선 넘지 않는 선물 큐레이션",
    description: "선 넘지 않는 선물 큐레이션. 1초 만에 찜하고 카톡으로 툭 던지기!",
    url: "https://www.mwasajuji.kr",
    siteName: "뭐사주지",
    locale: "ko_KR",
    type: "website",
    /* 
     * 카카오톡, 라인, 슬랙 등 메신저 공유 시 표시되는 Open Graph 이미지입니다.
     * 파일 위치: /public/og-image.png (권장 해상도: 1200x630)
     * 이미지가 누락되거나 교체할 경우 public 디렉토리에 'og-image.png' 이름으로 배치해야 정상 작동합니다.
     */
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "뭐사주지 - 선 넘지 않는 선물 큐레이션",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "뭐사주지 | 선 넘지 않는 선물 큐레이션",
    description: "선 넘지 않는 선물 큐레이션. 1초 만에 찜하고 카톡으로 툭 던지기!",
    images: ["/og-image.png"],
  },
  verification: {
    other: {
      "naver-site-verification": "e211c91d60b016d7be542ad47c048db61b7dac19",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F3F4F6] text-[#18181B] flex justify-center">
        {/* Mobile Device Frame */}
        <div className="w-full max-w-[430px] min-h-screen bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative flex flex-col border-x border-gray-100">
          <Toast />
          {children}
        </div>
      </body>
    </html>
  );
}

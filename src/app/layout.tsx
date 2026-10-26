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
  themeColor: "#F9F8F6",
};

export const metadata: Metadata = {
  title: "뭐사주지 (MWASAJUJI) | 선 넘지 않는 선물 큐레이션",
  description: "29CM 감성의 현실적인 모바일 선물 가이드. 관계, 예산, 팩폭 코멘트로 찾는 실패 없는 선물",
  openGraph: {
    title: "뭐사주지 | 선 넘지 않는 선물 큐레이션",
    description: "선 넘지 않는 선물 큐레이션. 1초 만에 찜하고 카톡으로 툭 던지기!",
    url: "https://mwasajuji.app",
    siteName: "뭐사주지",
    locale: "ko_KR",
    type: "website",
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
      <body className="min-h-full bg-[#EAE8E3] text-[#18181B] flex justify-center">
        {/* Mobile Device Frame */}
        <div className="w-full max-w-[430px] min-h-screen bg-[#F9F8F6] shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative flex flex-col border-x border-stone-200/80">
          <Toast />
          {children}
        </div>
      </body>
    </html>
  );
}

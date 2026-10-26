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
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "모사주지 (mwasajuji) | 실패 없는 선물 큐레이션",
  description: "관계, 상황, 현실적인 적정 가격대, 부담 지수에 맞춘 모바일 특화 선물 큐레이션 플랫폼",
  openGraph: {
    title: "모사주지 (mwasajuji) | 고민 없는 선물 큐레이션",
    description: "찐친, 지인, 직장동료에게 선물할 때? 부담 지수로 찾는 3초 선물 추천!",
    url: "https://mwasajuji.app",
    siteName: "모사주지",
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
      <body className="min-h-full bg-zinc-100/90 text-zinc-900 flex justify-center selection:bg-orange-500 selection:text-white">
        <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl relative flex flex-col border-x border-zinc-200/60">
          <Toast />
          {children}
        </div>
      </body>
    </html>
  );
}

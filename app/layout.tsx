import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

/**
 * Clerk 한국어 로컬라이제이션 설정
 *
 * 공식 문서 모범 사례 기반:
 * - @clerk/localizations의 koKR 사용
 * - 커스텀 로컬라이제이션으로 애플리케이션 이름 등 추가 커스터마이징 가능
 * - koKR을 기본으로 하고 필요한 부분만 오버라이드
 */
const clerkLocalization = {
  ...koKR,
  // 필요시 여기에 커스텀 로컬라이제이션 추가 가능
  // 예: signUp: { start: { subtitle: '{{applicationName}}에 가입하세요' } }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="ko-KR">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

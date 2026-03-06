import type { Metadata, Viewport } from "next";
import Script from "next/script";
import BottomTabs from "@/components/tma/BottomTabs";
import { TMAProvider } from "@/components/tma/TMAProvider";
import LanguageToggle from "@/components/common/LanguageToggle";

export const metadata: Metadata = {
    title: "Talent TMA",
    description: "Telegram Mini App for Employees",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function TMALayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20 tma-fade-in font-sans">
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />

            {/* TMA Header with Language Toggle */}
            <header className="h-14 flex items-center justify-end px-4 sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
                <LanguageToggle />
            </header>

            <TMAProvider>
                <main>
                    {children}
                </main>
                <BottomTabs />
            </TMAProvider>
        </div>
    );
}

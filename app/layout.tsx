import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import PushSubscribeButton from "@/components/PushSubscribeButton"; // 👉 ajoute ceci

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Arabe Vivant — parlez un arabe qui vous ressemble",
  description:
    "Une pratique quotidienne pour transformer votre Darija orale en arabe écrit et parlé plus formel, à partir de situations de vie réelles. Pour locuteurs francophones maîtrisant la darija orale (niveau A2-B1).",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon-180.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arabe Vivant",
  },
};

export const viewport = {
  themeColor: "#E0B460", // Un or doux, tiré de la palette existante
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="font-body min-h-screen antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        <ThemeToggle />
        <Header />

        <main className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
          {children}
        </main>

        {/* 👉 Bouton de notification en bas de page */}
        <div className="py-10 text-center">
          <PushSubscribeButton />
        </div>

      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { OutfitProvider } from "./context/OutfitContext";

export const metadata: Metadata = {
  title: "ClothingSwipe",
  description: "Swipe outfits to like or dislike them",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OutfitProvider>
          <header className="bg-white shadow p-4 flex justify-between">
            <h1 className="font-bold">ClothingSwipe</h1>
            <nav className="flex gap-4">
              <Link href="/">Home</Link>
              <Link href="/liked">Liked</Link>
              <Link href="/disliked">Disliked</Link>
            </nav>
          </header>
          <main className="p-6">{children}</main>
        </OutfitProvider>
      </body>
    </html>
  );
}

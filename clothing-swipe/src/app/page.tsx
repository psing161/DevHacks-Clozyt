"use client";

import { useState } from "react";
import { useOutfits, type Outfit } from "./context/OutfitContext";
import SwipeCard from "./components/SwipeCard";

const seed: Outfit[] = [
  { id: "1", name: "Summer Dress", img: "https://placehold.co/600x800?text=Summer+Dress", type: "dress" },
  { id: "2", name: "Winter Jacket", img: "https://placehold.co/600x800?text=Winter+Jacket", type: "jacket" },
  { id: "3", name: "Casual Tee",   img: "https://placehold.co/600x800?text=Casual+Tee", type: "tshirt" },
];

const recommendations: Outfit[] = [
  { id: "r1", name: "Floral Maxi Dress", img: "https://placehold.co/600x800?text=Floral+Maxi" },
  { id: "r2", name: "Denim Jacket", img: "https://placehold.co/600x800?text=Denim+Jacket" },
  { id: "r3", name: "Graphic Tee", img: "https://placehold.co/600x800?text=Graphic+Tee" },
  { id: "r4", name: "Formal Blazer", img: "https://placehold.co/600x800?text=Blazer" },
  { id: "r5", name: "Leather Boots", img: "https://placehold.co/600x800?text=Boots" },
];

export default function HomePage() {
  const { likeItem, dislikeItem } = useOutfits();
  const [cards, setCards] = useState<Outfit[]>(seed);

  const handleSwiped = (dir: "left" | "right", outfit: Outfit) => {
    if (dir === "right") likeItem(outfit);
    else dislikeItem(outfit);
    setCards((prev) => prev.filter((c) => c.id !== outfit.id));
  };

  const clickDislike = () => {
    const top = cards.at(-1);
    if (!top) return;
    dislikeItem(top);
    setCards((p) => p.filter((c) => c.id !== top.id));
  };

  const clickLike = () => {
    const top = cards.at(-1);
    if (!top) return;
    likeItem(top);
    setCards((p) => p.filter((c) => c.id !== top.id));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Swipe Deck */}
      <h2 className="text-2xl font-bold mb-2">Swipe Outfits</h2>
      <p className="text-gray-500 text-sm mb-6">Drag → Like &nbsp;|&nbsp; Drag ← Dislike</p>

      <div className="relative w-[300px] h-[420px] mb-8">
        {cards.length > 0 ? (
          cards.map((outfit, index) => (
            <SwipeCard
              key={outfit.id}
              outfit={outfit}
              index={index}
              total={cards.length}
              onSwiped={handleSwiped}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 border-2 border-dashed rounded-xl">
            No more outfits
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-8 mb-12">
        <button
          onClick={clickDislike}
          className="bg-red-500 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-red-600 transition"
        >
          ❌
        </button>
        <button
          onClick={clickLike}
          className="bg-green-500 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-green-600 transition"
        >
          ✅
        </button>
      </div>

      {/* Recommended Section */}
      <section className="w-full max-w-5xl">
        <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-xl p-3 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="mt-2 font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

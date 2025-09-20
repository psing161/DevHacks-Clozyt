"use client";

import { useEffect, useState } from "react";
import { useOutfits, type Outfit } from "./context/OutfitContext";
import SwipeCard from "./components/SwipeCard";

export default function HomePage() {
  const { likeItem, dislikeItem } = useOutfits();
  const [cards, setCards] = useState<Outfit[]>([]);
  const [recommendations, setRecommendations] = useState<Outfit[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/recommendations");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("API did not return an array", data);
          return;
        }

        setCards(data);            // swipe deck
        setRecommendations(data);  // recommended section
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    }
    fetchData();
  }, []);

  const handleSwiped = (dir: "left" | "right", outfit: Outfit) => {
    if (dir === "right") likeItem(outfit);
    else dislikeItem(outfit);

    setCards((prev) => prev.filter((c) => c.id !== outfit.id));
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center">Swipe Outfits</h1>
      <p className="text-center text-gray-600">Drag → Like | Drag ← Dislike</p>

      {/* Swipeable cards */}
      <div className="flex justify-center mt-8">
        {cards.length > 0 ? (
          cards.map((outfit) => (
            <SwipeCard
              key={outfit.id}
              outfit={outfit}
              onSwiped={handleSwiped}
            />
          ))
        ) : (
          <p className="text-gray-500">No more outfits to swipe!</p>
        )}
      </div>

      {/* Like/Dislike buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => cards[0] && handleSwiped("left", cards[0])}
          className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600"
        >
          ❌ Dislike
        </button>
        <button
          onClick={() => cards[0] && handleSwiped("right", cards[0])}
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600"
        >
          ✅ Like
        </button>
      </div>

      {/* Recommendations */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="w-40 p-2 border rounded shadow-sm text-center"
            >
              <img
                src={item.image_link}
                alt={item.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-sm mt-2 font-medium">{item.title}</h3>
              {item.price && (
                <p className="text-xs text-gray-600">${item.price}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  img: string;
  price?: string;
  type?: string;
};

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:5000/user_action");
        const data = await res.json();

        // Ensure it's always an array
        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          console.error("Unexpected API format:", data);
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch items", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-6">Choose an Item</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`}>
              <div className="w-40 p-2 border rounded shadow-sm text-center cursor-pointer hover:shadow-md">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="text-sm mt-2 font-medium">{item.title}</h3>
                {item.price && (
                  <p className="text-xs text-gray-600">${item.price}</p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>
    </main>
  );
}

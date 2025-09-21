"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Item = {
  id: string;
  title: string;
  img: string;
  price?: string;
  type?: string;
};

export default function ProductPage() {
  const params = useParams();
  const { id } = params; // dynamic route param
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch("/api/recommendations");
        const data: Item[] = await res.json();
        const found = data.find((x) => x.id === id);
        setItem(found || null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Product not found</p>;

  return (
    <main className="p-6">
      <div className="max-w-md mx-auto border rounded shadow p-4">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-64 object-cover rounded"
        />
        <h1 className="text-xl font-bold mt-4">{item.title}</h1>
        {item.price && (
          <p className="text-gray-700 mt-2 text-lg">${item.price}</p>
        )}
        <p className="text-gray-500 mt-2">Type: {item.type}</p>
      </div>
    </main>
  );
}

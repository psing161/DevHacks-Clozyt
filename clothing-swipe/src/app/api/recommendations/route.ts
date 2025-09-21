import { NextResponse } from "next/server";

// 🔗 Replace with your real API endpoint
const DATA_API = "https://fakestoreapi.com/products";

type Item = {
  id: string;
  title: string;
  img: string;
  price?: string;
  type?: string;
};

export async function GET() {
  try {
    // fetch external API
    const res = await fetch(DATA_API);
    if (!res.ok) throw new Error("Failed to fetch external API");

    const raw = await res.json();

    // normalize into our Item structure
    const items: Item[] = (Array.isArray(raw) ? raw : raw.items || raw.debug || []).map(
      (row: any, index: number) => ({
        id: row.id || `${index}`,
        title: row.title || row.Title || row.name || "Untitled",
        img: row.img || row.image_link || row.Image_Link || "",
        price: row.price || row.Price || "",
        type: row.type || row.product_type || row.Product_Type || "",
      })
    );

    // ✅ always return array
    return NextResponse.json(items);
  } catch (err: any) {
    console.error("❌ API fetch error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

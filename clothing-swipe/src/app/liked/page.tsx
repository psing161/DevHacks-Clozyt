import { useOutfits, type Outfit } from "../context/OutfitContext";

export default function LikedPage() {
  const { liked, removeFromLiked, clearAll } = useOutfits();

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liked Outfits</h1>
        {liked.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-100"
          >
            Clear all
          </button>
        )}
      </div>

      {liked.length === 0 ? (
        <p className="mt-4 text-gray-600">No liked outfits yet.</p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {liked.map((item: Outfit) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-3">
              <img
                src={item.img} // ✅ fixed
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="mt-2 flex items-center justify-between">
                <h3 className="font-medium">{item.title}</h3>
                <button
                  onClick={() => removeFromLiked(item.id)}
                  className="text-xs text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Outfit = { id: string; name: string; img: string; type?: string };

type OutfitContextType = {
  liked: Outfit[];
  disliked: Outfit[];
  likeItem: (o: Outfit) => void;
  dislikeItem: (o: Outfit) => void;
  removeFromLiked: (id: string) => void;
  removeFromDisliked: (id: string) => void;
  clearAll: () => void;
};

const OutfitContext = createContext<OutfitContextType | null>(null);
const STORAGE_KEY = "outfit-preferences-v1";

export function OutfitProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Outfit[]>([]);
  const [disliked, setDisliked] = useState<Outfit[]>([]);

  // Always call effects; guard inside callback is OK.
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setLiked(parsed.liked ?? []);
        setDisliked(parsed.disliked ?? []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked, disliked }));
    }
  }, [liked, disliked]);

  const likeItem = (o: Outfit) => {
    setLiked((cur) => (cur.some(x => x.id === o.id) ? cur : [...cur, o]));
    setDisliked((cur) => cur.filter(x => x.id !== o.id));
  };

  const dislikeItem = (o: Outfit) => {
    setDisliked((cur) => (cur.some(x => x.id === o.id) ? cur : [...cur, o]));
    setLiked((cur) => cur.filter(x => x.id !== o.id));
  };

  const removeFromLiked = (id: string) => setLiked(cur => cur.filter(x => x.id !== id));
  const removeFromDisliked = (id: string) => setDisliked(cur => cur.filter(x => x.id !== id));
  const clearAll = () => { setLiked([]); setDisliked([]); };

  const value = useMemo(() => ({
    liked, disliked, likeItem, dislikeItem, removeFromLiked, removeFromDisliked, clearAll
  }), [liked, disliked]);

  return <OutfitContext.Provider value={value}>{children}</OutfitContext.Provider>;
}

export function useOutfits() {
  const ctx = useContext(OutfitContext);
  if (!ctx) throw new Error("useOutfits must be used within <OutfitProvider>");
  return ctx;
}

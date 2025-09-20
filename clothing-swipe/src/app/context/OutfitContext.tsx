"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// src/app/context/OutfitContext.tsx
export type Outfit = {
  id: string;
  title: string;
  image_link: string; // ✅ match CSV column name
  price?: string;
  product_type?: string;
};


type OutfitContextType = {
  liked: Outfit[];
  disliked: Outfit[];
  likeItem: (item: Outfit) => void;
  dislikeItem: (item: Outfit) => void;
};

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

export function OutfitProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<Outfit[]>([]);
  const [disliked, setDisliked] = useState<Outfit[]>([]);

  const likeItem = (item: Outfit) => setLiked((prev) => [...prev, item]);
  const dislikeItem = (item: Outfit) => setDisliked((prev) => [...prev, item]);

  return (
    <OutfitContext.Provider value={{ liked, disliked, likeItem, dislikeItem }}>
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfits() {
  const ctx = useContext(OutfitContext);
  if (!ctx) throw new Error("useOutfits must be used within OutfitProvider");
  return ctx;
}

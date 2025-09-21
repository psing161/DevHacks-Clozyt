"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Outfit = {
  id: string;
  title: string;
  img: string;
  price?: string;
  type?: string;
};

type OutfitContextType = {
  liked: Outfit[];
  disliked: Outfit[];
  likeItem: (outfit: Outfit) => void;
  dislikeItem: (outfit: Outfit) => void;
  removeFromLiked: (id: string) => void;
  clearAll: () => void;
};

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

export function OutfitProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<Outfit[]>([]);
  const [disliked, setDisliked] = useState<Outfit[]>([]);

  const likeItem = (outfit: Outfit) => {
    setLiked((prev) => {
      if (prev.some((o) => o.id === outfit.id)) return prev; // avoid duplicates
      return [...prev, outfit];
    });
  };

  const dislikeItem = (outfit: Outfit) => {
    setDisliked((prev) => {
      if (prev.some((o) => o.id === outfit.id)) return prev;
      return [...prev, outfit];
    });
  };

  const removeFromLiked = (id: string) => {
    setLiked((prev) => prev.filter((o) => o.id !== id));
  };

  const clearAll = () => {
    setLiked([]);
    setDisliked([]);
  };

  return (
    <OutfitContext.Provider
      value={{ liked, disliked, likeItem, dislikeItem, removeFromLiked, clearAll }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfits() {
  const context = useContext(OutfitContext);
  if (!context) {
    throw new Error("useOutfits must be used within an OutfitProvider");
  }
  return context;
}

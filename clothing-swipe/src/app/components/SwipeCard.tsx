"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import type { Outfit } from "../context/OutfitContext";

export default function SwipeCard({
  outfit,
  index,
  total,
  onSwiped, // called after animation completes
}: {
  outfit: Outfit;
  index: number;
  total: number;
  onSwiped: (dir: "left" | "right", outfit: Outfit) => void;
}) {
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Drag → overlay opacities
  const likeOpacity = useTransform(x, [0, 120], [0, 1]);
  const dislikeOpacity = useTransform(x, [0, -120], [0, 1]);

  const fling = (dir: "left" | "right") => {
    const to = dir === "right" ? { x: 500, opacity: 0, rotate: 18 } : { x: -500, opacity: 0, rotate: -18 };
    controls.start(to).then(() => onSwiped(dir, outfit));
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      style={{ x, zIndex: total - index }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) fling("right");
        else if (info.offset.x < -100) fling("left");
        else controls.start({ x: 0, rotate: 0 });
      }}
      animate={controls}
      initial={{ scale: 1 }}
      whileTap={{ scale: 1.05 }}
      className="absolute w-full h-full bg-white shadow-xl rounded-2xl p-4 flex flex-col items-center"
    >
      <img
        src={outfit.img}
        alt={outfit.name}
        className="w-full h-72 object-cover rounded-xl"
      />
      <p className="mt-2 font-semibold">{outfit.name}</p>

      {/* Overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 text-green-600 font-bold text-xl border-4 border-green-600 px-3 py-1 rounded-lg"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: dislikeOpacity }}
        className="absolute top-6 right-6 text-red-600 font-bold text-xl border-4 border-red-600 px-3 py-1 rounded-lg"
      >
        NOPE
      </motion.div>
    </motion.div>
  );
}

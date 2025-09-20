"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import type { Outfit } from "../context/OutfitContext";

type SwipeCardProps = {
  outfit: Outfit;
  onSwiped: (dir: "left" | "right", outfit: Outfit) => void;
};

export default function SwipeCard({ outfit, onSwiped }: SwipeCardProps) {
  const controls = useAnimation();
  const [dragging, setDragging] = useState(false);

  // motion value for X position
  const x = useMotionValue(0);

  // opacity for overlays
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

  // handle drag/swipe end
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      like();
    } else if (info.offset.x < -100) {
      dislike();
    } else {
      controls.start({ x: 0, y: 0 });
    }
    setDragging(false);
  };

  // like action
  const like = () => {
    controls.start({ x: 300, opacity: 0 }).then(() => {
      onSwiped("right", outfit);
    });
  };

  // dislike action
  const dislike = () => {
    controls.start({ x: -300, opacity: 0 }).then(() => {
      onSwiped("left", outfit);
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Swipeable card */}
      <motion.div
        className="relative w-64 h-96 bg-white rounded-xl shadow-lg flex flex-col items-center justify-between p-4 cursor-grab"
        drag="x"
        style={{ x }}
        whileDrag={{ scale: 1.05 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Overlays */}
        <motion.div
          className="absolute top-6 left-6 text-2xl font-bold text-green-500 border-4 border-green-500 px-3 py-1 rounded"
          style={{ opacity: likeOpacity, rotate: "-10deg" }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-6 right-6 text-2xl font-bold text-red-500 border-4 border-red-500 px-3 py-1 rounded"
          style={{ opacity: nopeOpacity, rotate: "10deg" }}
        >
          NOPE
        </motion.div>

        {/* Product image */}
        <img
          src={outfit.image_link}
          alt={outfit.title}
          className="w-full h-64 object-cover rounded"
        />

        {/* Labels */}
        <div className="text-center">
          <h3 className="font-semibold">{outfit.title}</h3>
          <p className="text-sm text-gray-500">{outfit.product_type}</p>
          {outfit.price && (
            <p className="text-sm text-gray-700">${outfit.price}</p>
          )}
        </div>
      </motion.div>

      {/* Buttons under the card */}
      <div className="flex space-x-6">
        <button
          onClick={dislike}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl shadow-md hover:bg-red-600 transition"
        >
          ✕
        </button>
        <button
          onClick={like}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white text-2xl shadow-md hover:bg-green-600 transition"
        >
          ✓
        </button>
      </div>
    </div>
  );
}

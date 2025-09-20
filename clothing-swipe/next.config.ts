/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.aloyoga.com",  // 👈 from your dataset
      "cdn.shopify.com",     // 👈 add any other domains you see in your CSV
      "placehold.co"         // 👈 for placeholder images if you used them
    ],
  },
};

module.exports = nextConfig;

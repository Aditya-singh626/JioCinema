/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: ["image.tmdb.org"], // ✅ allow TMDB images
    qualities: [30, 75],           
  },
};

export default nextConfig;

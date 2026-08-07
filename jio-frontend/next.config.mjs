/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: ["image.tmdb.org","localhost"], // ✅ allow TMDB images         
  },
};

export default nextConfig;

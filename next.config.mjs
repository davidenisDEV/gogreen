/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite carregar imagens de qualquer lugar (Unsplash, etc)
      },
    ],
  },
};

export default nextConfig;
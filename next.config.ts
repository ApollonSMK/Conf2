
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bucket.xyziow3.space',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bucket.confrariasportugal.pt',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '89a01d3a07aec76b3caaaac5d9c71e51.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

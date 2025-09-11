
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
      }
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async redirects() {
      return [
        {
          source: '/do', // The URL to redirect from
          destination: '/do/forms/effort&landing', // The URL to redirect to
          permanent: true, // Set to `false` for a temporary redirect (302)
        },
      ];
    },
  };
  
  export default nextConfig;
  
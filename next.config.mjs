/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com"
            },
            {
                hostname: "firebasestorage.googleapis.com"
            },
            {
                hostname: "https://lh3.googleusercontent.com"
            }
        ]
    }
};

export default nextConfig;

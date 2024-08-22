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
                hostname: "lh3.googleusercontent.com"
            },
            {
                hostname: "img.icons8.com"
            }
        ]
    }
};

export default nextConfig;

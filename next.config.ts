// import type { NextConfig } from "next";
// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
// });

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;
const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
});

module.exports = withPWA({
	turbopack: {},
});

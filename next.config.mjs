/** @type {import('next').NextConfig} */
// import axios from "axios";
// import cron from "node-cron";

// cron.schedule("*/30 * * * * *", async function () {
//   console.log("Say scheduled hello");
//   try {
//     await axios.get("http://localhost:3000/api/streak");
//   } catch (error) {
//     console.log("Error in cron job");
//   }
// });

const nextConfig = {
  reactStrictMode: false,
};

export default nextConfig;

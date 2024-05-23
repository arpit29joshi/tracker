const express = require("express");
const next = require("next");
const cron = require("node-cron");
const axios = require("axios");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Log to ensure the server starts
  console.log("Starting server...");

  // Set up cron job after the server is ready
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");

    // Custom cron job running every 30 seconds
    cron.schedule("*/1 * * * * *", async function () {
      console.log("Cron job executed");
      try {
        const response = await axios.get("http://localhost:3000/api/streak");
        console.log("API response:", response.data);
      } catch (error) {
        console.log("Error in cron job:", error);
      }
    });
  });

  // All other routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

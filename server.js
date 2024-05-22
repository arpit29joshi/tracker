// server.js
const express = require("express");
const next = require("next");
const cron = require("node-cron");
const axios = require("axios");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Custom cron job running every 30 minutes
  cron.schedule("*/10 * * * *", async function () {
    console.log("Say scheduled hello");
    try {
      await axios.get("http://localhost:3000/api/streak");
    } catch (error) {
      console.log("Error in cron job:", error);
    }
  });

  // All other routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});

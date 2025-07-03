const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow all origins

const PORT = 5000;

app.get("/coins/markets", async (req, res) => {
  let { currency = "usd" } = req.query;

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching /coins/markets:", err.message);
    res.status(500).json({ error: "Failed to fetch coin markets" });
  }
});

// 📌 2. Get Single Coin Data
app.get("/coins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 3. Get Historical Chart Data
app.get("/coins/:id/market_chart", async (req, res) => {
  const { id } = req.params;
  const { days, currency } = req.query;
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: currency,
          days: days || 365,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 4. Get Trending Coins
app.get("/trending", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/search/trending"
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});

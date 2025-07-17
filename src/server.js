// server.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 5000;

app.get("/search", async (req, res) => {
  const query = req.query.q || "a-line kurti";
  const source = req.query.source || "flipkart";
  const results = [];

  try {
    if (source === "flipkart") {
      const url = `https://www.flipkart.com/search?q=${query.replace(/ /g, "+")}`;
      const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const $ = cheerio.load(data);

      $("div._2kHMtA").each((_, el) => {
        const title = $(el).find("div._4rR01T").text();
        const price = $(el).find("div._30jeq3").text();
        const link = "https://www.flipkart.com" + $(el).find("a").attr("href");
        if (title && price && link) results.push({ title, price, link });
      });
    }

    if (source === "amazon") {
      const url = `https://www.amazon.in/s?k=${query.replace(/ /g, "+")}`;
      const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const $ = cheerio.load(data);

      $("div.s-result-item").each((_, el) => {
        const title = $(el).find("span.a-text-normal").first().text();
        const price = $(el).find("span.a-price-whole").first().text();
        const link = "https://www.amazon.in" + $(el).find("a.a-link-normal").attr("href");
        if (title && price && link) results.push({ title, price: "₹" + price, link });
      });
    }

    res.json(results.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: "Scraping failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Scraper running on http://localhost:${PORT}`);
});

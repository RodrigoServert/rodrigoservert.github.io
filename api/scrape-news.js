const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeNews(dateStr) {
    // ... código de scraping ...
}

module.exports = async (req, res) => {
    try {
        const data = await scrapeNews();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
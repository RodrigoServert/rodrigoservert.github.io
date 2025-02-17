const { scrapeNews } = require('../scripts/scrapeNews');

module.exports = async (req, res) => {
    try {
        const data = await scrapeNews();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
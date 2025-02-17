const { scrapeNews } = require('../scripts/scrapeNews');

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    try {
        const date = req.query.date; // Por si enviamos una fecha específica
        const news = await scrapeNews(date);
        res.json(news);
    } catch (error) {
        console.error('Error en API:', error);
        res.status(500).json({ error: error.message });
    }
}; 
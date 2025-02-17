const { scrapeNews } = require('../scripts/scrapeNews');

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    try {
        console.log('API: Iniciando scrape-news');
        const date = req.query.date;
        console.log('API: Fecha recibida:', date);
        
        const news = await scrapeNews(date);
        console.log('API: Scraping completado');
        
        res.json(news);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}; 
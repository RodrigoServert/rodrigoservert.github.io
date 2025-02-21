const { scrapeNews } = require('./lib/scraper');

module.exports = async (req, res) => {
    console.log('API: Endpoint llamado');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Si es una solicitud OPTIONS, responder inmediatamente
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        console.log('API: Iniciando scraping');
        const news = await scrapeNews();
        console.log('API: Scraping completado');
        res.json(news);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}; 
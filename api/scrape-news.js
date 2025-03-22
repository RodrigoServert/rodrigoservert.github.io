// Archivo placeholder para api/scrape-news.js
const { scrapeNews, getDefaultNews } = require('./lib/scraper');

module.exports = async (req, res) => {
    try {
        // Configurar CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Si es una solicitud OPTIONS, responder inmediatamente
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        
        // Placeholder - devuelve noticias por defecto
        const result = await scrapeNews();
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Error obteniendo noticias',
            message: error.message 
        });
    }
}; 
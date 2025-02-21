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
    
    // Usar el scraper real en lugar de noticias de prueba
    try {
        const result = await scrapeNews();
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error obteniendo noticias',
            message: error.message 
        });
    }
};

// Función temporal para noticias por defecto
function getDefaultNews() {
    return {
        news: [
            {
                category: "Test",
                title: "Test News",
                text: "This is a test news item"
            }
        ]
    };
} 
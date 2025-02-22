console.log('=== NUEVO DEPLOY ' + new Date().toISOString() + ' ===');
const { scrapeNews } = require('./lib/scraper');

module.exports = async (req, res) => {
    try {
        console.log('1. Función iniciada');
        console.log('API: Iniciando endpoint', {
            method: req.method,
            url: req.url,
            timestamp: new Date().toISOString(),
            headers: req.headers
        });
        
        console.log('2. Antes de CORS');
        // Configurar CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        console.log('3. Después de CORS');
        
        // Si es una solicitud OPTIONS, responder inmediatamente
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        
        console.log('4. Antes de scrapeNews');
        const result = await scrapeNews();
        console.log('5. Después de scrapeNews');
        console.log('Resultado del scraping:', result);
        res.json(result);
    } catch (error) {
        console.log('X. Error capturado:', error);
        // Importar getDefaultNews y usarlo aquí también
        const { getDefaultNews } = require('./lib/scraper');
        const defaultNews = getDefaultNews();
        console.log('Enviando noticias por defecto');
        res.status(200).json({ 
            news: defaultNews.news,
            isUpdated: false
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
const { scrapeNews } = require('./lib/scraper');

module.exports = async (req, res) => {
    console.log('API: Endpoint llamado');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://rodrigoservert.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Si es una solicitud OPTIONS, responder inmediatamente
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Respuesta temporal para debug
    res.json({ test: 'API funcionando', timestamp: new Date().toISOString() });
}; 
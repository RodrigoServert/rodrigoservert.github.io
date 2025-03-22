// Archivo placeholder para api/scrape-news.js
const { scrapeNews, getDefaultNews } = require('./lib/scraper');

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Manejar peticiones OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        console.log('Iniciando petición a scrape-news endpoint');
        
        // Obtener titulares de TechCrunch usando nuestro scraper actualizado
        const headlines = await scrapeNews();
        
        console.log(`Titulares obtenidos: ${headlines.length || 0}`);
        
        // Devolver los resultados
        res.status(200).json(headlines);
    } catch (error) {
        console.error('Error en el endpoint scrape-news:', error);
        
        // En caso de error, devolver titulares por defecto
        const defaultNews = getDefaultNews();
        
        res.status(500).json({
            error: 'Error obteniendo los titulares',
            message: error.message,
            defaultNews: defaultNews
        });
    }
}; 
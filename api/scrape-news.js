// Archivo api/scrape-news.js optimizado para Vercel
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
        console.log('Iniciando petición a scrape-news endpoint en Vercel');
        
        let headlines = [];
        
        try {
            // Intentamos obtener titulares con el scraper
            headlines = await scrapeNews();
            console.log(`Titulares obtenidos: ${headlines.length || 0}`);
        } catch (scrapeError) {
            console.error('Error en scraping:', scrapeError);
            // Si falla el scraping, usamos noticias por defecto
            headlines = getDefaultNews();
            console.log('Usando titulares por defecto');
        }
        
        // Verificar que headlines sea un array
        if (!Array.isArray(headlines) || headlines.length === 0) {
            console.log('No se obtuvieron titulares o el formato es incorrecto. Usando titulares por defecto.');
            headlines = getDefaultNews();
        }
        
        // Devolver los resultados
        return res.status(200).json(headlines);
    } catch (error) {
        console.error('Error general en el endpoint scrape-news:', error);
        
        // En caso de error, devolver titulares por defecto
        const defaultNews = getDefaultNews();
        
        return res.status(200).json(defaultNews);
    }
}; 
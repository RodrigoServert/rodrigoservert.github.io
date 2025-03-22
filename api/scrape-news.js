// Archivo api/scrape-news.js optimizado para Vercel
const { scrapeNews, getDefaultNews } = require('./lib/scraper');

module.exports = async (req, res) => {
    console.log('Iniciando endpoint scrape-news en Vercel');
    
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
        console.log('Obteniendo titulares RSS desde TechCrunch');
        
        let headlines = [];
        
        try {
            // Intentamos obtener titulares con el feed RSS
            headlines = await scrapeNews();
            console.log(`Titulares obtenidos del RSS: ${headlines.length || 0}`);
        } catch (scrapeError) {
            console.error('Error al procesar RSS:', scrapeError);
            console.error('Stack trace:', scrapeError.stack);
            // Si falla, usamos noticias por defecto
            headlines = getDefaultNews();
            console.log('Usando titulares por defecto debido a error en RSS');
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
        console.error('Stack trace:', error.stack);
        
        // En caso de error, devolver titulares por defecto
        const defaultNews = getDefaultNews();
        
        return res.status(200).json(defaultNews);
    }
}; 
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
        // Configurar CORS - Permitir todas las solicitudes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        console.log('3. Después de CORS');
        
        // Si es una solicitud OPTIONS, responder inmediatamente
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            console.log('Respondiendo a solicitud OPTIONS');
            return;
        }
        
        console.log('4. Antes de scrapeNews');
        try {
            const result = await scrapeNews();
            console.log('5. Después de scrapeNews - Resultado:', {
                newsCount: result.news ? result.news.length : 0,
                isUpdated: result.isUpdated
            });
            
            // Verificar que el resultado es válido
            if (!result || !result.news) {
                throw new Error('Resultado de scrapeNews inválido');
            }
            
            // Añadir encabezados para evitar caché
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Surrogate-Control', 'no-store');
            
            res.status(200).json(result);
            console.log('6. Respuesta enviada correctamente');
        } catch (scrapeError) {
            console.error('Error en scrapeNews:', scrapeError);
            // Intentar con noticias por defecto
            const defaultNews = getDefaultNews();
            console.log('Enviando noticias por defecto debido a error en scraping');
            res.status(200).json({ 
                news: defaultNews.news, 
                isUpdated: false,
                error: scrapeError.message
            });
        }
    } catch (error) {
        console.log('X. Error capturado:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error obteniendo noticias',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Función para noticias por defecto
function getDefaultNews() {
    return {
        news: [
            {
                category: "Technology",
                title: "Apple's Vision Pro Launches Globally 🥽",
                text: "Apple's mixed reality headset is now available worldwide, marking a significant milestone in consumer AR/VR technology.",
                link: "https://www.apple.com/vision-pro"
            },
            {
                category: "AI",
                title: "Claude 3 Sets New AI Benchmark 🤖",
                text: "Anthropic's latest AI model demonstrates unprecedented capabilities in reasoning and safety features.",
                link: "https://www.anthropic.com"
            },
            {
                category: "Innovation",
                title: "SpaceX's Starship Completes Full Flight 🚀",
                text: "The latest test of SpaceX's Starship successfully demonstrated all flight phases, including reentry.",
                link: "https://www.spacex.com"
            },
            {
                category: "Tech",
                title: "EU Passes Landmark AI Regulation 🇪🇺",
                text: "The European Union has approved comprehensive AI regulations, setting global standards for AI development.",
                link: "https://ec.europa.eu"
            }
        ]
    };
} 
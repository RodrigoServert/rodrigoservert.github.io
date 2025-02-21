const axios = require('axios');
const cheerio = require('cheerio');

async function getTechCrunchImage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 3000 // Timeout de 3 segundos para imágenes
        });
        const $ = cheerio.load(response.data);
        // Buscar la imagen en los metadatos de Open Graph
        const imageUrl = $('meta[property="og:image"]').attr('content');
        return imageUrl || null;
    } catch (error) {
        console.log(`Error obteniendo imagen de TechCrunch: ${error.message}`);
        return null;
    }
}

async function scrapeNews(dateStr) {
    try {
        console.log('Iniciando scraping de TLDR.tech...');
        const startTime = Date.now();
        
        // Log de memoria inicial
        const initialMemory = process.memoryUsage();
        console.log('Memoria inicial:', {
            heapUsed: Math.round(initialMemory.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(initialMemory.heapTotal / 1024 / 1024) + 'MB'
        });
        
        // Si no se proporciona fecha, empezar con la fecha actual
        let currentDate = dateStr 
            ? new Date(dateStr) 
            : new Date();
            
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                console.log(`Intento ${attempts + 1} de ${maxAttempts}`);
                console.log('Tiempo transcurrido:', Date.now() - startTime + 'ms');
                
                const formattedDate = currentDate.toLocaleDateString('en-CA', {
                    timeZone: 'Europe/Madrid'
                });
                
                const url = `https://tldr.tech/tech/${formattedDate}`;
                console.log('Intentando con URL:', url);
                
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 5000 // Añadir timeout de 5 segundos
                });
                
                console.log('Respuesta de TLDR recibida en:', Date.now() - startTime + 'ms');
                const $ = cheerio.load(response.data);
                console.log('Cheerio cargado en:', Date.now() - startTime + 'ms');

                // Log de memoria después de cargar Cheerio
                const afterCheerioMemory = process.memoryUsage();
                console.log('Memoria después de Cheerio:', {
                    heapUsed: Math.round(afterCheerioMemory.heapUsed / 1024 / 1024) + 'MB',
                    heapTotal: Math.round(afterCheerioMemory.heapTotal / 1024 / 1024) + 'MB'
                });

                const news = [];

                if ($('h1').text().includes('Keep up with tech in 5 minutes')) {
                    throw new Error('Página principal detectada');
                }

                // Procesar noticias de forma secuencial
                $('a').each((i, element) => {
                    const title = $(element).text().trim();
                    const text = $(element).parent().text().trim().replace(title, '').trim();
                    const link = $(element).attr('href');

                    if (title && text && 
                        (title.includes('minute read') || title.includes('GitHub Repo')) && 
                        !title.includes('Sponsor')) {
                        
                        const cleanTitle = title.replace(/\(\d+ minute read\)/g, '').trim();
                        
                        // Añadir la noticia inmediatamente sin imagen
                        news.push({
                            category: currentDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }),
                            title: cleanTitle,
                            text,
                            link
                        });
                    }
                });

                // Si tenemos noticias, intentar obtener imágenes solo para las primeras 3
                if (news.length > 0) {
                    const techCrunchArticles = news
                        .filter(item => item.link && item.link.includes('techcrunch.com'))
                        .slice(0, 3);
                    
                    console.log(`Encontrados ${techCrunchArticles.length} artículos de TechCrunch`);
                    
                    try {
                        await Promise.race([
                            Promise.all(techCrunchArticles.map(async article => {
                                const startTime = Date.now();
                                try {
                                    article.image = await getTechCrunchImage(article.link);
                                    console.log(`Imagen para "${article.title}": ${article.image ? 'OK' : 'No encontrada'} (${Date.now() - startTime}ms)`);
                                } catch (error) {
                                    console.log(`Error obteniendo imagen para "${article.title}" (${Date.now() - startTime}ms):`, error.message);
                                }
                            })),
                            new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Timeout obteniendo imágenes')), 5000)
                            )
                        ]);
                    } catch (error) {
                        console.log('⚠️ ' + error.message);
                    }
                    
                    return { news, isUpdated: true };
                }
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error.message);
            }

            currentDate.setDate(currentDate.getDate() - 1);
            attempts++;
        }

        console.log('No se encontró una newsletter válida en los últimos 3 días');
        return { news: getDefaultNews().news, isUpdated: false };
    } catch (error) {
        console.error('Error en scraping:', error.message);
        return { news: getDefaultNews().news, isUpdated: false };
    }
}

function getDefaultNews() {
    return {
        "news": [
            {
                "category": "Technology",
                "title": "Apple Reveals New iPhone 16 📱",
                "text": "Apple unveiled its latest smartphone, the iPhone 16, at its annual fall event. The new phone features a larger display, improved camera system, and faster processor."
            },
            // ... resto de noticias por defecto ...
        ]
    };
}

// Mapear categorías de TLDR a nuestras categorías
function mapCategory(tldrCategory) {
    const categoryMap = {
        'Tech': 'Technology',
        'AI': 'Technology',
        'Science': 'Science',
        'Product': 'Innovation',
        'Webdev': 'Technology',
        'Design': 'Arts'
    };
    return categoryMap[tldrCategory] || 'Technology';
}

module.exports = { scrapeNews }; 
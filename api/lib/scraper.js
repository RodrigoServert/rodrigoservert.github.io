const axios = require('axios');
const cheerio = require('cheerio');

async function getTechCrunchImage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
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
        console.log('Fecha recibida:', dateStr);
        
        // Si no se proporciona fecha, empezar con la fecha actual
        let currentDate = dateStr 
            ? new Date(dateStr) 
            : new Date();
            
        let attempts = 0;
        const maxAttempts = 3; // Reducir a 3 días
        
        while (attempts < maxAttempts) {
            try {
                console.log(`Intento ${attempts + 1} de ${maxAttempts}`);
                // Formatear la fecha en YYYY-MM-DD usando la zona horaria española
                const formattedDate = currentDate.toLocaleDateString('en-CA', { // en-CA da formato YYYY-MM-DD
                    timeZone: 'Europe/Madrid'
                });
                
                const url = `https://tldr.tech/tech/${formattedDate}`;
                console.log('Intentando con URL:', url);
                
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    },
                    maxRedirects: 0
                });
                
                const $ = cheerio.load(response.data);
                const news = [];
                const newsPromises = [];

                if ($('h1').text().includes('Keep up with tech in 5 minutes')) {
                    throw new Error('Página principal detectada');
                }

                // Recolectar todas las noticias primero
                $('a').each((i, element) => {
                    const title = $(element).text().trim();
                    const text = $(element).parent().text().trim().replace(title, '').trim();
                    const link = $(element).attr('href');

                    if (title && text && 
                        (title.includes('minute read') || title.includes('GitHub Repo')) && 
                        !title.includes('Sponsor')) {
                        
                        const cleanTitle = title.replace(/\(\d+ minute read\)/g, '').trim();
                        
                        // Crear una promesa para cada noticia
                        const newsPromise = (async () => {
                            let imageUrl = null;
                            if (link && link.includes('techcrunch.com')) {
                                imageUrl = await getTechCrunchImage(link);
                                console.log(`Imagen obtenida para ${cleanTitle}:`, imageUrl);
                            }

                            return {
                                category: currentDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }),
                                title: cleanTitle,
                                text,
                                link,
                                image: imageUrl
                            };
                        })();

                        newsPromises.push(newsPromise);
                    }
                });

                // Esperar a que todas las promesas se resuelvan
                const newsItems = await Promise.all(newsPromises.slice(0, 5)); // Máximo 5 imágenes
                news.push(...newsItems);

                if (news.length > 0) {
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
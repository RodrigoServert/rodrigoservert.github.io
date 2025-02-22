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
        
        let currentDate = dateStr ? new Date(dateStr) : new Date();
        let attempts = 0;
        const maxAttempts = 7;
        
        while (attempts < maxAttempts) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            const url = `https://tldr.tech/tech/${formattedDate}`;
            
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 3000
                });
                
                const $ = cheerio.load(response.data);
                const pageTitle = $('h1').text().trim();
                
                if (!pageTitle.includes('TLDR')) {
                    console.log(`Fecha ${formattedDate}: No es newsletter TLDR`);
                    currentDate.setDate(currentDate.getDate() - 1);
                    attempts++;
                    continue;
                }

                console.log(`Fecha ${formattedDate}: Newsletter TLDR encontrada`);
                const news = [];
                
                // Buscar todos los artículos
                $('h3').each((_, element) => {
                    const title = $(element).text().trim();
                    const link = $(element).find('a').attr('href');
                    const newsletterHtml = $(element).parent().find('div.newsletter-html');
                    const text = newsletterHtml.text().trim();
                    
                    if (title && text) {
                        news.push({ 
                            category: 'Tech',
                            title,
                            text,
                            link
                        });
                    }
                });

                if (news.length > 0) {
                    console.log(`Encontrados ${news.length} artículos`);
                    return { news, isUpdated: true };
                }

                console.log('No se encontraron artículos en esta newsletter');
                
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}: ${error.message}`);
            }
            
            currentDate.setDate(currentDate.getDate() - 1);
            attempts++;
        }

        console.log('No se encontró una newsletter válida después de 7 intentos');
        return { news: getDefaultNews().news, isUpdated: false };
        
    } catch (error) {
        console.error('Error en scraping:', error);
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
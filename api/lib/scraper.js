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
        
        let currentDate = dateStr 
            ? new Date(dateStr) 
            : new Date();
            
        let attempts = 0;
        const maxAttempts = 7;
        
        while (attempts < maxAttempts) {
            try {
                const formattedDate = currentDate.toISOString().split('T')[0];
                const url = `https://tldr.tech/tech/${formattedDate}`;
                
                console.log(`Intento ${attempts + 1}/${maxAttempts} con URL: ${url}`);
                
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 5000
                });
                
                const $ = cheerio.load(response.data);
                
                // Validación de página principal
                const pageTitle = $('h1').text().trim();
                console.log('Título de la página:', pageTitle);

                if (pageTitle === 'Keep up with tech in 5 minutes') {
                    console.log('Detectada página principal, probando con fecha anterior');
                    currentDate.setDate(currentDate.getDate() - 1);
                    attempts++;
                    continue;
                }

                // Si llegamos aquí, tenemos una newsletter válida
                console.log('Newsletter válida encontrada, procesando contenido...');
                
                const news = [];
                
                // Procesar cada artículo de la newsletter
                $('h3').each((i, element) => {
                    const title = $(element).text().trim();
                    const articleContainer = $(element).parent();
                    const text = articleContainer.find('p').text().trim();
                    const link = articleContainer.find('a').attr('href');
                    
                    if (title && text) {
                        news.push({
                            category: 'Tech',
                            title,
                            text,
                            link
                        });
                        console.log('Encontrado artículo:', { title });
                    }
                });

                if (news.length > 0) {
                    console.log(`Encontrados ${news.length} artículos`);
                    return { news, isUpdated: true }; // Retornamos inmediatamente al encontrar artículos
                }

            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error.message);
            }

            currentDate.setDate(currentDate.getDate() - 1);
            attempts++;
        }

        console.log('No se encontró una newsletter válida en los últimos 7 días');
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
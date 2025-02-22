const axios = require('axios');
const cheerio = require('cheerio');

// Noticias por defecto
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

async function getTechCrunchImage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000,
            maxRedirects: 5
        });
        
        const $ = cheerio.load(response.data);
        
        // Intentar diferentes selectores para la imagen
        let imageUrl = $('figure.wp-block-post-featured-image img').attr('src') ||
                      $('img.attachment-post-thumbnail').attr('src') ||
                      $('meta[property="og:image"]').attr('content');
        
        return imageUrl || null;
    } catch (error) {
        console.log(`Error obteniendo imagen de TechCrunch: ${error.message}`);
        return null;
    }
}

async function scrapeNews() {
    try {
        console.log('Iniciando scraping de TLDR.tech...');
        
        // Empezar con la fecha actual
        const today = new Date();
        const maxAttempts = 4; // Máximo 4 días hacia atrás
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() - attempt);
            
            // Formatear fecha como YYYY-MM-DD
            const formattedDate = targetDate.toISOString().split('T')[0];
            const url = `https://tldr.tech/tech/${formattedDate}`;
            
            console.log(`Intento ${attempt + 1}/${maxAttempts} con fecha: ${formattedDate}`);
            
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 5000,
                    maxRedirects: 5
                });
                
                const $ = cheerio.load(response.data);
                // Debug: Ver URL final después de posibles redirecciones
                console.log('URL final:', response.request.res.responseUrl);
                
                // Debug: Ver estructura general de la página
                console.log('Elementos principales:', {
                    bodyClasses: $('body').attr('class'),
                    mainContent: $('#main-content').length,
                    allH3: $('h3').length,
                    pageHtml: response.data.substring(0, 500) + '...'
                });
                
                const pageTitle = $('h1').text().trim();
                
                console.log('Título de la página:', pageTitle);
                
                // Verificar si estamos en la home (redirección)
                if (pageTitle === 'Keep up with tech in 5 minutes') {
                    console.log('Detectada redirección a home, probando con fecha anterior');
                    continue;
                }
                
                // Verificar si es una newsletter válida (debe contener "TLDR")
                if (!pageTitle.includes('TLDR')) {
                    console.log('Página no válida, probando con fecha anterior');
                    continue;
                }
                
                // Si llegamos aquí, tenemos una newsletter válida
                console.log('Newsletter válida encontrada, procesando artículos...');
                
                // Debug: Verificar estructura HTML
                console.log('Estructura de artículos:', {
                    totalArticles: $('.article').length,
                    hasH3: $('.article h3').length,
                    hasNewsletterHtml: $('.article .newsletter-html').length
                });
                
                const news = [];
                
                // Procesar cada artículo
                $('.article').each(async (i, element) => {
                    const title = $(element).find('h3').text().trim();
                    const link = $(element).find('h3 a').attr('href');
                    const text = $(element).find('.newsletter-html').text().trim();
                    
                    // Debug: Verificar datos extraídos
                    console.log('Datos extraídos:', {
                        title,
                        link,
                        textLength: text?.length,
                        rawHtml: $(element).html().substring(0, 100) + '...'
                    });

                    if (title && text) {
                        const newsItem = {
                            category: 'Tech',
                            title,
                            text,
                            link
                        };
                        
                        // Si es un artículo de TechCrunch, obtener la imagen
                        if (link && link.includes('techcrunch.com')) {
                            const image = await getTechCrunchImage(link);
                            if (image) {
                                newsItem.image = image;
                            }
                        }
                        
                        news.push(newsItem);
                        console.log('Artículo procesado:', { title, hasImage: !!newsItem.image });
                    }
                });
                
                if (news.length > 0) {
                    console.log(`Encontrados ${news.length} artículos`);
                    return { news, isUpdated: true };
                }
                
                console.log('No se encontraron artículos en la página');
                
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error.message);
            }
        }
        
        console.log('No se encontró una newsletter válida en los últimos 4 días');
        return { news: getDefaultNews().news, isUpdated: false };
        
    } catch (error) {
        console.error('Error en scraping:', error);
        console.log('Retornando noticias por defecto debido a error');
        return { news: getDefaultNews().news, isUpdated: false };
    }
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

module.exports = { scrapeNews, getDefaultNews }; 
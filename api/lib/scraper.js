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
        const totalStartTime = Date.now();
        console.log('Iniciando scraping de TLDR.tech...');
        
        let currentDate = dateStr 
            ? new Date(dateStr) 
            : new Date();
            
        let attempts = 0;
        const maxAttempts = 7; // Aumentamos a 7 días
        
        while (attempts < maxAttempts) {
            try {
                const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                const url = `https://tldr.tech/tech/${formattedDate}`;
                
                console.log(`Intento ${attempts + 1}/${maxAttempts} con URL: ${url}`);
                
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 5000
                });
                
                const $ = cheerio.load(response.data);
                
                // Mejor validación para detectar la página principal
                if ($('title').text().includes('TLDR Newsletter') || 
                    $('body').text().includes('Keep up with tech in 5 minutes a day')) {
                    console.log(`URL ${url} redirige a página principal, probando con fecha anterior`);
                    throw new Error('Página principal detectada');
                }

                // Procesar noticias solo si no es la página principal
                const news = [];
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
                    
                    console.log(`🔍 Encontrados ${techCrunchArticles.length} artículos de TechCrunch para procesar`);
                    
                    try {
                        await Promise.race([
                            Promise.all(techCrunchArticles.map(async (article, index) => {
                                const startTime = Date.now();
                                try {
                                    article.image = await getTechCrunchImage(article.link);
                                    console.log(`📸 [${index + 1}/${techCrunchArticles.length}] Imagen: ${article.image ? '✅' : '❌'} (${Date.now() - startTime}ms)`);
                                } catch (error) {
                                    console.log(`❌ [${index + 1}/${techCrunchArticles.length}] Error: ${error.message} (${Date.now() - startTime}ms)`);
                                }
                            })),
                            new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Timeout obteniendo imágenes')), 5000)
                            )
                        ]);
                    } catch (error) {
                        console.log('⚠️ ' + error.message);
                    }
                    
                    console.log(`✨ Scraping completado en ${Date.now() - totalStartTime}ms`);
                    return { news, isUpdated: true };
                }
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error.message);
            }

            // Restar un día y continuar
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
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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
                const browser = await puppeteer.launch({
                    headless: 'new',
                    args: ['--no-sandbox']
                });
                const page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle0' });
                
                // Esperar a que el contenido se cargue
                await page.waitForSelector('article', { timeout: 5000 });
                
                const articles = await page.evaluate(() => {
                    const news = [];
                    document.querySelectorAll('article').forEach(article => {
                        const titleElement = article.querySelector('h3');
                        const contentElement = article.querySelector('.newsletter-html');
                        
                        if (titleElement && contentElement) {
                            news.push({
                                category: 'Tech',
                                title: titleElement.textContent.trim(),
                                text: contentElement.textContent.trim(),
                                link: article.querySelector('a')?.href || ''
                            });
                        }
                    });
                    return news;
                });

                await browser.close();
                
                if (articles.length > 0) {
                    console.log(`Encontrados ${articles.length} artículos para la fecha ${formattedDate}`);
                    return { news: articles, isUpdated: true };
                }
                
                console.log(`No se encontraron artículos para la fecha ${formattedDate}`);
                
            } catch (error) {
                console.error(`Error al procesar la fecha ${formattedDate}:`, error);
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
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
        console.log('Iniciando scraping de TLDR.tech con URL fija...');
        
        // URL fija proporcionada por el usuario
        const fixedUrl = 'https://tldr.tech/tech/2025-02-21';
        console.log(`Usando URL fija: ${fixedUrl}`);
        
        // Headers con User-Agent más moderno y completo
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };

        try {
            console.log(`Intentando acceder a: ${fixedUrl}`);
            
            const response = await axios.get(fixedUrl, {
                headers,
                timeout: 15000, // 15 segundos de timeout
                maxRedirects: 5
            });

            console.log(`Respuesta recibida con status: ${response.status}`);
            
            // Guardar el HTML para depuración
            const htmlContent = response.data;
            console.log(`Longitud del HTML: ${htmlContent.length} caracteres`);
            
            // Guardar una muestra del HTML para inspección
            const htmlSample = htmlContent.substring(0, 500) + '... [truncado]';
            console.log('Muestra del HTML:', htmlSample);
            
            // Verificar si la página contiene contenido relevante
            if (!htmlContent.includes('TLDR Tech') && !htmlContent.includes('Big Tech & Startups')) {
                console.log('La página no parece contener una newsletter de TLDR Tech');
                return { news: getDefaultNews().news, isUpdated: false };
            }
            
            const $ = cheerio.load(htmlContent);
            
            console.log('Analizando estructura de la página...');
            
            // Buscar secciones específicas
            const sections = [
                { title: 'Big Tech & Startups', keyword: 'Big Tech' },
                { title: 'Science & Futuristic Technology', keyword: 'Science' },
                { title: 'Programming, Design & Data Science', keyword: 'Programming' },
                { title: 'Miscellaneous', keyword: 'Miscellaneous' },
                { title: 'Quick Links', keyword: 'Quick Links' }
            ];
            
            const news = [];
            
            // Intentar diferentes selectores para encontrar las secciones
            const possibleSectionSelectors = [
                'h3', 'h2', 'h4', '.newsletter-section-title', 
                'strong', 'div.section-header', '.title-container h3', 
                '[data-testid="section-title"]'
            ];
            
            // Probar cada selector
            for (const selector of possibleSectionSelectors) {
                console.log(`Probando selector: ${selector}`);
                const elements = $(selector);
                console.log(`Encontrados ${elements.length} elementos con selector ${selector}`);
                
                // Mostrar los primeros 5 elementos para depuración
                elements.slice(0, 5).each((i, el) => {
                    console.log(`  Elemento ${i+1}: "${$(el).text().trim().substring(0, 50)}..."`);
                });
                
                // Buscar secciones por sus títulos
                for (const section of sections) {
                    const sectionElements = elements.filter(function() {
                        return $(this).text().includes(section.keyword);
                    });
                    
                    if (sectionElements.length > 0) {
                        console.log(`Encontrada sección "${section.title}" con selector ${selector}`);
                        
                        sectionElements.each((i, sectionEl) => {
                            // Obtener el contenido siguiente hasta la próxima sección
                            let nextElements = $(sectionEl).nextUntil(selector);
                            console.log(`  Encontrados ${nextElements.length} elementos siguientes`);
                            
                            // Buscar artículos en los elementos siguientes
                            nextElements.each((j, el) => {
                                const element = $(el);
                                
                                // Si es un párrafo y contiene texto
                                if ((element.is('p') || element.is('div')) && element.text().trim()) {
                                    // Buscar título en negrita o al inicio del párrafo
                                    let title = '';
                                    let text = '';
                                    
                                    // Caso 1: Título en negrita
                                    const strongEl = element.find('strong').first();
                                    if (strongEl.length) {
                                        title = strongEl.text().trim();
                                        // Texto es el resto del párrafo
                                        text = element.text().replace(title, '').trim();
                                    } 
                                    // Caso 2: Título seguido de paréntesis (tiempo de lectura)
                                    else {
                                        const titleMatch = element.text().match(/(.*?)\s*\(\d+\s*minute read\)/i);
                                        if (titleMatch) {
                                            title = titleMatch[1].trim();
                                            
                                            // Buscar el texto en el siguiente párrafo
                                            const nextP = element.next('p');
                                            if (nextP.length) {
                                                text = nextP.text().trim();
                                            } else {
                                                // Si no hay siguiente párrafo, usar el resto del texto actual
                                                text = element.text().replace(titleMatch[0], '').trim();
                                            }
                                        }
                                    }
                                    
                                    // Si encontramos título y texto, añadir a las noticias
                                    if (title && text) {
                                        news.push({
                                            category: mapCategory(section.title.split(' ')[0]),
                                            title,
                                            text,
                                            link: '#'
                                        });
                                        console.log(`  Artículo añadido: "${title.substring(0, 30)}..."`);
                                    }
                                }
                            });
                        });
                    }
                }
                
                // Si encontramos suficientes noticias, terminamos
                if (news.length >= 5) {
                    console.log(`Encontradas ${news.length} noticias. Suficiente para continuar.`);
                    break;
                }
            }
            
            if (news.length > 0) {
                console.log(`Total de noticias encontradas: ${news.length}`);
                return { news, isUpdated: true };
            } else {
                console.log('No se encontraron noticias en la página');
                return { news: getDefaultNews().news, isUpdated: false };
            }
            
        } catch (error) {
            console.error(`Error accediendo a ${fixedUrl}:`, error.message);
            if (error.response) {
                console.log(`Status: ${error.response.status}`);
            }
            return { news: getDefaultNews().news, isUpdated: false };
        }
        
    } catch (error) {
        console.error('Error general en scraping:', error);
        return { news: getDefaultNews().news, isUpdated: false };
    }
}

// Mapear categorías de TLDR a nuestras categorías
function mapCategory(tldrCategory) {
    const categoryMap = {
        'Tech': 'Technology',
        'Big': 'Technology',
        'AI': 'Technology',
        'Science': 'Science',
        'Futuristic': 'Science',
        'Programming': 'Technology',
        'Design': 'Arts',
        'Data': 'Technology',
        'Miscellaneous': 'Culture',
        'Quick': 'Technology'
    };
    return categoryMap[tldrCategory] || 'Technology';
}

module.exports = { scrapeNews, getDefaultNews }; 
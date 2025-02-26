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
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        };

        const today = new Date();
        const maxAttempts = 4;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() - attempt);
                const formattedDate = targetDate.toISOString().split('T')[0];
                const url = `https://tldr.tech/tech/${formattedDate}`;
                
                console.log(`\n=== Intento ${attempt + 1} ===`);
                console.log(`Intentando scraping de: ${url}`);
                
                const response = await axios.get(url, {
                    headers,
                    timeout: 10000, // Aumentar timeout a 10 segundos
                    maxRedirects: 5
                });

                console.log(`Respuesta recibida con status: ${response.status}`);
                
                // Guardar el HTML para depuración
                const htmlContent = response.data;
                console.log(`Longitud del HTML: ${htmlContent.length} caracteres`);
                
                // Verificar si la página contiene contenido relevante
                if (!htmlContent.includes('TLDR Tech') && !htmlContent.includes('Big Tech & Startups')) {
                    console.log('La página no parece contener una newsletter de TLDR Tech');
                    continue;
                }
                
                const $ = cheerio.load(htmlContent);
                
                // Detectar la estructura de la página
                console.log('Analizando estructura de la página...');
                
                // Intentar diferentes selectores para encontrar las secciones
                const possibleSectionSelectors = [
                    'h3', // Selector original
                    'h2', // Posible cambio a h2
                    '.newsletter-section-title', // Posible clase específica
                    'strong:contains("Big Tech")', // Texto en negrita
                    'div.section-header' // Otro posible selector
                ];
                
                let sectionSelector = '';
                for (const selector of possibleSectionSelectors) {
                    const elements = $(selector);
                    console.log(`Selector "${selector}" encontró ${elements.length} elementos`);
                    
                    // Verificar si alguno de los elementos contiene texto de sección
                    const hasSectionText = Array.from(elements).some(el => 
                        $(el).text().includes('Big Tech') || 
                        $(el).text().includes('Science') || 
                        $(el).text().includes('Programming')
                    );
                    
                    if (hasSectionText) {
                        sectionSelector = selector;
                        console.log(`Usando selector de sección: "${selector}"`);
                        break;
                    }
                }
                
                if (!sectionSelector) {
                    console.log('No se pudo determinar el selector de sección, usando h3 por defecto');
                    sectionSelector = 'h3';
                }
                
                // Seleccionar los artículos de las diferentes secciones
                const sections = [
                    '📱 Big Tech & Startups',
                    '🚀 Science & Futuristic Technology',
                    '💻 Programming, Design & Data Science',
                    '🎁 Miscellaneous',
                    '⚡ Quick Links'
                ];

                const news = [];
                
                // Buscar secciones por texto aproximado
                sections.forEach(sectionTitle => {
                    console.log(`Buscando sección: "${sectionTitle}"`);
                    
                    // Buscar elementos que contengan parte del título de la sección
                    const sectionKeyword = sectionTitle.split(' ')[1]; // "Big", "Science", etc.
                    const possibleSections = $(sectionSelector).filter(function() {
                        return $(this).text().includes(sectionKeyword);
                    });
                    
                    if (possibleSections.length) {
                        console.log(`Encontrada sección "${sectionKeyword}" con ${possibleSections.length} coincidencias`);
                        
                        possibleSections.each((i, section) => {
                            // Obtener todos los artículos hasta la siguiente sección
                            const articles = $(section).nextUntil(sectionSelector);
                            console.log(`Encontrados ${articles.length} posibles artículos en sección ${sectionKeyword}`);
                            
                            articles.each((i, el) => {
                                const article = $(el);
                                
                                // Intentar diferentes patrones para extraer artículos
                                if (article.is('p') && article.text().trim()) {
                                    // Patrón 1: Título (tiempo de lectura)
                                    let titleMatch = article.text().match(/(.*?)\((.*?)\)/);
                                    
                                    // Patrón 2: Título sin tiempo de lectura
                                    if (!titleMatch && article.find('strong').length) {
                                        const title = article.find('strong').text().trim();
                                        if (title) {
                                            titleMatch = [null, title, ''];
                                        }
                                    }
                                    
                                    // Patrón 3: Título en negrita seguido de texto
                                    if (!titleMatch && article.html() && article.html().includes('<strong>')) {
                                        const strongText = article.find('strong').text().trim();
                                        if (strongText) {
                                            titleMatch = [null, strongText, ''];
                                        }
                                    }
                                    
                                    if (titleMatch) {
                                        const title = titleMatch[1].trim();
                                        const text = article.next('p').text().trim() || 
                                                    article.text().replace(title, '').trim();
                                        
                                        if (title && text) {
                                            news.push({
                                                category: mapCategory(sectionKeyword),
                                                title,
                                                text,
                                                link: '#'
                                            });
                                            console.log('Artículo procesado:', { title });
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        console.log(`No se encontró la sección "${sectionKeyword}"`);
                    }
                });
                
                if (news.length > 0) {
                    console.log(`Encontrados ${news.length} artículos`);
                    return { news, isUpdated: true };
                }
                
                console.log('No se encontraron artículos en la página');
                
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error.message);
                if (error.response) {
                    console.log(`Status: ${error.response.status}`);
                    console.log(`Headers:`, error.response.headers);
                }
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
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeNews(dateStr) {
    try {
        console.log('Iniciando scraping de TLDR.tech...');
        
        // Si no se proporciona fecha, empezar con la fecha actual en zona horaria española
        let currentDate = dateStr 
            ? new Date(dateStr) 
            : new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
            
        let attempts = 0;
        const maxAttempts = 7; // Máximo una semana atrás
        
        while (attempts < maxAttempts) {
            // Formatear la fecha en YYYY-MM-DD usando la zona horaria española
            const formattedDate = currentDate.toLocaleDateString('en-CA', { // en-CA da formato YYYY-MM-DD
                timeZone: 'Europe/Madrid'
            });
            
            const url = `https://tldr.tech/tech/${formattedDate}`;
            console.log('Intentando con URL:', url);
            
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    }
                });
                
                const $ = cheerio.load(response.data);
                const news = [];

                if ($('h1').text().includes('Keep up with tech in 5 minutes')) {
                    throw new Error('Página principal detectada');
                }

                // Buscar las noticias
                $('a').each((i, element) => {
                    const title = $(element).text().trim();
                    const text = $(element).parent().text().trim().replace(title, '').trim();
                    const link = $(element).attr('href');

                    if (title && text && 
                        (title.includes('minute read') || title.includes('GitHub Repo')) && 
                        !title.includes('Sponsor')) {
                        
                        const cleanTitle = title.replace(/\(\d+ minute read\)/g, '').trim();
                        
                        news.push({
                            category: formattedDate,
                            title: cleanTitle,
                            text,
                            link
                        });
                    }
                });

                if (news.length > 0) {
                    // Obtener imágenes para artículos de TechCrunch
                    for (let item of news) {
                        if (item.link && item.link.includes('techcrunch.com')) {
                            try {
                                const tcResponse = await axios.get(item.link);
                                const tc$ = cheerio.load(tcResponse.data);
                                item.image = tc$('meta[property="og:image"]').attr('content');
                            } catch (error) {
                                console.error('Error obteniendo imagen de TechCrunch:', error);
                            }
                        }
                    }
                    return { news, isUpdated: true };
                }
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error.message);
            }

            currentDate.setDate(currentDate.getDate() - 1);
            attempts++;
        }

        throw new Error('No se encontró una newsletter válida en los últimos 7 días');
    } catch (error) {
        console.error('Error en scraping:', error.message);
        throw error;
    }
}

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log('API endpoint llamado');
    try {
        const data = await scrapeNews();
        console.log('Datos obtenidos:', data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error en el endpoint:', error);
        res.status(500).json({ error: error.message });
    }
}; 
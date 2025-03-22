// Módulo para scraping de noticias
const axios = require('axios');
const cheerio = require('cheerio');

// Función para obtener noticias por defecto en caso de fallo
function getDefaultNews() {
  return [
    {
      category: "TechCrunch",
      title: "Nuevas tendencias en tecnología para 2024",
      text: "Esta es una noticia por defecto generada cuando el scraping falla.",
      link: "https://techcrunch.com/"
    },
    {
      category: "TechCrunch",
      title: "Startups innovadoras que están cambiando el mundo",
      text: "Esta es otra noticia por defecto para mostrar mientras el servicio se restablece.",
      link: "https://techcrunch.com/startups/"
    },
    {
      category: "TechCrunch",
      title: "Inteligencia artificial: avances y desafíos",
      text: "Noticia de respaldo sobre avances en IA.",
      link: "https://techcrunch.com/artificial-intelligence/"
    },
    {
      category: "TechCrunch",
      title: "El impacto de la tecnología en el medio ambiente",
      text: "Noticia de respaldo sobre tecnología y sostenibilidad.",
      link: "https://techcrunch.com/greentech/"
    },
    {
      category: "TechCrunch",
      title: "Ciberseguridad: protegiendo los datos en la era digital",
      text: "Noticia de respaldo sobre ciberseguridad y protección de datos.",
      link: "https://techcrunch.com/security/"
    }
  ];
}

// Función principal para extraer noticias de TechCrunch
async function scrapeNews() {
  try {
    console.log('Iniciando scraping de TechCrunch...');
    
    // Usar un timeout para evitar bloqueos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    // Realizar la petición a TechCrunch con múltiples headers para simular navegador
    const response = await axios.get('https://techcrunch.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      signal: controller.signal
    });
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    // Cargar el HTML en cheerio
    const $ = cheerio.load(response.data);
    
    // Extraer los titulares principales
    const headlines = [];
    
    // Intentamos varios selectores para adaptarnos a cambios en la web
    const selectors = [
      '.hero-package-2__list .loop-card__title',
      'article h2.post-block__title',
      '.post-block--unread a',
      '.headline-link' // Selector genérico adicional
    ];
    
    // Probamos cada selector hasta encontrar resultados
    for (const selector of selectors) {
      $(selector).each((index, element) => {
        // Limitar a 5 titulares
        if (index >= 5) return false;
        
        const title = $(element).text().trim();
        // Intentamos obtener el enlace de diferentes maneras
        let link = '';
        if ($(element).is('a')) {
          link = $(element).attr('href') || '';
        } else {
          link = $(element).find('a').attr('href') || '';
        }
        
        if (title && !headlines.some(h => h.title === title)) {
          headlines.push({
            title: title,
            link: link,
            category: 'TechCrunch'
          });
        }
      });
      
      // Si encontramos titulares, detenemos la búsqueda
      if (headlines.length > 0) break;
    }
    
    console.log(`Scraping completado. Se encontraron ${headlines.length} titulares.`);
    
    // Si no se encontraron titulares, devolver noticias por defecto
    if (headlines.length === 0) {
      console.log('No se encontraron titulares. Devolviendo noticias por defecto.');
      return getDefaultNews();
    }
    
    return headlines;
  } catch (error) {
    console.error('Error durante el scraping:', error.message);
    // En caso de error, devolver noticias por defecto
    return getDefaultNews();
  }
}

module.exports = {
  scrapeNews,
  getDefaultNews
}; 
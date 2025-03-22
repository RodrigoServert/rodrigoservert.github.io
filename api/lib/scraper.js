// Módulo para scraping de noticias
const axios = require('axios');
const cheerio = require('cheerio');

// Función para obtener noticias por defecto en caso de fallo
function getDefaultNews() {
  return [
    {
      category: "Tecnología",
      title: "Noticia por defecto 1",
      text: "Esta es una noticia por defecto generada cuando el scraping falla.",
      link: "https://example.com/noticia-1"
    },
    {
      category: "Startups",
      title: "Noticia por defecto 2",
      text: "Esta es otra noticia por defecto para mostrar mientras el servicio se restablece.",
      link: "https://example.com/noticia-2"
    }
  ];
}

// Función principal para extraer noticias de TechCrunch
async function scrapeNews() {
  try {
    console.log('Iniciando scraping de TechCrunch...');
    
    // Realizar la petición a TechCrunch
    const response = await axios.get('https://techcrunch.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Cargar el HTML en cheerio
    const $ = cheerio.load(response.data);
    
    // Extraer los titulares principales
    const headlines = [];
    
    // Seleccionar los titulares del "Top Headlines"
    $('.hero-package-2__list .loop-card__title').each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).find('a').attr('href') || '';
      
      headlines.push({
        title: title,
        link: link,
        category: 'TechCrunch'
      });
    });
    
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
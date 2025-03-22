// Módulo para obtener noticias desde el RSS de TechCrunch
const axios = require('axios');
const { parseStringPromise } = require('xml2js');

// Función para obtener noticias por defecto en caso de fallo
function getDefaultNews() {
  return [
    {
      category: "TechCrunch",
      title: "Data breach at stalkerware SpyX affects close to 2 million, including thousands of Apple users",
      link: "https://techcrunch.com/2025/03/19/data-breach-at-stalkerware-spyx-affects-close-to-2-million-including-thousands-of-apple-users/",
    },
    {
      category: "TechCrunch",
      title: "X users treating Grok like a fact-checker spark concerns over misinformation",
      link: "https://techcrunch.com/2025/03/19/x-users-treating-grok-like-a-fact-checker-spark-concerns-over-misinformation/",
    },
    {
      category: "TechCrunch",
      title: "Sequoia shutters Washington, D.C., office, lets go of policy team",
      link: "https://techcrunch.com/2025/03/19/sequoia-shutters-washington-d-c-office-lets-go-of-policy-team/",
    },
    {
      category: "TechCrunch",
      title: "OpenAI research lead Noam Brown thinks certain AI 'reasoning' models could've arrived decades ago",
      link: "https://techcrunch.com/2025/03/19/openai-research-lead-noam-brown-thinks-ai-reasoning-models-couldve-arrived-decades-ago/",
    },
    {
      category: "TechCrunch",
      title: "Nvidia reportedly acquires synthetic data startup Gretel",
      link: "https://techcrunch.com/2025/03/19/nvidia-reportedly-acquires-synthetic-data-startup-gretel/",
    }
  ];
}

// Función principal para extraer noticias del RSS de TechCrunch
async function scrapeNews() {
  try {
    console.log('Iniciando obtención de feeds RSS de TechCrunch...');
    
    // Usar un timeout para evitar bloqueos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    // Realizar la petición al feed RSS de TechCrunch
    const response = await axios.get('https://techcrunch.com/feed/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal
    });
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    // Procesar el XML del feed RSS
    const result = await parseStringPromise(response.data);
    
    // Verificar que tenemos la estructura esperada
    if (!result || !result.rss || !result.rss.channel || !result.rss.channel[0].item) {
      console.error('Estructura RSS inesperada');
      return getDefaultNews();
    }
    
    // Obtener los artículos del feed
    const items = result.rss.channel[0].item;
    
    // Limitar a 5 titulares
    const headlines = items.slice(0, 5).map(item => ({
      title: item.title[0],
      link: item.link[0],
      category: 'TechCrunch'
    }));
    
    console.log(`Obtención de RSS completada. Se encontraron ${headlines.length} titulares.`);
    
    // Si no se encontraron titulares, devolver noticias por defecto
    if (headlines.length === 0) {
      console.log('No se encontraron titulares en el RSS. Devolviendo noticias por defecto.');
      return getDefaultNews();
    }
    
    return headlines;
  } catch (error) {
    console.error('Error durante la obtención del RSS:', error.message);
    // En caso de error, devolver noticias por defecto
    return getDefaultNews();
  }
}

module.exports = {
  scrapeNews,
  getDefaultNews
}; 
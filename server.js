const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeNews, getDefaultNews } = require('./api/lib/scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos
app.use(express.static('.'));

// Endpoint para scraping
app.get('/api/scrape-news', async (req, res) => {
    try {
        const result = await scrapeNews();
        res.json(result);
    } catch (error) {
        console.error('Error en el endpoint:', error);
        // En caso de error, devolver noticias por defecto
        res.status(200).json(getDefaultNews());
    }
});

// Endpoint para noticias estáticas (como respaldo)
app.get('/api/static-news', (req, res) => {
    const staticNews = [
        {
            title: "Apple lanza su nueva línea de productos para 2024",
            link: "https://techcrunch.com/category/apple/",
            category: "TechCrunch"
        },
        {
            title: "Las startups de IA que están revolucionando el mercado",
            link: "https://techcrunch.com/category/artificial-intelligence/",
            category: "TechCrunch"
        },
        {
            title: "Amazon Web Services presenta nuevas soluciones para empresas",
            link: "https://techcrunch.com/category/enterprise/",
            category: "TechCrunch"
        },
        {
            title: "El metaverso: próxima revolución tecnológica o solo una moda pasajera",
            link: "https://techcrunch.com/category/meta/",
            category: "TechCrunch"
        },
        {
            title: "Las 10 startups más prometedoras según inversores de Silicon Valley",
            link: "https://techcrunch.com/category/venture/",
            category: "TechCrunch"
        }
    ];
    
    res.status(200).json(staticNews);
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para The Kiosk
app.get('/the-kiosk', (req, res) => {
    res.sendFile(path.join(__dirname, 'the-kiosk.html'));
});

// Para compatibilidad con Vercel, exportamos la app
module.exports = app;

// Solo iniciamos el servidor si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
} 
const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeNews } = require('./api/lib/scraper');

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
        res.status(500).json({ 
            error: 'Error obteniendo noticias',
            message: error.message 
        });
    }
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
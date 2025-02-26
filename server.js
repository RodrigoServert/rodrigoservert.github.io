const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeNews } = require('./api/lib/scraper');

const app = express();
const PORT = 3000;

// Configurar CORS
app.use(cors());

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

// Ruta para The Comma
app.get('/the-comma', (req, res) => {
    res.sendFile(path.join(__dirname, 'the-comma.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
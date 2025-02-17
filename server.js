const express = require('express');
const path = require('path');
const { generateDailyNews } = require('./services/newsService');
const fs = require('fs').promises;
const { scrapeNews } = require('./scripts/scrapeNews');

const app = express();

// Configurar middleware para parsear JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/the-comma.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'the-comma.html'));
});

app.post('/update-news', async (req, res) => {
    try {
        console.log('Iniciando generación de noticias...');
        
        // Asegurarse de que el directorio data existe
        await fs.mkdir('data', { recursive: true }).catch(() => {});

        // Generar noticias
        const newsData = await generateDailyNews();
        
        if (newsData && newsData.news && Array.isArray(newsData.news)) {
            await fs.writeFile(
                path.join(__dirname, 'data/dailyNews.json'),
                JSON.stringify(newsData, null, 2)
            );
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Invalid news format' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/scrape-news', async (req, res) => {
    try {
        console.log('Recibida petición de scraping');
        const date = req.query.date; // Obtener la fecha de la query
        const news = await scrapeNews(date);
        console.log('Scraping completado:', news ? 'OK' : 'Error');
        res.json(news);
    } catch (error) {
        console.error('Error en endpoint scrape-news:', error);
        res.status(500).json({ error: 'Error scraping news' });
    }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
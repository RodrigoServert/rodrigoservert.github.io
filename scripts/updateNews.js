const cron = require('node-cron');
const fs = require('fs/promises');
const path = require('path');
const { generateDailyNews } = require('../services/newsService');

// Función principal para actualizar noticias
async function updateNews() {
    try {
        console.log('Iniciando generación de noticias...');
        const newsData = await generateDailyNews();
        
        if (newsData) {
            const filePath = path.join(__dirname, '../data/dailyNews.json');
            await fs.writeFile(filePath, JSON.stringify(newsData, null, 2));
            console.log('Noticias actualizadas correctamente en:', filePath);
            console.log('Nuevas noticias:', JSON.stringify(newsData, null, 2));
        } else {
            console.error('No se pudieron generar noticias');
        }
    } catch (error) {
        console.error('Error actualizando noticias:', error);
    }
}

// Ejecutar inmediatamente al iniciar
updateNews();

// Programar para las 6am
cron.schedule('0 6 * * *', updateNews); 
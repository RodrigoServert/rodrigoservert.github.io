module.exports = async (req, res) => {
    console.log('API: Endpoint llamado');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Si es una solicitud OPTIONS, responder inmediatamente
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Respuesta de prueba
    res.json({
        test: true,
        timestamp: new Date().toISOString(),
        news: getDefaultNews().news
    });
};

// Función temporal para noticias por defecto
function getDefaultNews() {
    return {
        news: [
            {
                category: "Test",
                title: "Test News",
                text: "This is a test news item"
            }
        ]
    };
} 
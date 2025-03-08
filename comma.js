document.addEventListener('DOMContentLoaded', async function() {
    const dateElement = document.querySelector('.newspaper-date');
    
    function updateDateTime() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        
        // Formatear la hora en formato 24h
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        
        // Formatear la fecha y hora en inglés
        const dateStr = now.toLocaleDateString('en-US', dateOptions);
        
        dateElement.textContent = `${dateStr} — ${timeStr}`;
    }
    
    // Actualizar inmediatamente y luego cada minuto
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // Grupos de noticias predefinidos
    const newsGroups = [
        // Grupo 1
        {
            "news": [
                {
                    "category": "Technology",
                    "title": "Apple Reveals New iPhone 16 📱",
                    "text": "Apple unveiled its latest smartphone, the iPhone 16, at its annual fall event. The new phone features a larger display, improved camera system, and faster processor."
                },
                {
                    "category": "Science",
                    "title": "Hubble Telescope Captures Stunning Image 🌌",
                    "text": "The Hubble Space Telescope has captured a stunning image of galaxy NGC 5728, located about 60 million light-years away. The image reveals the galaxy's intricate spiral structure."
                },
                {
                    "category": "Arts",
                    "title": "Mona Lisa Gets New Protection 🖼️",
                    "text": "The world-famous Mona Lisa painting has been placed in a new bulletproof glass case at the Louvre Museum in Paris, enhancing security for this priceless masterpiece."
                },
                {
                    "category": "Culture",
                    "title": "Ancient Maya City Discovered 🏛️",
                    "text": "Archaeologists uncover a previously unknown Maya city in Guatemala, dating back to the 8th century AD. The site reveals new insights into ancient urban planning."
                },
                {
                    "category": "Innovation",
                    "title": "Delivery Robots Take the Streets 🤖",
                    "text": "Autonomous delivery robots are being deployed in major cities worldwide, revolutionizing last-mile delivery with AI-powered navigation systems."
                },
                {
                    "category": "Environment",
                    "title": "Record Heat Wave Hits Europe 🌡️",
                    "text": "Europe faces unprecedented temperatures, with multiple countries recording their highest-ever readings. Scientists link the event to ongoing climate change."
                },
                {
                    "category": "Sports",
                    "title": "Historic Soccer Transfer Deal ⚽",
                    "text": "A record-breaking transfer deal shakes up the soccer world as a leading player makes an unexpected move between rival clubs."
                },
                {
                    "category": "Politics",
                    "title": "Global Climate Summit Success 🌍",
                    "text": "World leaders reach groundbreaking agreement at climate summit, pledging significant emissions reductions and increased funding for green initiatives."
                }
            ]
        },
        // Grupo 2
        {
            "news": [
                {
                    "category": "Technology",
                    "title": "Quantum Computing Milestone 💻",
                    "text": "Scientists achieve quantum supremacy with a new processor that performs calculations in seconds that would take traditional supercomputers thousands of years."
                },
                {
                    "category": "Science",
                    "title": "Mars Water Discovery 🚀",
                    "text": "NASA's Perseverance rover finds evidence of ancient water flows on Mars, strengthening the case for past microbial life on the red planet."
                },
                {
                    "category": "Arts",
                    "title": "AI Creates Symphony 🎵",
                    "text": "An AI-composed symphony debuts at Carnegie Hall, marking a milestone in the intersection of artificial intelligence and classical music."
                },
                {
                    "category": "Culture",
                    "title": "Lost Library Found 📚",
                    "text": "Archaeologists discover an ancient library containing thousands of well-preserved scrolls, offering new insights into classical literature."
                },
                {
                    "category": "Innovation",
                    "title": "Flying Car Gets Approval ✈️",
                    "text": "The first commercial flying car receives regulatory approval, promising to revolutionize urban transportation within the next decade."
                },
                {
                    "category": "Environment",
                    "title": "Coral Reef Recovery 🐠",
                    "text": "A major coral reef shows signs of recovery thanks to innovative restoration techniques, offering hope for marine ecosystem conservation."
                },
                {
                    "category": "Sports",
                    "title": "Olympic Record Shattered 🏃",
                    "text": "A young athlete breaks a 20-year-old Olympic record, setting new standards in athletic achievement and inspiring the next generation."
                },
                {
                    "category": "Politics",
                    "title": "Historic Peace Agreement 🕊️",
                    "text": "Long-standing regional conflicts end with the signing of a comprehensive peace agreement, bringing hope for lasting stability."
                }
            ]
        }
    ];

    const loadNewsItem = (item) => {
        const wrapper = item.querySelector('.news-content-wrapper');
        wrapper.style.opacity = 1;
    };

    async function fetchScrapedNews() {
        try {
            console.log('Frontend: Iniciando fetch de noticias');
            
            // Determinar la URL base según el entorno
            let baseUrl;
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                baseUrl = 'http://localhost:3000';
            } else {
                // URL para producción (Vercel)
                baseUrl = 'https://rodrigoservert-github-io.vercel.app';
            }
            
            const apiUrl = `${baseUrl}/api/scrape-news`;
            console.log('Usando URL de API:', apiUrl);
            
            const response = await fetch(apiUrl, {
                mode: 'cors',
                credentials: 'omit',
                cache: 'no-store', // Forzar petición fresca
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
                const errorText = await response.text();
                console.error('Respuesta de error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Datos recibidos de la API:', data);
            return data;
        } catch (error) {
            console.error('Error detallado al obtener noticias:', error);
            // Mostrar un mensaje más descriptivo en la consola
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                console.error('Error de red: No se pudo conectar con el servidor. Verifica la URL y que el servidor esté en funcionamiento.');
            }
            throw error; // Re-lanzar el error para manejarlo arriba
        }
    }

    function createSkeletonTemplate() {
        // Crear esqueletos en todas las columnas
        const newsColumns = document.querySelectorAll('.news-column');
        
        // Limpiar columnas primero
        newsColumns.forEach(column => {
            column.innerHTML = '';
        });
        
        // Añadir 2-3 esqueletos por columna
        newsColumns.forEach(column => {
            const skeletonsCount = Math.floor(Math.random() * 2) + 2; // 2-3 esqueletos
            
            for (let i = 0; i < skeletonsCount; i++) {
                const skeletonItem = document.createElement('div');
                skeletonItem.className = 'news-item';
                
                skeletonItem.innerHTML = `
                    <div class="news-skeleton">
                        <div class="skeleton-item skeleton-image"></div>
                        <div class="skeleton-item skeleton-category"></div>
                        <div class="skeleton-item skeleton-title"></div>
                        <div class="skeleton-item skeleton-text"></div>
                    </div>
                `;
                
                column.appendChild(skeletonItem);
            }
        });
        
        console.log('Esqueletos de carga creados');
    }

    async function loadNews() {
        try {
            console.log('Iniciando carga de noticias...');
            
            // Mostrar esqueletos mientras cargamos
            createSkeletonTemplate();
            
            // Intentar obtener noticias scrapeadas
            console.log('Intentando obtener noticias scrapeadas...');
            let newsData;
            
            try {
                newsData = await fetchScrapedNews();
                console.log('Noticias obtenidas correctamente:', newsData);
                
                if (!newsData || !newsData.news || newsData.news.length === 0) {
                    console.log('No se obtuvieron noticias del scraper, cargando noticias por defecto');
                    newsData = loadDefaultNews();
                }
            } catch (error) {
                console.error('Error al obtener noticias scrapeadas:', error);
                console.log('Cargando noticias por defecto debido al error');
                newsData = loadDefaultNews();
            }
            
            // Verificar que tenemos noticias para mostrar
            if (!newsData || !newsData.news || newsData.news.length === 0) {
                console.error('No hay noticias disponibles para mostrar');
                return;
            }
            
            console.log(`Mostrando ${newsData.news.length} noticias`);
            
            // Limpiar columnas
            const columns = document.querySelectorAll('.news-column');
            columns.forEach(column => column.innerHTML = '');
            
            // Distribuir noticias en columnas
            const news = newsData.news;
            for (let i = 0; i < news.length; i++) {
                const columnIndex = i % columns.length;
                const column = columns[columnIndex];
                
                // Crear elemento de noticia
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                
                // Contenido de la noticia
                const newsContent = `
                    <div class="news-skeleton">
                        <div class="skeleton-item skeleton-image"></div>
                        <div class="skeleton-item skeleton-category"></div>
                        <div class="skeleton-item skeleton-title"></div>
                        <div class="skeleton-item skeleton-text"></div>
                    </div>
                    <div class="news-content-wrapper" style="opacity: 0;">
                        <div class="news-category-overlay">${news[i].category}</div>
                        <div class="news-content">
                            <div class="news-category">${news[i].category}</div>
                            <h3 class="news-title">${news[i].title}</h3>
                            <p class="news-text">${news[i].text}</p>
                        </div>
                    </div>
                `;
                
                newsItem.innerHTML = newsContent;
                column.appendChild(newsItem);
                
                // Simular carga con retraso
                setTimeout(() => {
                    newsItem.classList.add('loaded');
                    loadNewsItem(newsItem);
                }, 500 + i * 100);
            }
            
            // Actualizar fecha
            updateDateTime();
            
            console.log('Noticias cargadas correctamente');
        } catch (error) {
            console.error('Error general al cargar noticias:', error);
        }
    }

    // Función para cargar noticias por defecto
    function loadDefaultNews() {
        console.log('Cargando noticias por defecto');
        
        // Noticias por defecto
        return {
            news: [
                {
                    category: "Technology",
                    title: "Apple's Vision Pro Launches Globally 🥽",
                    text: "Apple's mixed reality headset is now available worldwide, marking a significant milestone in consumer AR/VR technology.",
                    link: "https://www.apple.com/vision-pro"
                },
                {
                    category: "AI",
                    title: "Claude 3 Sets New AI Benchmark 🤖",
                    text: "Anthropic's latest AI model demonstrates unprecedented capabilities in reasoning and safety features.",
                    link: "https://www.anthropic.com"
                },
                {
                    category: "Innovation",
                    title: "SpaceX's Starship Completes Full Flight 🚀",
                    text: "The latest test of SpaceX's Starship successfully demonstrated all flight phases, including reentry.",
                    link: "https://www.spacex.com"
                },
                {
                    category: "Tech",
                    title: "EU Passes Landmark AI Regulation 🇪🇺",
                    text: "The European Union has approved comprehensive AI regulations, setting global standards for AI development.",
                    link: "https://ec.europa.eu"
                },
                {
                    category: "Science",
                    title: "NASA's Artemis Program Advances 🌙",
                    text: "NASA's Artemis program has reached new milestones in its mission to return humans to the Moon by 2025.",
                    link: "https://www.nasa.gov/artemis"
                },
                {
                    category: "Programming",
                    title: "TypeScript 5.0 Released with Major Improvements ⌨️",
                    text: "Microsoft has released TypeScript 5.0 with significant performance improvements and new language features.",
                    link: "https://www.typescriptlang.org"
                }
            ],
            isUpdated: false
        };
    }

    async function findLatestNewsletter() {
        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        }

        // Empezar con la fecha actual
        let currentDate = new Date();
        let attempts = 0;
        const maxAttempts = 7;

        while (attempts < maxAttempts) {
            const formattedDate = formatDate(currentDate);
            const url = `https://tldr.tech/tech/${formattedDate}`;
            
            console.log(`Intentando con fecha: ${formattedDate}`);
            
            try {
                const response = await fetch('https://rodrigoservert-github-io.vercel.app/api/scrape-news', {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'omit',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ date: formattedDate })
                });
                
                const data = await response.json();
                if (data && data.news && data.news.length > 0) {
                    return formattedDate;
                }
            } catch (error) {
                console.log(`Error con fecha ${formattedDate}:`, error);
            }

            currentDate.setDate(currentDate.getDate() - 1);
            attempts++;
        }

        throw new Error('No se encontró una newsletter válida en los últimos 7 días');
    }

    // Modificar el event listener del botón
    document.querySelector('.reload-news').addEventListener('click', async function() {
        const button = this;
        const originalText = button.textContent;
        
        try {
            button.innerHTML = 'Loading <span class="loader"></span>';
            button.disabled = true;
            
            const newsGrid = document.querySelector('.news-grid');
            // Mostrar skeletons mientras se cargan las nuevas noticias
            const newsColumns = document.querySelectorAll('.news-column');
            newsColumns.forEach(column => {
                column.innerHTML = Array(3).fill(createSkeletonTemplate()).join('');
            });
            
            // Simplemente volver a cargar las noticias como al inicio
            await loadNews();
            
            button.innerHTML = originalText;
        } catch (error) {
            console.error('Error actualizando noticias:', error);
            button.innerHTML = 'Error loading news';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        } finally {
            button.disabled = false;
        }
    });

    // Cargar noticias al iniciar
    await loadNews();
});
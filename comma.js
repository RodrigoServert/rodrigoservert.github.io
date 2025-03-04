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
        return `
            <article class="news-item skeleton-item">
                <div class="news-content-wrapper">
                    <div class="skeleton-image"></div>
                    <div class="news-content">
                        <div class="skeleton-category"></div>
                        <div class="skeleton-title"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </div>
                </div>
            </article>
        `;
    }

    async function loadNews() {
        try {
            // Primero mostrar los skeletons
            const newsColumns = document.querySelectorAll('.news-column');
            newsColumns.forEach(column => {
                column.innerHTML = Array(3).fill(createSkeletonTemplate()).join('');
            });

            const newsData = await fetchScrapedNews();
            
            // Limpiar los skeletons
            newsColumns.forEach(column => column.innerHTML = '');
            
            console.log('Datos recibidos:', newsData);
            
            if (!newsData || !newsData.news || newsData.news.length === 0) {
                console.log('No hay noticias, cargando noticias por defecto');
                loadDefaultNews();
                return;
            }

            // Distribuir las noticias equitativamente
            const newsPerColumn = Math.ceil(newsData.news.length / newsColumns.length);
            newsData.news.forEach((newsItem, index) => {
                const columnIndex = Math.floor(index / newsPerColumn);
                const column = newsColumns[columnIndex];
                
                if (column) {
                    const articleTemplate = `
                        <article class="news-item">
                            <a href="${newsItem.link || '#'}" class="article-link" target="_blank" rel="noopener noreferrer">
                                <div class="news-content-wrapper">
                                    ${newsItem.image ? `
                                        <div class="news-image">
                                            <span class="news-category news-category-overlay">${newsItem.category}</span>
                                            <img src="${newsItem.image}" alt="${newsItem.title}" loading="lazy" />
                                        </div>
                                    ` : ''}
                                    <div class="news-content">
                                        <div class="news-header">
                                            <span class="news-category">${newsItem.category}</span>
                                        </div>
                                        <h2 class="news-title">${newsItem.title}</h2>
                                        <p class="news-text">${newsItem.text}</p>
                                    </div>
                                </div>
                            </a>
                        </article>
                    `;
                    column.innerHTML += articleTemplate;
                }
            });

        } catch (error) {
            console.error('Error loading news:', error);
            loadDefaultNews();
        }
    }

    // Función para cargar noticias por defecto
    function loadDefaultNews() {
        try {
            const newsColumns = document.querySelectorAll('.news-column');
            const defaultNews = getDefaultNews().news;
            
            newsColumns.forEach(column => column.innerHTML = '');
            
            defaultNews.forEach((newsItem, index) => {
                const columnIndex = index % newsColumns.length;
                const column = newsColumns[columnIndex];
                if (column) {
                    // Usar el mismo template que arriba
                    const articleTemplate = `
                        <article class="news-item">
                            <a href="${newsItem.link || '#'}" class="article-link" target="_blank" rel="noopener noreferrer">
                                <div class="news-content-wrapper" style="opacity: 1;">
                                    <div class="news-content">
                                        <div class="news-header">
                                            <span class="news-category">${newsItem.category}</span>
                                        </div>
                                        <h2 class="news-title">${newsItem.title}</h2>
                                        <p class="news-text">${newsItem.text}</p>
                                    </div>
                                </div>
                            </a>
                        </article>
                    `;
                    column.innerHTML += articleTemplate;
                }
            });
        } catch (error) {
            console.error('Error loading default news:', error);
        }
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
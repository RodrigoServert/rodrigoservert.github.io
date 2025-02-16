function mostrarMensaje() {
    document.getElementById("mensaje").innerText = "¡Hola! Gracias por visitar mi web.";
}

// Necesitarás registrar tu aplicación en Spotify Developer Dashboard
// para obtener un CLIENT_ID y configurar la autenticación

class MusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.playlist = [
            {
                title: "Moby - Memory Gospel",
                artist: "Moby",
                file: "audio/Moby - Memory Gospel.mp3"
            },
            {
                title: "Kanye West - Through The Wire",
                artist: "Kanye West",
                file: "audio/Kanye West - Through The Wire.mp3"
            },
            {
                title: "Central Cee - St. Patrick's",
                artist: "Central Cee",
                file: "audio/Central Cee - St. Patrick's.mp3"
            },
            {
                title: "Rojuu - El Lago Del Alma",
                artist: "Rojuu",
                file: "audio/Rojuu - El Lago Del Alma.mp3"
            },
            {
                title: "Daniel Herskedal - The Mistral Noir",
                artist: "Daniel Herskedal",
                file: "audio/The Mistral Noir - Daniel Herskedal.mp3"
            },
            {
                title: "The Notorious B.I.G. - Hypnotize",
                artist: "The Notorious B.I.G.",
                file: "audio/The Notorious B.I.G. - Hypnotize.mp3"
            },
            {
                title: "Trio Ternuna - A Gira",
                artist: "Trio Ternuna",
                file: "audio/Trio Ternuna - A Gira.mp3"
            }
            // Añade aquí más canciones siguiendo el mismo formato
        ];
        
        this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length); // Canción aleatoria inicial
        this.isPlaying = false;
        
        this.initializePlayer();
    }

    initializePlayer() {
        this.loadTrack(this.currentTrackIndex);
        
        // Añadir evento para cuando termine una canción
        this.audioPlayer.addEventListener('ended', () => {
            this.playNextTrack();
        });
    }

    playNextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        this.audioPlayer.play();
        this.updateTitleDisplay();
    }

    loadTrack(index) {
        const track = this.playlist[index];
        this.audioPlayer.src = track.file;
    }

    updateTitleDisplay() {
        const track = this.playlist[this.currentTrackIndex];
        const titleContainer = document.querySelector('.song-title-container');
        if (titleContainer) {
            const titleElement = titleContainer.querySelector('.song-title');
            if (titleElement) {
                titleElement.textContent = `${track.title}`;
            }
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
        } else {
            this.audioPlayer.play();
            this.updateTitleDisplay();
        }
        this.isPlaying = !this.isPlaying;
        const button = document.getElementById('play-pause');
        button.textContent = this.isPlaying ? '❚❚' : '▶';
    }
}

const player = new MusicPlayer();

// Añadir los cuadrados al fondo
function createSquares() {
    // Implementar lazy loading de imágenes
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        console.log('Lazy loading nativo disponible');
    } else {
        // Cargar un polyfill para navegadores que no soporten lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    const container = document.createElement('div');
    container.className = 'background-squares';
    
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'columns-container';
    
    // Array de URLs de imágenes
    const images = [
        'images/1.jpg',
        'images/2.jpg',
        'images/3.jpg',
        'images/4.jpg',
        'images/5.jpg',
        'images/6.jpg',
        'images/7.jpg',
        'images/8.jpg',
        'images/9.jpg',
        'images/10.jpg',
        'images/11.jpg',
        'images/12.jpg',
        'images/13.jpg',
        'images/14.jpg',
        'images/15.jpg',
        'images/16.jpg',
        'images/17.jpg',
        'images/18.jpg',
        'images/19.jpg',
        'images/20.jpg',
        'images/21.jpg',
        'images/22.jpg',
        'images/23.jpg',
        'images/24.jpg',
        'images/25.jpg',
        'images/26.jpg',
        'images/27.jpg',
        'images/28.jpg',
        'images/29.jpg',
        'images/30.jpg',
    ];
    
    // Verificamos que tenemos imágenes
    console.log('Imágenes disponibles:', images);
    console.log('Número total de imágenes:', images.length);
    
    // Cambiamos el número de cuadrados por columna
    const squaresPerColumn = 5;
    const totalSquares = 6 * squaresPerColumn;
    const positions = Array.from({ length: totalSquares }, (_, i) => i);
    
    // Mezclamos las posiciones
    positions.sort(() => Math.random() - 0.5);
    
    // Calculamos la posición central basada en el viewport
    function calculateCentralPosition() {
        // Siempre queremos que esté en una de las columnas centrales
        const centralColumn = Math.min(2, Math.floor(6/2)); // Se adapta si hay menos columnas
        
        // Calculamos la fila basándonos en el viewport
        const viewportHeight = window.innerHeight;
        const squareSize = document.querySelector('.square')?.offsetHeight || viewportHeight / 5;
        
        // Queremos que esté visible en la primera "pantalla"
        const squaresInViewport = Math.floor(viewportHeight / squareSize);
        
        // Elegimos una posición que esté siempre visible
        const centralRow = Math.min(1, Math.floor(squaresInViewport / 2));
        
        return (centralColumn * squaresPerColumn) + centralRow;
    }

    // Usar la función para obtener la posición central
    const centralPosition = calculateCentralPosition();

    // Asegurarnos de que el cuadrado de texto sea visible
    const textSquare = document.querySelector('.square-text');
    if (textSquare) {
        textSquare.style.opacity = '1';
    }
    
    // Actualizar la posición cuando cambie el tamaño de la ventana
    window.addEventListener('resize', function() {
        const newCentralPosition = calculateCentralPosition();
        const textSquare = document.querySelector('.square-text');
        if (textSquare) {
            const square = textSquare.parentElement;
            const column = square.parentElement;
            const currentPosition = Array.from(column.children).indexOf(square);
            
            if (currentPosition !== newCentralPosition) {
                // Reposicionar el cuadro de texto si es necesario
                const targetSquare = document.querySelectorAll('.square')[newCentralPosition];
                if (targetSquare) {
                    targetSquare.innerHTML = square.innerHTML;
                    square.innerHTML = '';
                }
            }
        }
    });
    
    // Asignar las imágenes a todas las posiciones disponibles, excepto la central
    const imagePositions = positions
        .filter(pos => pos !== centralPosition)
        .slice(0, images.length);

    // Debug
    console.log('Posición central (texto):', centralPosition);
    console.log('Posiciones de imágenes:', imagePositions);
    
    for (let i = 0; i < 6; i++) {
        const column = document.createElement('div');
        column.className = 'column';
        
        const originalSquares = [];
        
        for (let j = 0; j < squaresPerColumn; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            
            const currentPosition = i * squaresPerColumn + j;
            
            if (currentPosition === centralPosition) {
                const textDiv = document.createElement('div');
                textDiv.className = 'square-text fade-in-text';
                
                // Función para obtener el mes abreviado
                function getMonthAbbr(month) {
                    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                    return months[month];
                }
                
                // Modificar la función updateTime dentro de createSquares
                function updateTime() {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const day = now.getDate();
                    const month = getMonthAbbr(now.getMonth());
                    return `${day} ${month} ${hours}:${minutes}`;
                }
                
                // Actualizar el estilo para que quepa bien el nuevo formato
                const timeContainer = document.createElement('div');
                timeContainer.style.fontFamily = 'JetBrains Mono, monospace';
                timeContainer.style.fontSize = '1.2rem';
                timeContainer.style.fontWeight = '700';
                timeContainer.style.alignSelf = 'flex-start';
                timeContainer.style.marginLeft = '15px';
                timeContainer.style.marginTop = '15px';
                
                textDiv.innerHTML = `
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 700; align-self: flex-start; margin-left: 15px; margin-top: 15px;">
                        <div id="time-display">${updateTime()}</div>
                        <div id="motto" style="margin-top: 10px;">MAKE BEAUTIFUL THINGS EVEN IF NOBODY CARES</div>
                    </div>
                `;
                
                // Actualizar la hora cada segundo
                setInterval(() => {
                    const timeDisplay = textDiv.querySelector('#time-display');
                    if (timeDisplay) {
                        timeDisplay.textContent = updateTime();
                    }
                }, 1000);
                
                // Añadir el botón de play
                const playButton = document.createElement('button');
                playButton.id = 'play-pause';
                playButton.textContent = '▶';
                playButton.style.fontFamily = "'Averia Serif Libre', serif";
                textDiv.appendChild(playButton);
                
                // Añadir el event listener para el botón de play
                playButton.addEventListener('click', function() {
                    const audioPlayer = document.getElementById('audio-player');
                    const titleContainer = textDiv.querySelector('.song-title-container');
                    
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        this.textContent = '❚❚';
                        
                        // Crear y mostrar el título si no existe
                        if (!titleContainer) {
                            const container = document.createElement('div');
                            container.className = 'song-title-container';
                            const titleElement = document.createElement('div');
                            titleElement.className = 'song-title';
                            const currentTrack = player.playlist[player.currentTrackIndex];
                            titleElement.textContent = currentTrack.title;
                            container.appendChild(titleElement);
                            textDiv.appendChild(container);
                        }
                    } else {
                        audioPlayer.pause();
                        this.textContent = '▶';
                        // Eliminar el título cuando se pausa
                        if (titleContainer) {
                            titleContainer.remove();
                        }
                    }
                });
                
                // Establecer el estilo del botón
                playButton.style.position = 'absolute';
                playButton.style.bottom = '10px';
                playButton.style.left = '10px';
                
                square.appendChild(textDiv);
                originalSquares.push(square.cloneNode(true));
            } else if (imagePositions.includes(currentPosition)) {
                // Crear cuadro de imagen
                const img = document.createElement('img');
                const imageIndex = imagePositions.indexOf(currentPosition);
                const imageSrc = images[imageIndex];
                
                // Añadir el skeleton loader
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton';
                square.appendChild(skeleton);
                
                // Configurar la imagen
                img.style.opacity = '0';
                img.onload = function() {
                    // Cuando la imagen cargue, ocultamos el skeleton y mostramos la imagen
                    setTimeout(() => {
                        skeleton.style.display = 'none';
                        img.style.opacity = '1';
                        img.classList.add('fade-in');
                    }, Math.random() * 500); // Retraso aleatorio entre 0 y 500ms
                };
                
                img.onerror = function() {
                    // Si hay error al cargar la imagen, mostramos un placeholder
                    skeleton.style.backgroundColor = '#2a2a2a';
                    skeleton.style.animation = 'none';
                };
                
                img.src = imageSrc;
                img.alt = 'Square image';
                img.loading = 'lazy';
                img.decoding = 'async';
                img.setAttribute('importance', 'low');
                square.appendChild(img);
                originalSquares.push(square.cloneNode(true));
            } else {
                // Crear cuadro vacío
                const emptySquare = document.createElement('div');
                emptySquare.style.backgroundColor = '#F5F5F5';
                emptySquare.style.width = '100%';
                emptySquare.style.height = '100%';
                square.appendChild(emptySquare);
                originalSquares.push(square.cloneNode(true));
            }
            
            column.appendChild(square);
        }
        
        // Añadir cuadrados adicionales repitiendo el patrón
        const screenHeight = window.innerHeight;
        const squareHeight = screenHeight / 4; // Aproximadamente
        const extraSquaresNeeded = Math.ceil(screenHeight / squareHeight);
        
        for (let k = 0; k < extraSquaresNeeded; k++) {
            originalSquares.forEach((originalSquare, index) => {
                const clonedSquare = originalSquare.cloneNode(true);
                
                if (clonedSquare.querySelector('.square-text') && 
                    (k === 0 || k === extraSquaresNeeded - 1)) {
                    
                    // Crear un cuadro de imagen en su lugar
                    const replacementSquare = document.createElement('div');
                    replacementSquare.className = 'square';
                    
                    // Añadir el skeleton loader
                    const skeleton = document.createElement('div');
                    skeleton.className = 'skeleton';
                    replacementSquare.appendChild(skeleton);
                    
                    const img = document.createElement('img');
                    const randomImageIndex = Math.floor(Math.random() * images.length);
                    
                    img.style.opacity = '0';
                    img.onload = function() {
                        setTimeout(() => {
                            skeleton.style.display = 'none';
                            img.style.opacity = '1';
                            img.classList.add('fade-in');
                        }, Math.random() * 500);
                    };
                    
                    img.onerror = function() {
                        skeleton.style.backgroundColor = '#2a2a2a';
                        skeleton.style.animation = 'none';
                    };
                    
                    img.src = images[randomImageIndex];
                    img.alt = 'Square image';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.setAttribute('importance', 'low');
                    
                    replacementSquare.appendChild(img);
                    column.appendChild(replacementSquare);
                } else {
                    column.appendChild(clonedSquare);
                }
            });
        }
        
        columnsContainer.appendChild(column);
    }
    
    container.appendChild(columnsContainer);
    document.body.appendChild(container);
}

createSquares();

// Event listener para el botón de play centrado
document.getElementById('play-pause').addEventListener('click', function() {
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer.paused) {
        audioPlayer.play();
        this.textContent = '❚❚'; // Cambiar a pausa
    } else {
        audioPlayer.pause();
        this.textContent = '▶'; // Cambiar a play
    }
});

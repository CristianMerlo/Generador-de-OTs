// Manuales y Procedimientos - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Configuración de los manuales con enlaces de Google Drive
    const manualesConfig = {
        'broiler': {
            nombre: 'Manual de Broiler',
            // Reemplazar con el enlace real de Google Drive cuando esté disponible
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_BROILER/view?usp=sharing',
            fallbackMsg: 'El manual del Broiler aún no está disponible. Se agregará próximamente.'
        },
        'freidora': {
            nombre: 'Manual de Freidora',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_FREIDORA/view?usp=sharing',
            fallbackMsg: 'El manual de la Freidora aún no está disponible. Se agregará próximamente.'
        },
        'cafetera': {
            nombre: 'Manual de Cafetera',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_CAFETERA/view?usp=sharing',
            fallbackMsg: 'El manual de la Cafetera aún no está disponible. Se agregará próximamente.'
        },
        'phu': {
            nombre: 'Manual de PHU',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_PHU/view?usp=sharing',
            fallbackMsg: 'El manual del PHU aún no está disponible. Se agregará próximamente.'
        },
        'maquina-hielo': {
            nombre: 'Manual de Máquina de Hielo',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_HIELO/view?usp=sharing',
            fallbackMsg: 'El manual de la Máquina de Hielo aún no está disponible. Se agregará próximamente.'
        },
        'heladera': {
            nombre: 'Manual de Heladeras',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_HELADERA/view?usp=sharing',
            fallbackMsg: 'El manual de Heladeras aún no está disponible. Se agregará próximamente.'
        },
        'freezer': {
            nombre: 'Manual de Freezers',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_FREEZER/view?usp=sharing',
            fallbackMsg: 'El manual de Freezers aún no está disponible. Se agregará próximamente.'
        },
        'horno': {
            nombre: 'Manual de Hornos',
            driveUrl: 'https://drive.google.com/file/d/EJEMPLO_ID_HORNO/view?usp=sharing',
            fallbackMsg: 'El manual de Hornos aún no está disponible. Se agregará próximamente.'
        }
    };
    
    // Obtener todos los botones de descarga
    const downloadButtons = document.querySelectorAll('.download-button');
    
    // Agregar evento de clic a cada botón
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el elemento padre (manual-item)
            const manualItem = this.closest('.manual-item');
            const manualType = manualItem.dataset.manual;
            
            // Verificar si el manual existe en la configuración
            if (manualesConfig[manualType]) {
                // Agregar clase de carga
                this.classList.add('loading');
                
                // Simular un pequeño retraso para la animación de carga
                setTimeout(() => {
                    // Verificar si el enlace de Drive está configurado (no es un ejemplo)
                    const driveUrl = manualesConfig[manualType].driveUrl;
                    const isValidUrl = driveUrl && !driveUrl.includes('EJEMPLO_ID');
                    
                    if (isValidUrl) {
                        // Abrir el enlace de Google Drive en una nueva pestaña
                        window.open(driveUrl, '_blank');
                        mostrarMensaje(`Abriendo ${manualesConfig[manualType].nombre}...`, 'success');
                    } else {
                        // Mostrar mensaje de que el archivo no está disponible
                        mostrarMensaje(manualesConfig[manualType].fallbackMsg, 'warning');
                    }
                    
                    // Quitar clase de carga
                    this.classList.remove('loading');
                }, 800);
            } else {
                mostrarMensaje('Manual no encontrado en la configuración.', 'error');
            }
        });
    });
    
    // Botón de volver arriba
    const volverArribaBtn = document.getElementById('volverArribaBtn');
    if (volverArribaBtn) {
        volverArribaBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        // Verificar si ya existe un mensaje
        let mensajeElement = document.querySelector('.mensaje-flotante');
        
        if (!mensajeElement) {
            // Crear elemento para el mensaje
            mensajeElement = document.createElement('div');
            mensajeElement.className = `mensaje-flotante ${tipo}`;
            document.body.appendChild(mensajeElement);
        } else {
            // Actualizar clase del mensaje existente
            mensajeElement.className = `mensaje-flotante ${tipo}`;
        }
        
        // Establecer el mensaje
        mensajeElement.textContent = mensaje;
        
        // Mostrar el mensaje
        mensajeElement.style.display = 'block';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            mensajeElement.style.opacity = '0';
            setTimeout(() => {
                mensajeElement.style.display = 'none';
                mensajeElement.style.opacity = '1';
            }, 500);
        }, 3000);
    }
    
    // Añadir estilos para los mensajes flotantes
    const style = document.createElement('style');
    style.textContent = `
        .mensaje-flotante {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            transition: opacity 0.5s ease;
        }
        
        .mensaje-flotante.success {
            background-color: #2ecc71;
        }
        
        .mensaje-flotante.warning {
            background-color: #f39c12;
        }
        
        .mensaje-flotante.error {
            background-color: #e74c3c;
        }
    `;
    
    document.head.appendChild(style);
});

// Informes de Mantenimiento - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Configuración de los informes con enlaces a carpetas de Google Drive
    const informesConfig = {
        'ots-local': {
            nombre: 'OTs por Local',
            // Reemplazar con el enlace real de la carpeta de Google Drive cuando esté disponible
            driveUrl: 'https://drive.google.com/drive/folders/EJEMPLO_ID_OTS_LOCAL?usp=sharing',
            fallbackMsg: 'Los informes de OTs por Local aún no están disponibles. Se agregarán próximamente.'
        },
        'planificacion': {
            nombre: 'Planificación Mensual de Visitas',
            driveUrl: 'https://drive.google.com/drive/folders/EJEMPLO_ID_PLANIFICACION?usp=sharing',
            fallbackMsg: 'La planificación mensual aún no está disponible. Se agregará próximamente.'
        },
        'preventivos': {
            nombre: 'Mantenimientos Preventivos',
            driveUrl: 'https://drive.google.com/drive/folders/EJEMPLO_ID_PREVENTIVOS?usp=sharing',
            fallbackMsg: 'Los informes de mantenimientos preventivos aún no están disponibles. Se agregarán próximamente.'
        },
        'acuerdo': {
            nombre: 'Acuerdo de Servicio',
            driveUrl: 'https://drive.google.com/drive/folders/EJEMPLO_ID_ACUERDO?usp=sharing',
            fallbackMsg: 'Los documentos de acuerdo de servicio aún no están disponibles. Se agregarán próximamente.'
        },
        'contactos': {
            nombre: 'Contactos Mantenimiento',
            driveUrl: 'https://drive.google.com/drive/folders/EJEMPLO_ID_CONTACTOS?usp=sharing',
            fallbackMsg: 'El directorio de contactos aún no está disponible. Se agregará próximamente.'
        }
    };
    
    // Obtener todos los botones de acceso
    const accessButtons = document.querySelectorAll('.access-button');
    
    // Agregar evento de clic a cada botón
    accessButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el elemento padre (informe-item)
            const informeItem = this.closest('.informe-item');
            const informeType = informeItem.dataset.informe;
            
            // Verificar si el informe existe en la configuración
            if (informesConfig[informeType]) {
                // Agregar clase de carga
                this.classList.add('loading');
                
                // Simular un pequeño retraso para la animación de carga
                setTimeout(() => {
                    // Verificar si el enlace de Drive está configurado (no es un ejemplo)
                    const driveUrl = informesConfig[informeType].driveUrl;
                    const isValidUrl = driveUrl && !driveUrl.includes('EJEMPLO_ID');
                    
                    if (isValidUrl) {
                        // Abrir el enlace de Google Drive en una nueva pestaña
                        window.open(driveUrl, '_blank');
                        mostrarMensaje(`Accediendo a ${informesConfig[informeType].nombre}...`, 'success');
                    } else {
                        // Mostrar mensaje de que el informe no está disponible
                        mostrarMensaje(informesConfig[informeType].fallbackMsg, 'warning');
                    }
                    
                    // Quitar clase de carga
                    this.classList.remove('loading');
                }, 800);
            } else {
                mostrarMensaje('Informe no encontrado en la configuración.', 'error');
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
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Forzar scroll al inicio de la página
    window.scrollTo(0, 0);
    
    // Verificar si se debe ir al inicio después de recargar
    if (sessionStorage.getItem('scrollToTop') === 'true') {
        window.scrollTo(0, 0);
        sessionStorage.removeItem('scrollToTop');
    }
    
    // Inicializar la animación de la malla de puntos
    const initNetworkAnimation = () => {
        const canvas = document.getElementById('networkCanvas');
        const ctx = canvas.getContext('2d');
        
        // Ajustar el tamaño del canvas al tamaño de la ventana
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        // Llamar a resize inicialmente y cuando cambie el tamaño de la ventana
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Configuración de la animación
        const config = {
            particleCount: 70,
            particleColor: 'rgba(255, 255, 255, 0.5)',
            lineColor: 'rgba(255, 255, 255, 0.2)',
            particleRadius: 2,
            lineWidth: 1,
            maxDistance: 170,
            speed: 0.5,
            parallaxIntensity: 5 // Intensidad del efecto parallax
        };
        
        // Arreglo para almacenar las partículas
        let particles = [];
        
        // Variables para el efecto parallax
        let mouseX = 0;
        let mouseY = 0;
        let parallaxX = 0;
        let parallaxY = 0;
        
        // Seguir la posición del mouse para el efecto parallax
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Seguir el scroll para el efecto parallax
        let scrollY = 0;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });
        
        // Clase para las partículas
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = Math.random() * config.speed * 2 - config.speed;
                this.vy = Math.random() * config.speed * 2 - config.speed;
                this.radius = Math.random() * config.particleRadius + 1;
            }
            
            update() {
                // Actualizar posición
                this.x += this.vx;
                this.y += this.vy;
                
                // Rebotar en los bordes
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            
            draw() {
                // Aplicar efecto parallax
                const parallaxOffsetX = (mouseX / window.innerWidth - 0.5) * config.parallaxIntensity;
                const parallaxOffsetY = ((mouseY / window.innerHeight - 0.5) + (scrollY / 1000)) * config.parallaxIntensity;
                
                const drawX = this.x + parallaxOffsetX;
                const drawY = this.y + parallaxOffsetY;
                
                ctx.beginPath();
                ctx.arc(drawX, drawY, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = config.particleColor;
                ctx.fill();
            }
        }
        
        // Inicializar partículas
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        // Dibujar líneas entre partículas cercanas
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    // Aplicar efecto parallax
                    const parallaxOffsetX = (mouseX / window.innerWidth - 0.5) * config.parallaxIntensity;
                    const parallaxOffsetY = ((mouseY / window.innerHeight - 0.5) + (scrollY / 1000)) * config.parallaxIntensity;
                    
                    const p1x = particles[i].x + parallaxOffsetX;
                    const p1y = particles[i].y + parallaxOffsetY;
                    const p2x = particles[j].x + parallaxOffsetX;
                    const p2y = particles[j].y + parallaxOffsetY;
                    
                    // Calcular distancia entre partículas
                    const dx = p1x - p2x;
                    const dy = p1y - p2y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.maxDistance) {
                        // Opacidad basada en la distancia
                        const opacity = 1 - (distance / config.maxDistance);
                        
                        ctx.beginPath();
                        ctx.moveTo(p1x, p1y);
                        ctx.lineTo(p2x, p2y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                        ctx.lineWidth = config.lineWidth;
                        ctx.stroke();
                    }
                }
            }
        };
        
        // Función de animación
        const animate = () => {
            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Actualizar y dibujar partículas
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Dibujar líneas
            drawLines();
            
            // Suavizar el efecto parallax
            parallaxX += (mouseX - parallaxX) * 0.1;
            parallaxY += (mouseY - parallaxY) * 0.1;
            
            // Continuar la animación
            requestAnimationFrame(animate);
        };
        
        // Iniciar la animación
        initParticles();
        animate();
    };
    
    // Iniciar la animación de la malla de puntos
    initNetworkAnimation();
    
    // Capturar elementos del DOM
    const form = document.getElementById('otForm');
    const generarBtn = document.getElementById('generarBtn');
    const copiarBtn = document.getElementById('copiarBtn');
    const numeroOTDiv = document.getElementById('numeroOT');
    const otGeneradoSpan = document.getElementById('otGenerado');
    const resumenTextarea = document.getElementById('resumenOT');
    const copyMessage = document.getElementById('copyMessage');
    const nuevaOTBtn = document.getElementById('nuevaOTBtn');
    const volverArribaBtn = document.getElementById('volverArribaBtn');
    const pegarResumenBtn = document.getElementById('pegarResumenBtn');
    
    // Limpiar formulario al iniciar
    const limpiarFormulario = () => {
        form.reset();
        numeroOTDiv.style.display = 'none';
        resumenTextarea.value = '';
    };
    
    // Limpiar el localStorage y el formulario al iniciar
    localStorage.removeItem('ultimoIdTienda');
    limpiarFormulario();
    
    // Almacenamiento local para guardar el último ID de tienda (desactivado)
    const cargarUltimoIdTienda = () => {
        // Esta función está desactivada para que no se cargue automáticamente el ID
        // const idTienda = document.getElementById('idTienda');
        // const savedId = localStorage.getItem('ultimoIdTienda');
        // if (savedId) {
        //     idTienda.value = savedId;
        // }
    };
    
    // No cargar el último ID de tienda al iniciar
    // cargarUltimoIdTienda();
    
    // Función para generar un número de OT único usando la nueva lógica
    const generarNumeroOT = (tipoLocal) => {
        // Determinar el prefijo según el tipo de local
        let tipo = '';
        if (tipoLocal === 'Propio') {
            tipo = 'P';
        } else if (tipoLocal === 'Franquiciado') {
            tipo = 'F';
        }
        
        // Obtener la fecha y hora actual
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');
        const horaCompleta = horas + minutos;

        // Calcular el dígito del año (sumar todos los dígitos hasta que quede en 1 cifra)
        let digitoAño = año;
        while (digitoAño >= 10) {
            digitoAño = digitoAño.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }

        // Generar una vocal aleatoria
        const vocales = ['A', 'E', 'I', 'O', 'U'];
        const vocalRandom = vocales[Math.floor(Math.random() * vocales.length)];

        // Generar una consonante aleatoria
        const consonantes = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
        const consonanteRandom = consonantes[Math.floor(Math.random() * consonantes.length)];

        // Construir la clave OT
        return tipo + digitoAño + mes + dia + horaCompleta + vocalRandom + consonanteRandom;
    };
    
    // Validar el formulario
    const validarFormulario = () => {
        const tipoLocal = document.getElementById('tipoLocal').value;
        const idTienda = document.getElementById('idTienda').value;
        const solicitante = document.getElementById('solicitante').value;
        const caracterOT = document.getElementById('caracterOT').value;
        const descripcion = document.getElementById('descripcion').value;
        
        if (!tipoLocal || !idTienda || !solicitante || !caracterOT || !descripcion) {
            return false;
        }
        
        return true;
    };
    
    // Generar la OT
    const generarOT = () => {
        if (!validarFormulario()) {
            alert('Por favor, complete todos los campos correctamente antes de generar la OT.');
            return;
        }
        
        const tipoLocal = document.getElementById('tipoLocal').value;
        const idTienda = document.getElementById('idTienda').value;
        const solicitante = document.getElementById('solicitante').value;
        const caracterOT = document.getElementById('caracterOT').value;
        const descripcion = document.getElementById('descripcion').value;
        
        // Ya no guardamos el ID de tienda para futuras visitas
        // localStorage.setItem('ultimoIdTienda', idTienda);
        
        // Generar número de OT con la nueva lógica
        const numeroOT = generarNumeroOT(tipoLocal);
        
        // Mostrar el número de OT
        numeroOTDiv.style.display = 'block';
        otGeneradoSpan.textContent = numeroOT;
        
        // Generar el resumen
        const fecha = new Date();
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const resumen = `[OT: ${numeroOT}]
• Tipo Local: ${tipoLocal}
• ID Tienda: ${idTienda}
• Solicitante: ${solicitante}
• Carácter: ${caracterOT}
• Fecha: ${fechaFormateada}
• Descripción: ${descripcion}

-- Sistema de Gestión MOSTAZA Mantenimiento --`;
        
        resumenTextarea.value = resumen;
        
        // Hacer scroll hasta el resumen
        resumenTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    
    // Copiar el resumen al portapapeles
    const copiarResumen = async () => {
        if (!resumenTextarea.value) {
            return;
        }
        
        try {
            // Usar el API moderno de portapapeles
            await navigator.clipboard.writeText(resumenTextarea.value);
            
            // Mostrar mensaje de éxito
            copyMessage.textContent = '¡Copiado!';
            copyMessage.classList.add('visible');
            
            // Ocultar el mensaje después de 2 segundos
            setTimeout(() => {
                copyMessage.classList.remove('visible');
            }, 2000);
        } catch (err) {
            // Fallback para navegadores que no soportan clipboard API
            resumenTextarea.select();
            document.execCommand('copy');
            
            console.error('Error al copiar: ', err);
        }
    };
    
    // Función para crear una nueva OT (limpiar el formulario)
    const nuevaOT = () => {
        // Limpiar el textarea del resumen
        if (resumenTextarea) {
            resumenTextarea.value = '';
        }
        
        // Limpiar otros campos si es necesario
        
        // Volver al inicio de la página
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Establecer bandera para recargar la página
        sessionStorage.setItem('scrollToTop', 'true');
        
        // Recargar la página para reiniciar el iframe de Google Forms
        location.reload();
    };
    
    // Función para volver al inicio de la página
    const volverArriba = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Función para pegar el resumen en el formulario de Google
    const pegarResumenEnFormulario = async () => {
        if (!resumenTextarea.value) {
            alert('Primero debe generar una OT para tener un resumen que pegar.');
            return;
        }
        
        try {
            // Copiar el resumen al portapapeles
            await navigator.clipboard.writeText(resumenTextarea.value);
            
            // Mostrar mensaje de éxito
            alert('¡Resumen copiado al portapapeles! Ahora puede pegarlo en el primer campo del formulario usando Ctrl+V o haciendo clic derecho y seleccionando "Pegar".');
            
            // Hacer scroll hasta el iframe del formulario
            const iframe = document.querySelector('.google-form-container iframe');
            if (iframe) {
                iframe.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Intentar enfocar el iframe (aunque puede no funcionar por restricciones de seguridad)
                iframe.focus();
            }
        } catch (err) {
            alert('No se pudo copiar automáticamente. Por favor, copie manualmente el resumen y péguelo en el formulario.');
            console.error('Error al intentar pegar: ', err);
        }
    };
    
    // Eventos
    generarBtn.addEventListener('click', generarOT);
    copiarBtn.addEventListener('click', copiarResumen);
    nuevaOTBtn.addEventListener('click', nuevaOT);
    if (volverArribaBtn) {
        volverArribaBtn.addEventListener('click', volverArriba);
    }
    pegarResumenBtn.addEventListener('click', pegarResumenEnFormulario);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() === '') {
                input.setCustomValidity('Este campo es obligatorio');
            } else {
                input.setCustomValidity('');
            }
        });
    });
});

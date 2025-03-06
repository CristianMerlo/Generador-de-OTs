// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Forzar scroll al inicio de la página
    window.scrollTo(0, 0);
    
    // Verificar si se debe ir al inicio después de recargar
    if (sessionStorage.getItem('scrollToTop') === 'true') {
        window.scrollTo(0, 0);
        sessionStorage.removeItem('scrollToTop');
    }
    
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
        
        // Validar formato de ID de Tienda (T-XXXX)
        const idTiendaRegex = /^T-\d{4}$/;
        if (!idTiendaRegex.test(idTienda)) {
            alert('El ID de Tienda debe tener el formato T-XXXX (donde X son dígitos)');
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
    
    // Función para crear una nueva OT (refrescar página completamente)
    const nuevaOT = () => {
        // Limpiar localStorage antes de refrescar
        localStorage.removeItem('ultimoIdTienda');
        
        // Establecer una bandera para indicar que queremos ir al inicio después de recargar
        sessionStorage.setItem('scrollToTop', 'true');
        
        // Refrescar la página completamente (como F5)
        location.reload();
    };
    
    // Función para volver arriba
    const volverArriba = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    volverArribaBtn.addEventListener('click', volverArriba);
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

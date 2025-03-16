// Script específico para la página del Asistente IA

document.addEventListener('DOMContentLoaded', () => {
    // Forzar scroll al inicio de la página
    window.scrollTo(0, 0);
    
    // Elementos del DOM
    const robotIcon = document.querySelector('.robot-icon');
    const categoriaSelect = document.getElementById('categoria');
    const consultaTextarea = document.getElementById('consulta');
    const enviarConsultaBtn = document.getElementById('enviarConsulta');
    const respuestaContainer = document.getElementById('respuestaContainer');
    const respuestaContent = document.getElementById('respuestaContent');
    const apiIndicator = document.getElementById('apiIndicator');
    const limpiarFormularioBtn = document.getElementById('limpiarFormulario'); // Nuevo botón para limpiar el formulario
    
    // Limpiar formulario y área de respuesta al cargar la página
    categoriaSelect.value = '';
    consultaTextarea.value = '';
    respuestaContainer.style.display = 'none';
    
    // Función para limpiar el formulario y el área de respuesta
    const limpiarFormulario = () => {
        consultaTextarea.value = '';
        respuestaContainer.style.display = 'none';
        consultaTextarea.focus();
    };
    
    // Evento para limpiar el formulario cuando se cambia de categoría
    categoriaSelect.addEventListener('change', limpiarFormulario);
    
    // Evento para limpiar el formulario cuando se hace clic en el botón de limpiar
    limpiarFormularioBtn.addEventListener('click', limpiarFormulario);
    
    // Pequeña animación de pulso para el robot
    const pulseAnimation = () => {
        robotIcon.style.transform = 'scale(1.05)';
        setTimeout(() => {
            robotIcon.style.transform = 'scale(1)';
        }, 500);
    };
    
    // Iniciar la animación y repetirla cada 3 segundos
    pulseAnimation();
    setInterval(pulseAnimation, 3000);
    
    // Añadir efecto hover al robot
    robotIcon.addEventListener('mouseenter', () => {
        robotIcon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    robotIcon.addEventListener('mouseleave', () => {
        robotIcon.style.transform = 'scale(1)';
    });
    
    // Base de conocimientos local para respaldo en caso de fallo de API
    const conocimientosBase = {
        equipos: {
            freidoras: "Las freidoras deben limpiarse diariamente y realizar mantenimiento preventivo mensual. Revisa las resistencias y termostatos regularmente.",
            "freidora": "Las freidoras deben limpiarse diariamente y realizar mantenimiento preventivo mensual. Revisa las resistencias y termostatos regularmente.",
            "configuracion freidora": "Para configurar la freidora correctamente: 1) Asegúrate de que esté apagada, 2) Mantén presionado el botón de configuración por 3 segundos, 3) Usa las flechas para navegar por el menú, 4) Selecciona el idioma deseado, 5) Confirma con el botón de verificación.",
            "idioma freidora": "Para cambiar el idioma de la freidora: 1) Apaga la freidora, 2) Mantén presionado el botón de configuración mientras la enciendes, 3) Navega hasta el menú de idioma usando las flechas, 4) Selecciona 'Español' o el idioma deseado, 5) Confirma con el botón de verificación.",
            "coreano freidora": "Si la freidora está configurada en coreano u otro idioma desconocido: 1) Apaga la freidora, 2) Mantén presionado el botón con símbolo de engranaje o configuración mientras la enciendes, 3) Busca opciones que se parezcan a idiomas o que tengan símbolos de banderas, 4) Selecciona la opción que muestre 'ES' o la bandera española, 5) Confirma la selección. Si el problema persiste, contacta al soporte técnico.",
            "freidora coreano": "Si la freidora está configurada en coreano u otro idioma desconocido: 1) Apaga la freidora, 2) Mantén presionado el botón con símbolo de engranaje o configuración mientras la enciendes, 3) Busca opciones que se parezcan a idiomas o que tengan símbolos de banderas, 4) Selecciona la opción que muestre 'ES' o la bandera española, 5) Confirma la selección. Si el problema persiste, contacta al soporte técnico.",
            "freidora configurada": "Si la freidora está mal configurada: 1) Apaga la freidora, 2) Mantén presionado el botón de configuración mientras la enciendes para entrar al modo de servicio, 3) Navega por el menú hasta encontrar 'Factory Reset' o 'Restablecer valores', 4) Selecciona esta opción y confirma, 5) Una vez reiniciada, configura nuevamente según el manual del usuario.",
            "configurada coreano": "Si algún equipo está configurado en coreano u otro idioma desconocido: 1) Apaga el equipo, 2) Busca en el panel de control un botón de configuración (generalmente con símbolo de engranaje), 3) Mantén presionado ese botón mientras enciendes el equipo, 4) Busca opciones de idioma (generalmente con símbolos de banderas), 5) Selecciona español o inglés.",
            "manual freidora": "Los manuales de usuario de las freidoras se encuentran disponibles en la carpeta compartida de mantenimiento o contactando al departamento técnico. Para acceder al modo de servicio técnico, generalmente se requiere una combinación específica de botones que varía según el modelo.",
            parrillas: "Las parrillas requieren limpieza diaria y calibración semanal. Verifica que las temperaturas sean uniformes en toda la superficie.",
            hornos: "Los hornos necesitan limpieza profunda semanal y revisión de sellos de puertas mensualmente. Calibra los termostatos cada tres meses.",
            refrigeradores: "Los refrigeradores deben mantener temperaturas entre 2°C y 4°C. Limpia los condensadores mensualmente y verifica los sellos de las puertas semanalmente.",
            default: "Para información específica sobre equipos, por favor menciona el tipo de equipo (freidora, parrilla, horno, refrigerador, etc.)."
        },
        edilicios: {
            electricidad: "El sistema eléctrico debe ser revisado trimestralmente. Verifica que los tableros estén limpios y que no haya cables sueltos o dañados.",
            plomeria: "La plomería debe inspeccionarse mensualmente para detectar fugas. Limpia las trampas de grasa semanalmente.",
            estructuras: "Las estructuras deben inspeccionarse semestralmente. Revisa grietas, desgaste en pisos y paredes, y el estado de techos.",
            iluminacion: "La iluminación debe revisarse mensualmente. Reemplaza las lámparas quemadas y limpia las luminarias regularmente.",
            default: "Para información sobre mantenimiento edilicio, especifica el área (electricidad, plomería, estructuras, iluminación, etc.)."
        },
        climatizacion: {
            aire: "Los sistemas de aire acondicionado requieren limpieza de filtros mensual y revisión completa trimestral. Verifica refrigerante y compresor.",
            calefaccion: "Los sistemas de calefacción deben revisarse antes de la temporada de frío. Verifica quemadores, intercambiadores de calor y termostatos.",
            ventilacion: "Los sistemas de ventilación necesitan limpieza trimestral de conductos y revisión de motores. Verifica que no haya obstrucciones.",
            campanas: "Las campanas extractoras requieren limpieza semanal de filtros y revisión mensual del motor. Verifica que la extracción sea adecuada.",
            default: "Para información sobre climatización, especifica el sistema (aire acondicionado, calefacción, ventilación, campanas extractoras, etc.)."
        }
    };
    
    // Función para obtener respuesta local basada en palabras clave
    const obtenerRespuestaLocal = (categoria, consulta) => {
        console.log('Buscando respuesta local para categoría:', categoria);
        console.log('Consulta procesada:', consulta);
        
        // Intentar obtener información específica de la base de conocimientos
        const infoBaseConocimiento = buscarPalabrasClaveEnBaseConocimiento(categoria, consulta);
        if (infoBaseConocimiento) {
            console.log('Información encontrada en la base de conocimientos');
            return infoBaseConocimiento;
        }
        
        // Si no se encuentra en la base de conocimientos, usar respuestas predefinidas
        if (categoria === 'equipos') {
            // Patrones para problemas de idioma en freidoras
            if ((consulta.includes('freidora') && consulta.includes('coreano')) || 
                (consulta.includes('freidora') && consulta.includes('idioma')) ||
                (consulta.includes('freidora') && consulta.includes('configura') && consulta.includes('idioma')) ||
                (consulta.includes('freidora') && consulta.includes('configura') && consulta.includes('coreano'))) {
                
                return conocimientosBase.equipos["coreano freidora"];
            }
            
            // También verificar si las palabras están en orden diferente
            // Por ejemplo, "freidora coreano" debería coincidir con "coreano freidora"
            if (consulta.includes('freidora') && consulta.includes('coreano')) {
                return conocimientosBase.equipos["coreano freidora"];
            }
        }
        
        // Si no hay coincidencias específicas, usar la respuesta por defecto
        return conocimientosBase[categoria].default;
    };
    
    // Función para buscar en la base de conocimientos local predefinida (palabras clave)
    const buscarPalabrasClaveEnBaseConocimiento = (categoria, consulta) => {
        const conocimientoCategoria = conocimientosBase[categoria];
        
        // Verificar si hay coincidencias con palabras clave compuestas
        // Primero buscamos coincidencias exactas de frases compuestas
        let coincidenciaEncontrada = false;
        
        // Patrones complejos para detectar frases como "la freidora está configurada en coreano"
        if (categoria === 'equipos') {
            // Patrones para problemas de idioma en freidoras
            if ((consulta.includes('freidora') && consulta.includes('coreano')) || 
                (consulta.includes('freidora') && consulta.includes('idioma')) ||
                (consulta.includes('freidora') && consulta.includes('configura') && consulta.includes('idioma')) ||
                (consulta.includes('freidora') && consulta.includes('configura') && consulta.includes('coreano'))) {
                
                return conocimientosBase.equipos["coreano freidora"];
            }
        }
        
        // Si no hay coincidencia por patrones complejos, buscar coincidencias de frases específicas
        for (const [frase, info] of Object.entries(conocimientoCategoria)) {
            if (frase !== 'default' && frase.includes(' ')) {
                // Si la frase tiene espacios, es una frase compuesta
                if (consulta.includes(frase)) {
                    return info;
                }
                
                // También verificar si las palabras están en orden diferente
                // Por ejemplo, "freidora coreano" debería coincidir con "coreano freidora"
                if (frase.split(' ').every(palabra => consulta.includes(palabra))) {
                    return info;
                }
            }
        }
        
        // Si no encontramos coincidencias de frases compuestas, buscamos palabras individuales
        for (const [palabra, info] of Object.entries(conocimientoCategoria)) {
            if (palabra !== 'default' && consulta.includes(palabra)) {
                return info;
            }
        }
        
        // Si no hay coincidencias, retornar null
        return null;
    };
    
    // Función para consultar a la API de Groq
    const consultarAPI = async (categoria, consulta) => {
        try {
            console.log('Iniciando consulta a Groq API para categoría:', categoria);
            
            // Verificar que CONFIG esté definido
            if (typeof CONFIG === 'undefined') {
                console.error('Error: El objeto CONFIG no está definido. Verifica que config.js esté cargado correctamente.');
                return null;
            }
            
            // Verificar que exista el prompt para la categoría
            if (!CONFIG.PROMPTS || !CONFIG.PROMPTS[categoria]) {
                console.error('Error: No se encontró el prompt para la categoría:', categoria);
                return null;
            }
            
            // Obtener el prompt correspondiente a la categoría seleccionada
            let prompt = CONFIG.PROMPTS[categoria];
            
            // Intentar obtener información de la base de conocimientos para enriquecer el prompt
            const infoBaseConocimiento = obtenerInfoBaseConocimientoParaPrompt(categoria, consulta);
            if (infoBaseConocimiento) {
                // Añadir la información específica al prompt
                prompt = prompt.replace('{{CONSULTA}}', consulta + '\n\nInformación adicional relevante: ' + infoBaseConocimiento);
            } else {
                // Reemplazar el placeholder con la consulta del usuario
                prompt = prompt.replace('{{CONSULTA}}', consulta);
            }
            
            console.log('Prompt preparado para Groq API');
            
            // URL de la API de Groq
            const apiUrl = CONFIG.API_ENDPOINT;
            
            console.log('Enviando solicitud a Groq API...');
            
            // Realizar la petición a la API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                body: JSON.stringify({
                    "model": CONFIG.API_MODEL,
                    "messages": [
                        {
                            "role": "system",
                            "content": "Eres un asistente especializado en mantenimiento para restaurantes Mostaza."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1000
                })
            });
            
            console.log('Respuesta recibida de Groq API. Status:', response.status);
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en la respuesta de Groq API:', errorText);
                throw new Error(`Error en la petición a Groq API: ${response.status} ${response.statusText}`);
            }
            
            // Procesar la respuesta
            const data = await response.json();
            console.log('Datos JSON recibidos de Groq API:', data);
            
            // Extraer el texto de la respuesta
            if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                const respuestaTexto = data.choices[0].message.content;
                console.log('Texto de respuesta extraído correctamente');
                return respuestaTexto;
            } else {
                console.error('Formato de respuesta no reconocido:', data);
                throw new Error('Formato de respuesta no reconocido');
            }
            
        } catch (error) {
            console.error('Error al consultar la API de Groq:', error);
            // Retornar null para indicar que hubo un error
            return null;
        }
    };
    
    // Función para obtener información de la base de conocimientos para el prompt
    const obtenerInfoBaseConocimientoParaPrompt = (categoria, consulta) => {
        // Obtener los items guardados en la base de conocimientos
        const items = JSON.parse(localStorage.getItem(`kb_${categoria}`)) || [];
        if (items.length === 0) return null;
        
        // Convertir la consulta a minúsculas para comparación
        const consultaLower = consulta.toLowerCase();
        
        // Buscar coincidencias en la base de conocimientos
        let coincidencias = [];
        
        if (categoria === 'equipos') {
            // Buscar equipos que coincidan con la consulta
            items.forEach(item => {
                const nombreLower = item.nombre.toLowerCase();
                if (consultaLower.includes(nombreLower) || 
                    (item.problemas && consultaLower.includes(item.problemas.toLowerCase())) ||
                    nombreLower.split(' ').some(palabra => consultaLower.includes(palabra))) {
                    
                    let info = `Equipo: ${item.nombre}`;
                    if (item.problemas) info += `\nProblemas comunes: ${item.problemas}`;
                    if (item.soluciones) info += `\nSoluciones básicas: ${item.soluciones}`;
                    if (item.notas) info += `\nNotas adicionales: ${item.notas}`;
                    
                    coincidencias.push(info);
                }
            });
        } else if (categoria === 'edilicios') {
            // Buscar problemas edilicios que coincidan con la consulta
            items.forEach(item => {
                const tipoLower = item.tipo.toLowerCase();
                if (consultaLower.includes(tipoLower) || 
                    (item.ubicacion && consultaLower.includes(item.ubicacion.toLowerCase())) ||
                    tipoLower.split(' ').some(palabra => consultaLower.includes(palabra))) {
                    
                    let info = `Problema: ${item.tipo}`;
                    if (item.ubicacion) info += `\nUbicación típica: ${item.ubicacion}`;
                    if (item.problemas) info += `\nDescripción: ${item.problemas}`;
                    if (item.soluciones) info += `\nSoluciones básicas: ${item.soluciones}`;
                    
                    coincidencias.push(info);
                }
            });
        } else if (categoria === 'climatizacion') {
            // Buscar sistemas de climatización que coincidan con la consulta
            items.forEach(item => {
                const sistemaLower = item.sistema.toLowerCase();
                if (consultaLower.includes(sistemaLower) || 
                    (item.modelo && consultaLower.includes(item.modelo.toLowerCase())) ||
                    sistemaLower.split(' ').some(palabra => consultaLower.includes(palabra))) {
                    
                    let info = `Sistema: ${item.sistema}`;
                    if (item.modelo) info += `\nMarca/Modelo: ${item.modelo}`;
                    if (item.problemas) info += `\nProblemas comunes: ${item.problemas}`;
                    if (item.soluciones) info += `\nSoluciones básicas: ${item.soluciones}`;
                    
                    coincidencias.push(info);
                }
            });
        }
        
        // Si hay coincidencias, retornar la información
        if (coincidencias.length > 0) {
            return coincidencias.join('\n\n');
        }
        
        return null;
    };
    
    // Función para buscar en la base de conocimientos
    const buscarEnBaseConocimiento = (categoria, consulta) => {
        // Obtener los items guardados en la base de conocimientos
        const items = JSON.parse(localStorage.getItem(`kb_${categoria}`)) || [];
        if (items.length === 0) return null;
        
        // Convertir la consulta a minúsculas para comparación
        const consultaLower = consulta.toLowerCase();
        
        // Buscar coincidencias en la base de conocimientos
        let respuesta = '';
        let coincidenciaEncontrada = false;
        
        if (categoria === 'equipos') {
            // Buscar equipos que coincidan con la consulta
            items.forEach(item => {
                const nombreLower = item.nombre.toLowerCase();
                if (consultaLower.includes(nombreLower) || 
                    (item.problemas && consultaLower.includes(item.problemas.toLowerCase())) ||
                    nombreLower.split(' ').some(palabra => consultaLower.includes(palabra))) {
                    
                    respuesta += `<div class="kb-item-result">
                        <h3>${item.nombre}</h3>
                        ${item.problemas ? `<p><strong>Problemas comunes:</strong> ${item.problemas}</p>` : ''}
                        ${item.soluciones ? `<p><strong>Soluciones básicas:</strong> ${item.soluciones}</p>` : ''}
                        ${item.notas ? `<p><strong>Notas adicionales:</strong> ${item.notas}</p>` : ''}
                    </div>`;
                    
                    coincidenciaEncontrada = true;
                }
            });
        } else if (categoria === 'edilicios') {
            // Buscar problemas edilicios que coincidan con la consulta
            items.forEach(item => {
                const tipoLower = item.tipo.toLowerCase();
                if (consultaLower.includes(tipoLower) || 
                    (item.ubicacion && consultaLower.includes(item.ubicacion.toLowerCase())) ||
                    tipoLower.split(' ').some(palabra => consultaLower.includes(palabra))) {
                    
                    respuesta += `<div class="kb-item-result">
                        <h3>${item.tipo}${item.ubicacion ? ` - ${item.ubicacion}` : ''}</h3>
                        ${item.problemas ? `<p><strong>Descripción de problemas:</strong> ${item.problemas}</p>` : ''}
                        ${item.soluciones ? `<p><strong>Soluciones básicas:</strong> ${item.soluciones}</p>` : ''}
                    </div>`;
                    
                    coincidenciaEncontrada = true;
                }
            });
        } else if (categoria === 'climatizacion') {
            // Buscar sistemas de climatización que coincidan con la consulta
            items.forEach(item => {
                const sistemaLower = item.sistema.toLowerCase();
                if (consultaLower.includes(sistemaLower) || 
                    (item.modelo && consultaLower.includes(item.modelo.toLowerCase())) ||
                    sistemaLower.split(' ').some(palabra => consultaLower.includes(palabra))) {
                    
                    respuesta += `<div class="kb-item-result">
                        <h3>${item.sistema}${item.modelo ? ` - ${item.modelo}` : ''}</h3>
                        ${item.problemas ? `<p><strong>Problemas comunes:</strong> ${item.problemas}</p>` : ''}
                        ${item.soluciones ? `<p><strong>Soluciones básicas:</strong> ${item.soluciones}</p>` : ''}
                    </div>`;
                    
                    coincidenciaEncontrada = true;
                }
            });
        }
        
        // Si hay coincidencias, retornar la respuesta formateada
        if (coincidenciaEncontrada) {
            respuesta += '<p>Si el problema persiste después de intentar estas soluciones básicas, por favor genera una Orden de Trabajo (OT) desde el Generador de OTs para solicitar la visita de un técnico especializado.</p>';
            return respuesta;
        }
        
        return null;
    };
    
    // Función para procesar la consulta
    const procesarConsulta = async () => {
        // Validar que se haya seleccionado una categoría
        if (!categoriaSelect.value) {
            alert('Por favor, selecciona una categoría antes de consultar.');
            categoriaSelect.focus();
            return;
        }
        
        // Validar que se haya escrito una consulta
        if (!consultaTextarea.value.trim()) {
            alert('Por favor, escribe tu consulta antes de enviar.');
            consultaTextarea.focus();
            return;
        }
        
        // Obtener la categoría seleccionada y la consulta
        const categoria = categoriaSelect.value;
        const consulta = consultaTextarea.value.trim();
        
        // Mostrar animación de carga
        respuestaContainer.style.display = 'block';
        respuestaContent.innerHTML = '<div class="loading"></div> Procesando tu consulta...';
        apiIndicator.textContent = 'Conectando...';
        
        // Hacer que el robot "reaccione" a la consulta
        pulseAnimation();
        
        // Verificar el modo de funcionamiento
        if (CONFIG.MODO === 'local') {
            // Modo local: usar solo la base de conocimientos local
            apiIndicator.textContent = 'Base Local';
            respuestaContent.innerHTML = obtenerRespuestaLocal(categoria, consulta.toLowerCase());
            pulseAnimation();
            return;
        }
        
        try {
            // Intentar obtener respuesta de la API de Groq
            if (CONFIG.DEBUG) console.log('Iniciando consulta en modo:', CONFIG.MODO);
            
            const respuestaIA = await consultarAPI(categoria, consulta);
            
            if (respuestaIA) {
                // Si se obtuvo una respuesta de la API, mostrarla
                apiIndicator.textContent = 'Groq AI';
                respuestaContent.innerHTML = formatearRespuesta(respuestaIA);
            } else if (CONFIG.MODO === 'mixto') {
                // En modo mixto, si falla la API usar base local
                apiIndicator.textContent = 'Base Local';
                respuestaContent.innerHTML = '<p><strong>⚠️ No se pudo conectar con el asistente avanzado Groq.</strong></p>';
                respuestaContent.innerHTML += '<p>Usando base de conocimientos local:</p>';
                respuestaContent.innerHTML += obtenerRespuestaLocal(categoria, consulta.toLowerCase());
            } else {
                // En modo API, mostrar error
                apiIndicator.textContent = 'Error';
                respuestaContent.innerHTML = '<p><strong>⚠️ No se pudo conectar con el asistente avanzado Groq.</strong></p>';
                respuestaContent.innerHTML += '<p>Por favor, intenta nuevamente más tarde o contacta al administrador del sistema.</p>';
                respuestaContent.innerHTML += '<p>Detalles: No se pudo obtener respuesta de la API.</p>';
            }
            
        } catch (error) {
            // En caso de error, mostrar mensaje según el modo
            console.error('Error al procesar la consulta:', error);
            
            if (CONFIG.MODO === 'mixto') {
                // En modo mixto, usar base local
                apiIndicator.textContent = 'Base Local';
                respuestaContent.innerHTML = '<p><strong>⚠️ Ocurrió un error al procesar tu consulta con Groq.</strong></p>';
                respuestaContent.innerHTML += '<p>Usando base de conocimientos local:</p>';
                respuestaContent.innerHTML += obtenerRespuestaLocal(categoria, consulta.toLowerCase());
            } else {
                // En modo API, mostrar error
                apiIndicator.textContent = 'Error';
                respuestaContent.innerHTML = '<p><strong>⚠️ Ocurrió un error al procesar tu consulta con Groq.</strong></p>';
                respuestaContent.innerHTML += '<p>Por favor, intenta nuevamente más tarde o contacta al administrador del sistema.</p>';
                respuestaContent.innerHTML += '<p>Detalles: ' + error.message + '</p>';
            }
        }
        
        // Hacer que el robot "reaccione" a la respuesta
        pulseAnimation();
    };
    
    // Función para formatear la respuesta de la API
    const formatearRespuesta = (texto) => {
        // Convertir saltos de línea en etiquetas <br>
        texto = texto.replace(/\n/g, '<br>');
        
        // Convertir listas con guiones o asteriscos en listas HTML
        texto = texto.replace(/(<br>)?\s*[-*]\s+([^<]+)(<br>)?/g, '<li>$2</li>');
        
        // Envolver grupos de elementos de lista en etiquetas <ul>
        if (texto.includes('<li>')) {
            texto = texto.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
            // Corregir posibles anidamientos incorrectos
            texto = texto.replace(/<\/ul><ul>/g, '');
        }
        
        // Destacar números y títulos
        texto = texto.replace(/(\d+\.\s+)([^<]+)(<br>|$)/g, '<p><strong>$1$2</strong></p>');
        
        // Destacar palabras clave importantes
        const palabrasClave = ['Diagnóstico', 'Posibles causas', 'Soluciones', 'Recomendación', 'IMPORTANTE', 'ADVERTENCIA', 'PRECAUCIÓN'];
        palabrasClave.forEach(palabra => {
            const regex = new RegExp(`(${palabra}[^<:]*:)`, 'g');
            texto = texto.replace(regex, '<strong>$1</strong>');
        });
        
        return texto;
    };
    
    // Evento para el botón de enviar consulta
    if (enviarConsultaBtn) {
        enviarConsultaBtn.addEventListener('click', procesarConsulta);
    }
    
    // También permitir enviar con Enter en el textarea
    if (consultaTextarea) {
        consultaTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                procesarConsulta();
            }
        });
    }
});

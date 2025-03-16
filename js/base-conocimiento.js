// Base de Conocimiento - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const tabs = document.querySelectorAll('.kb-tab');
    const panels = document.querySelectorAll('.kb-panel');
    
    // Botones de guardar
    const guardarEquipoBtn = document.getElementById('guardar-equipo');
    const guardarEdilicioBtn = document.getElementById('guardar-edilicio');
    const guardarClimaBtn = document.getElementById('guardar-clima');
    
    // Contenedores de items
    const equiposItems = document.getElementById('equipos-items');
    const ediliciosItems = document.getElementById('edilicios-items');
    const climatizacionItems = document.getElementById('climatizacion-items');
    
    // Cambio de tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clase active de todos los tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Añadir clase active al tab clickeado
            tab.classList.add('active');
            
            // Obtener la categoría del tab
            const categoria = tab.dataset.category;
            
            // Ocultar todos los paneles
            panels.forEach(panel => panel.classList.remove('active'));
            
            // Mostrar el panel correspondiente
            document.getElementById(`${categoria}-panel`).classList.add('active');
        });
    });
    
    // Cargar datos guardados al iniciar
    cargarDatos();
    
    // Evento para guardar equipo
    guardarEquipoBtn.addEventListener('click', () => {
        const nombre = document.getElementById('equipo-nombre').value.trim();
        const problemas = document.getElementById('equipo-problemas').value.trim();
        const soluciones = document.getElementById('equipo-soluciones').value.trim();
        const notas = document.getElementById('equipo-notas').value.trim();
        
        if (nombre && (problemas || soluciones)) {
            guardarItem('equipos', {
                nombre,
                problemas,
                soluciones,
                notas,
                fecha: new Date().toISOString()
            });
            
            // Limpiar formulario
            document.getElementById('equipo-nombre').value = '';
            document.getElementById('equipo-problemas').value = '';
            document.getElementById('equipo-soluciones').value = '';
            document.getElementById('equipo-notas').value = '';
            
            // Actualizar lista
            mostrarItems('equipos');
            
            // Mostrar mensaje de éxito
            mostrarMensaje('Información guardada correctamente', 'success');
        } else {
            mostrarMensaje('Por favor, completa al menos el nombre y uno de los campos de problemas o soluciones', 'error');
        }
    });
    
    // Evento para guardar problema edilicio
    guardarEdilicioBtn.addEventListener('click', () => {
        const tipo = document.getElementById('edilicio-tipo').value.trim();
        const ubicacion = document.getElementById('edilicio-ubicacion').value.trim();
        const problemas = document.getElementById('edilicio-problemas').value.trim();
        const soluciones = document.getElementById('edilicio-soluciones').value.trim();
        
        if (tipo && (problemas || soluciones)) {
            guardarItem('edilicios', {
                tipo,
                ubicacion,
                problemas,
                soluciones,
                fecha: new Date().toISOString()
            });
            
            // Limpiar formulario
            document.getElementById('edilicio-tipo').value = '';
            document.getElementById('edilicio-ubicacion').value = '';
            document.getElementById('edilicio-problemas').value = '';
            document.getElementById('edilicio-soluciones').value = '';
            
            // Actualizar lista
            mostrarItems('edilicios');
            
            // Mostrar mensaje de éxito
            mostrarMensaje('Información guardada correctamente', 'success');
        } else {
            mostrarMensaje('Por favor, completa al menos el tipo y uno de los campos de problemas o soluciones', 'error');
        }
    });
    
    // Evento para guardar sistema de climatización
    guardarClimaBtn.addEventListener('click', () => {
        const sistema = document.getElementById('clima-sistema').value.trim();
        const modelo = document.getElementById('clima-modelo').value.trim();
        const problemas = document.getElementById('clima-problemas').value.trim();
        const soluciones = document.getElementById('clima-soluciones').value.trim();
        
        if (sistema && (problemas || soluciones)) {
            guardarItem('climatizacion', {
                sistema,
                modelo,
                problemas,
                soluciones,
                fecha: new Date().toISOString()
            });
            
            // Limpiar formulario
            document.getElementById('clima-sistema').value = '';
            document.getElementById('clima-modelo').value = '';
            document.getElementById('clima-problemas').value = '';
            document.getElementById('clima-soluciones').value = '';
            
            // Actualizar lista
            mostrarItems('climatizacion');
            
            // Mostrar mensaje de éxito
            mostrarMensaje('Información guardada correctamente', 'success');
        } else {
            mostrarMensaje('Por favor, completa al menos el sistema y uno de los campos de problemas o soluciones', 'error');
        }
    });
    
    // Función para guardar un item en localStorage
    function guardarItem(categoria, item) {
        // Obtener items existentes
        let items = JSON.parse(localStorage.getItem(`kb_${categoria}`)) || [];
        
        // Generar ID único
        item.id = Date.now().toString();
        
        // Añadir nuevo item
        items.push(item);
        
        // Guardar en localStorage
        localStorage.setItem(`kb_${categoria}`, JSON.stringify(items));
    }
    
    // Función para cargar todos los datos
    function cargarDatos() {
        mostrarItems('equipos');
        mostrarItems('edilicios');
        mostrarItems('climatizacion');
    }
    
    // Función para mostrar los items de una categoría
    function mostrarItems(categoria) {
        // Obtener el contenedor correspondiente
        const contenedor = document.getElementById(`${categoria}-items`);
        
        // Obtener items guardados
        const items = JSON.parse(localStorage.getItem(`kb_${categoria}`)) || [];
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Si no hay items, mostrar mensaje
        if (items.length === 0) {
            contenedor.innerHTML = `<div class="kb-empty-message">No hay información guardada sobre ${categoria}.</div>`;
            return;
        }
        
        // Mostrar cada item
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'kb-item';
            itemElement.dataset.id = item.id;
            
            // Contenido según la categoría
            if (categoria === 'equipos') {
                itemElement.innerHTML = `
                    <div class="kb-item-header">
                        <div class="kb-item-title">${item.nombre}</div>
                        <div class="kb-item-actions">
                            <button class="kb-item-action kb-edit" data-id="${item.id}" data-category="${categoria}">Editar</button>
                            <button class="kb-item-action kb-delete" data-id="${item.id}" data-category="${categoria}">Eliminar</button>
                        </div>
                    </div>
                    <div class="kb-item-content">
                        ${item.problemas ? `
                            <div class="kb-item-section">
                                <h4>Problemas Comunes:</h4>
                                <p>${item.problemas}</p>
                            </div>
                        ` : ''}
                        ${item.soluciones ? `
                            <div class="kb-item-section">
                                <h4>Soluciones Básicas:</h4>
                                <p>${item.soluciones}</p>
                            </div>
                        ` : ''}
                        ${item.notas ? `
                            <div class="kb-item-section">
                                <h4>Notas Adicionales:</h4>
                                <p>${item.notas}</p>
                            </div>
                        ` : ''}
                    </div>
                `;
            } else if (categoria === 'edilicios') {
                itemElement.innerHTML = `
                    <div class="kb-item-header">
                        <div class="kb-item-title">${item.tipo}${item.ubicacion ? ` - ${item.ubicacion}` : ''}</div>
                        <div class="kb-item-actions">
                            <button class="kb-item-action kb-edit" data-id="${item.id}" data-category="${categoria}">Editar</button>
                            <button class="kb-item-action kb-delete" data-id="${item.id}" data-category="${categoria}">Eliminar</button>
                        </div>
                    </div>
                    <div class="kb-item-content">
                        ${item.problemas ? `
                            <div class="kb-item-section">
                                <h4>Descripción de Problemas:</h4>
                                <p>${item.problemas}</p>
                            </div>
                        ` : ''}
                        ${item.soluciones ? `
                            <div class="kb-item-section">
                                <h4>Soluciones Básicas:</h4>
                                <p>${item.soluciones}</p>
                            </div>
                        ` : ''}
                    </div>
                `;
            } else if (categoria === 'climatizacion') {
                itemElement.innerHTML = `
                    <div class="kb-item-header">
                        <div class="kb-item-title">${item.sistema}${item.modelo ? ` - ${item.modelo}` : ''}</div>
                        <div class="kb-item-actions">
                            <button class="kb-item-action kb-edit" data-id="${item.id}" data-category="${categoria}">Editar</button>
                            <button class="kb-item-action kb-delete" data-id="${item.id}" data-category="${categoria}">Eliminar</button>
                        </div>
                    </div>
                    <div class="kb-item-content">
                        ${item.problemas ? `
                            <div class="kb-item-section">
                                <h4>Problemas Comunes:</h4>
                                <p>${item.problemas}</p>
                            </div>
                        ` : ''}
                        ${item.soluciones ? `
                            <div class="kb-item-section">
                                <h4>Soluciones Básicas:</h4>
                                <p>${item.soluciones}</p>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            
            contenedor.appendChild(itemElement);
        });
        
        // Añadir eventos a los botones de editar y eliminar
        document.querySelectorAll('.kb-delete').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
        
        document.querySelectorAll('.kb-edit').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
    }
    
    // Función para manejar la eliminación de un item
    function handleDelete(e) {
        const id = e.target.dataset.id;
        const categoria = e.target.dataset.category;
        
        if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
            // Obtener items existentes
            let items = JSON.parse(localStorage.getItem(`kb_${categoria}`)) || [];
            
            // Filtrar el item a eliminar
            items = items.filter(item => item.id !== id);
            
            // Guardar en localStorage
            localStorage.setItem(`kb_${categoria}`, JSON.stringify(items));
            
            // Actualizar lista
            mostrarItems(categoria);
            
            // Mostrar mensaje
            mostrarMensaje('Elemento eliminado correctamente', 'success');
        }
    }
    
    // Función para manejar la edición de un item
    function handleEdit(e) {
        const id = e.target.dataset.id;
        const categoria = e.target.dataset.category;
        
        // Obtener items existentes
        let items = JSON.parse(localStorage.getItem(`kb_${categoria}`)) || [];
        
        // Encontrar el item a editar
        const item = items.find(item => item.id === id);
        
        if (!item) return;
        
        // Llenar el formulario según la categoría
        if (categoria === 'equipos') {
            document.getElementById('equipo-nombre').value = item.nombre || '';
            document.getElementById('equipo-problemas').value = item.problemas || '';
            document.getElementById('equipo-soluciones').value = item.soluciones || '';
            document.getElementById('equipo-notas').value = item.notas || '';
            
            // Cambiar el botón de guardar
            guardarEquipoBtn.textContent = 'Actualizar Información';
            guardarEquipoBtn.dataset.editing = 'true';
            guardarEquipoBtn.dataset.editId = id;
            
            // Scroll al formulario
            document.querySelector('.kb-form').scrollIntoView({ behavior: 'smooth' });
            
            // Cambiar el evento del botón
            guardarEquipoBtn.removeEventListener('click', guardarEquipoHandler);
            guardarEquipoBtn.addEventListener('click', () => {
                const nombre = document.getElementById('equipo-nombre').value.trim();
                const problemas = document.getElementById('equipo-problemas').value.trim();
                const soluciones = document.getElementById('equipo-soluciones').value.trim();
                const notas = document.getElementById('equipo-notas').value.trim();
                
                if (nombre && (problemas || soluciones)) {
                    // Actualizar el item
                    const itemIndex = items.findIndex(i => i.id === id);
                    if (itemIndex !== -1) {
                        items[itemIndex] = {
                            ...items[itemIndex],
                            nombre,
                            problemas,
                            soluciones,
                            notas,
                            fechaModificacion: new Date().toISOString()
                        };
                        
                        // Guardar en localStorage
                        localStorage.setItem(`kb_${categoria}`, JSON.stringify(items));
                        
                        // Limpiar formulario
                        document.getElementById('equipo-nombre').value = '';
                        document.getElementById('equipo-problemas').value = '';
                        document.getElementById('equipo-soluciones').value = '';
                        document.getElementById('equipo-notas').value = '';
                        
                        // Restaurar botón
                        guardarEquipoBtn.textContent = 'Guardar Información';
                        delete guardarEquipoBtn.dataset.editing;
                        delete guardarEquipoBtn.dataset.editId;
                        
                        // Actualizar lista
                        mostrarItems(categoria);
                        
                        // Mostrar mensaje
                        mostrarMensaje('Información actualizada correctamente', 'success');
                    }
                } else {
                    mostrarMensaje('Por favor, completa al menos el nombre y uno de los campos de problemas o soluciones', 'error');
                }
            });
        } else if (categoria === 'edilicios') {
            // Similar a equipos, pero para edilicios
            document.getElementById('edilicio-tipo').value = item.tipo || '';
            document.getElementById('edilicio-ubicacion').value = item.ubicacion || '';
            document.getElementById('edilicio-problemas').value = item.problemas || '';
            document.getElementById('edilicio-soluciones').value = item.soluciones || '';
            
            // Cambiar el botón y añadir evento similar al de equipos
            // (Código similar al de equipos)
        } else if (categoria === 'climatizacion') {
            // Similar a equipos, pero para climatización
            document.getElementById('clima-sistema').value = item.sistema || '';
            document.getElementById('clima-modelo').value = item.modelo || '';
            document.getElementById('clima-problemas').value = item.problemas || '';
            document.getElementById('clima-soluciones').value = item.soluciones || '';
            
            // Cambiar el botón y añadir evento similar al de equipos
            // (Código similar al de equipos)
        }
    }
    
    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        // Verificar si ya existe un mensaje
        let mensajeElement = document.querySelector('.kb-message');
        
        if (!mensajeElement) {
            // Crear elemento para el mensaje
            mensajeElement = document.createElement('div');
            mensajeElement.className = `kb-message ${tipo}`;
            document.querySelector('.kb-header').appendChild(mensajeElement);
        } else {
            // Actualizar clase del mensaje existente
            mensajeElement.className = `kb-message ${tipo}`;
        }
        
        // Establecer el mensaje
        mensajeElement.textContent = mensaje;
        
        // Mostrar el mensaje
        mensajeElement.style.display = 'block';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            mensajeElement.style.display = 'none';
        }, 3000);
    }
    
    // Función para exportar la base de conocimiento
    window.exportarBaseConocimiento = function() {
        const data = {
            equipos: JSON.parse(localStorage.getItem('kb_equipos')) || [],
            edilicios: JSON.parse(localStorage.getItem('kb_edilicios')) || [],
            climatizacion: JSON.parse(localStorage.getItem('kb_climatizacion')) || []
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'base-conocimiento-mostaza.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    
    // Función para importar la base de conocimiento
    window.importarBaseConocimiento = function(fileInput) {
        const file = fileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Verificar que el archivo tenga la estructura correcta
                    if (data.equipos && data.edilicios && data.climatizacion) {
                        // Guardar datos
                        localStorage.setItem('kb_equipos', JSON.stringify(data.equipos));
                        localStorage.setItem('kb_edilicios', JSON.stringify(data.edilicios));
                        localStorage.setItem('kb_climatizacion', JSON.stringify(data.climatizacion));
                        
                        // Actualizar listas
                        cargarDatos();
                        
                        // Mostrar mensaje
                        mostrarMensaje('Base de conocimiento importada correctamente', 'success');
                    } else {
                        mostrarMensaje('El archivo no tiene el formato correcto', 'error');
                    }
                } catch (error) {
                    mostrarMensaje('Error al procesar el archivo: ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
        }
    };
    
    // Añadir botones de exportar e importar
    const kbHeader = document.querySelector('.kb-header');
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'kb-export-btn';
    exportBtn.textContent = 'Exportar Base de Conocimiento';
    exportBtn.addEventListener('click', window.exportarBaseConocimiento);
    
    const importLabel = document.createElement('label');
    importLabel.className = 'kb-import-label';
    importLabel.textContent = 'Importar Base de Conocimiento';
    
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    importInput.addEventListener('change', function() {
        window.importarBaseConocimiento(this);
    });
    
    importLabel.appendChild(importInput);
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'kb-actions';
    actionsDiv.appendChild(exportBtn);
    actionsDiv.appendChild(importLabel);
    
    kbHeader.appendChild(actionsDiv);
    
    // Añadir estilos para los botones
    const style = document.createElement('style');
    style.textContent = `
        .kb-actions {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        .kb-export-btn, .kb-import-label {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .kb-export-btn:hover, .kb-import-label:hover {
            background-color: #2980b9;
        }
        
        .kb-message {
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 15px;
            display: none;
        }
        
        .kb-message.success {
            background-color: #dff0d8;
            color: #3c763d;
            border: 1px solid #d6e9c6;
        }
        
        .kb-message.error {
            background-color: #f2dede;
            color: #a94442;
            border: 1px solid #ebccd1;
        }
    `;
    
    document.head.appendChild(style);
});

function crearLiga(nombre, posicion) {
    // Validacion de datos
    if (!nombre || !posicion) {
        alert('Por favor, llenar todos los campos');
        return;
    }

    fetch('/crear_liga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_liga: nombre, posicion_liga: parseInt(posicion, 10) }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            alert(result.message);
        })
        .catch((error) => {
            console.error('Error al crear la liga:', error);
            alert('Error al crear la liga. Inténtalo de nuevo más tarde.');
        });
}

function crearTorneo(nombre, posicion) {
    // Validacion de datos
    if (!nombre || !posicion) {
        alert('Por favor, llenar todos los campos');
        return;
    }

    fetch('/crear_torneo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_torneo: nombre, posicion_torneo: parseInt(posicion, 10) }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            alert(result.message);
        })
        .catch((error) => {
            console.error('Error al crear el torneo:', error);
            alert('Error al crear el torneo. Inténtalo de nuevo más tarde.');
        });
}

function crearPartido(equipo_ganador, puntos_ganador, equipo_perdedor, puntos_perdedor, comentario, nombreLiga) {
    // Validacion de datos
    if (!equipo_ganador || !puntos_ganador || !equipo_perdedor || !puntos_perdedor || !comentario) {
        alert('Por favor, llenar todos los campos');
        return;
    }

    fetch('/crear_partido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            comentario: comentario, puntos_ganador: puntos_ganador, puntos_perdedor: puntos_perdedor,
            equipo_ganador: equipo_ganador, equipo_perdedor: equipo_perdedor, nombreLiga: nombreLiga
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            alert(result.message);
        })
        .catch((error) => {
            console.error('Error al crear el partido:', error);
            alert('Error al crear el partido. Inténtalo de nuevo más tarde.');
        });
}

function obtener_Ligas() {
    fetch('/obtener_ligas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las ligas');
            }
            return response.json();
        })
        .then(data => {
            const lista = document.getElementById('listaLigas');
            lista.innerHTML = ''; // Limpia la lista anterior
            data.forEach(liga => {
                const item = document.createElement('li');
                const button = document.createElement('button'); // Crear botón
                button.textContent = `${liga.nombre_Liga} - Posición: ${liga.posicion_Liga}`;
                button.onclick = () => {
                    localStorage.setItem('nombreLiga', liga.nombre_Liga);
                    window.location.href = 'liga_detalle.html'; // Redirige a otra página
                };
                item.appendChild(button); // Agregar el botón al elemento de la lista
                lista.appendChild(item); // Agregar el elemento a la lista
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar las ligas.');
        });

}
// mas que todo se creo para poder identificar que dicho partido pertenece a una liga
function obtener_nombre_liga() {
    const nombreLiga = localStorage.getItem('nombreLiga');
    if (nombreLiga) {
        document.getElementById('nombreLiga').textContent = nombreLiga; // Muestra el nombre de la liga
    } else {
        document.getElementById('nombreLiga').textContent = 'Liga no encontrada';
    }
}

function obtener_Torneos() {
    fetch('/obtener_torneos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los torneos');
            }
            return response.json();
        })
        .then(data => {
            const lista = document.getElementById('listaTorneos');
            lista.innerHTML = ''; // Limpia la lista anterior
            data.forEach(torneo => {
                const item = document.createElement('li');
                item.textContent = `${torneo.nombre_Torneo} - Posición: ${torneo.posicion_Torneo}`;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los torneos.');
        });

}

function cargarDetalleLiga() {
    // Obtener el id_Liga de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id_Liga = urlParams.get('id_Liga');

    // Mostrar información básica
    const ligaInfo = document.getElementById('ligaInfo');
    ligaInfo.textContent = `Estás viendo la liga con ID: ${id_Liga}`;

    // Configurar el botón para mostrar el ID
    const boton = document.getElementById('mostrarIdLiga');
    boton.addEventListener('click', () => {
        alert(`ID de la liga: ${id_Liga}`);
    });
}





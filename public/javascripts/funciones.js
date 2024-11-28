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

function crearPartido(equipo_ganador, puntos_ganador, equipo_perdedor, puntos_perdedor, comentario) {
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
            equipo_ganador: equipo_ganador, equipo_perdedor: equipo_perdedor
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
                item.textContent = `${liga.nombre_Liga} - Posición: ${liga.posicion_Liga}`;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar las ligas.');
        });

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
            data.forEach(liga => {
                const item = document.createElement('li');
                item.textContent = `${liga.nombre_Torneo} - Posición: ${liga.posicion_Torneo}`;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los torneos.');
        });

}




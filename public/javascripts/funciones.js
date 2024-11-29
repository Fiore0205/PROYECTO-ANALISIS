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

function crearPartidoLiga(equipo_ganador, puntos_ganador, equipo_perdedor, puntos_perdedor, comentario, nombreLiga) {
    // Validacion de datos
    if (!equipo_ganador || !puntos_ganador || !equipo_perdedor || !puntos_perdedor || !comentario) {
        alert('Por favor, llenar todos los campos');
        return;
    }

    fetch('/crear_partido_liga', {
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

function crearPartidoTorneo(equipo_ganador, puntos_ganador, equipo_perdedor, puntos_perdedor, comentario, nombreTorneo) {
    // Validacion de datos
    if (!equipo_ganador || !puntos_ganador || !equipo_perdedor || !puntos_perdedor || !comentario) {
        alert('Por favor, llenar todos los campos');
        return;
    }

    fetch('/crear_partido_torneo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            comentario: comentario, puntos_ganador: puntos_ganador, puntos_perdedor: puntos_perdedor,
            equipo_ganador: equipo_ganador, equipo_perdedor: equipo_perdedor, nombreTorneo: nombreTorneo
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
                const button = document.createElement('button');
                button.textContent = `${torneo.nombre_Torneo} - Posición: ${torneo.posicion_Torneo}`;
                button.onclick = () => {
                    localStorage.setItem('nombreTorneo', torneo.nombre_Torneo);
                    window.location.href = 'torneo_detalle.html'; // Redirige a otra página
                };
                lista.appendChild(item);
                lista.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los torneos.');
        });

}

function obtener_Amistoso() {
    fetch('/obtener_amistosos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los torneos');
            }
            return response.json();
        })
        .then(data => {
            const lista = document.getElementById('listaAmistoso');
            lista.innerHTML = ''; // Limpia la lista anterior
            data.forEach(amistoso => {
                const item = document.createElement('li');
                const button = document.createElement('button');
                button.textContent = `${amistoso.nombre_Amistoso}`;
                button.onclick = () => {
                    localStorage.setItem('nombreAmistoso', amistoso.nombre_Amistoso);
                    window.location.href = 'amistoso_detalle.html'; // Redirige a otra página
                };
                lista.appendChild(item);
                lista.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los amistosos.');
        });

}

function obtener_partidos_amistosos() {
    const nombreAmistoso = localStorage.getItem('nombreAmistoso');
    if (nombreAmistoso) {
        document.getElementById('nombreAmistoso').textContent = nombreAmistoso; // Muestra el nombre del amistoso
    } else {
        document.getElementById('nombreAmistoso').textContent = 'Amistoso no encontrado';
    }

    fetch('/obtener_partidos_amistosos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreAmistoso }), // Enviar en el cuerpo
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los partidos');
            }
            return response.json();
        })
        .then(data => {
            const lista = document.getElementById('lista_Partidos_Amistosos');
            lista.innerHTML = ''; // Limpia la lista anterior
            data.forEach(partido_amistoso => {
                const item = document.createElement('li');
                item.textContent = `${partido_amistoso.nombre_equipo1} ${partido_amistoso.resultado} ${partido_amistoso.nombre_equipo2}`;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los amistosos.');
        });
}

// mas que todo se creo estos metodos para poder identificar que dicho partido pertenece a una liga, torneo
function obtener_nombre_liga() {
    const nombreLiga = localStorage.getItem('nombreLiga');
    if (nombreLiga) {
        document.getElementById('nombreLiga').textContent = nombreLiga; // Muestra el nombre de la liga
    } else {
        document.getElementById('nombreLiga').textContent = 'Liga no encontrada';
    }
}

function obtener_nombre_torneo() {
    const nombreTorneo = localStorage.getItem('nombreTorneo');
    if (nombreTorneo) {
        document.getElementById('nombreTorneo').textContent = nombreTorneo; // Muestra el nombre del torneo
    } else {
        document.getElementById('nombreTorneo').textContent = 'Torneo no encontrado';
    }
}









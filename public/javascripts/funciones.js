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
            console.error('Error al crear la torneo:', error);
            alert('Error al crear la torneo. Inténtalo de nuevo más tarde.');
        });
}


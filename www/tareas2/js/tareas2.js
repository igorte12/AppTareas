
window.onload = function () {

    actualizarTabla();

    this.document.getElementById("datosuser").onclick = function (event) {
        event.preventDefault();


        if (document.getElementById("datousuario").getAttribute("class") != "mostrar") {
            document.getElementById("loader").setAttribute("class", "loader mostrar");
            document.getElementById("listarTareas").setAttribute("class", "ocultar");
            var req = new XMLHttpRequest();
            // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
            req.open("GET", "/datosuser", true);
            // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
            req.addEventListener("load", function () {
                // La petición ha tenido éxito
                if (req.status >= 200 && req.status < 400) {
                    // console.log(req.response); //Pinta en div html
                    var datos = JSON.parse(req.response);
                    document.getElementById("loader").setAttribute("class", "loader ocultar");
                    document.getElementById("datousuario").setAttribute("class", "mostrar");
                    document.getElementById("nombre").value = datos.nombre;

                    document.getElementById("email").value = datos.email;
                } else {
                    // Se muestran informaciones sobre el problema ocasionado durante el tratamiento de la petición
                    console.error(req.status + " " + req.statusText);
                }
            });
            // Gestor del evento que indica que la petición no ha podido llegar al servidor
            req.addEventListener("error", function () {
                console.error("Error de red"); // Error de conexión
            });
            // Envío de la petición
            req.send(null);

            //     // ajaxGet("/peticion", function (text) {
            //     //     console.log(text)
            //     console.log("Peticion enviada");
            // }
        }
        else {
            document.getElementById("listarTareas").setAttribute("class", "mostrar");
            document.getElementById("datousuario").setAttribute("class", "ocultar");
        }
    }
    this.document.getElementById("user").onclick = function () {
        if (document.getElementById("useroptions").getAttribute("class") == "dropdownver") {
            document.getElementById("useroptions").setAttribute("class", "dropdown");
        } else {
            document.getElementById("useroptions").setAttribute("class", "dropdownver");
        }
    }
    document.getElementById("guardar").onclick = function (event) {
        event.preventDefault();
        var req = new XMLHttpRequest();
        // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
        req.open("POST", "/datosuser", true);
        req.setRequestHeader("Content-Type", "application/json");
        // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
        req.addEventListener("load", function () {
            // La petición ha tenido éxito
            if (req.status >= 200 && req.status < 400) {
                console.log(req.response);
                if (req.response == "ok") {
                    alert("Usuario actualizado correctamente")
                } else {
                    alert("Error al actualiar usuario");
                }
            } else {
                // Se muestran informaciones sobre el problema ocasionado durante el tratamiento de la petición
                console.error(req.status + " " + req.statusText);
            }
        });
        // Gestor del evento que indica que la petición no ha podido llegar al servidor
        req.addEventListener("error", function () {
            console.error("Error de red"); // Error de conexión
        });

        var datos = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password1").value,
            avatar:document.getElementById("avatarT").src,
        }
        // Envío de la petición
        console.log(datos);
        req.send(JSON.stringify(datos));
    }
    this.document.getElementById("btnTarea").onclick = function (ev) {
        ev.preventDefault();
        var req = new XMLHttpRequest();
        // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
        req.open("POST", "/nuevatarea", true);
        req.setRequestHeader("Content-Type", "application/json");
        // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
        req.addEventListener("load", function () {
            // La petición ha tenido éxito
            console.log(req.response);
            var respuesta = JSON.parse(req.response);
            if (respuesta.estado == 1) {
                alert("Tarea creada correctamente idtarea: " + respuesta.idtarea);
                document.getElementById("nuevatarea").setAttribute("class", "ocultar");
            } else {
                alert("Error al crear la tarea")
            }

            llenarTablaTareas(respuesta.tareas)
        });
        req.addEventListener("error", function () {
            console.log(req.response);
        });

        var datos = {
            titulo: document.getElementById("titulo").value,
            descripcion: document.getElementById("descripcion").value,
            ejecutor: document.getElementById("ejecutor").value,
            fecha: document.getElementById("fecha").value
        }
        console.log(datos)
        req.send(JSON.stringify(datos));
    }
    this.document.getElementById("addTarea").onclick = function () {
        document.getElementById("nuevatarea").setAttribute("class", "mostrar")
        document.getElementById("titulo").focus
    }

    this.document.getElementById("btnActTarea").onclick = function (ev) {
        ev.preventDefault();
        var req = new XMLHttpRequest();
        // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
        req.open("POST", "/actualizartarea", true);
        req.setRequestHeader("Content-Type", "application/json");
        // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
        req.addEventListener("load", function () {
            // La petición ha tenido éxito
            console.log(JSON.parse(req.response));
            var respuesta = JSON.parse(req.response);
            if (respuesta.estado == 1) {
                alert("Tarea actualizada correctamente idtarea: " + respuesta.idtarea);
                document.getElementById("formActualizarTarea").reset();
            } else {
                alert("Error al crear la tarea")
            }
            document.getElementById("actualizarTarea").setAttribute("class", "ocultar");
            llenarTablaTareas(respuesta.tareas)
        });
        req.addEventListener("error", function () {
            console.log(req.response);
        });

        var datos = {
            id: document.getElementById("act_idtarea").value,
            titulo: document.getElementById("act_titulo").value,
            descripcion: document.getElementById("act_descripcion").value,
            ejecutor: document.getElementById("act_ejecutor").value,
            fecha: document.getElementById("act_fecha").value
        }
        console.log(datos)
        req.send(JSON.stringify(datos));
    }


    document.getElementById('foto').addEventListener('change', archivo, false);

    // //mal
    // this.document.getElementById("btnEliminar").onclick = function (ev) {
    //     ev.preventDefault();
    //     var req = new XMLHttpRequest();
    //     // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
    //     req.open("POST", "/eliminartarea", true);
    //     req.setRequestHeader("Content-Type", "application/json");
    //     // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
    //     req.addEventListener("load", function () {
    //         // La petición ha tenido éxito
    //         console.log(JSON.parse(req.response));
    //         var respuesta = JSON.parse(req.response);
    //         if (respuesta.estado == 1) {
    //             alert("Tarea eliminada correctamente idtarea: " + respuesta.idtarea);
    //             document.getElementById("formActualizarTarea").reset();
    //         } else {
    //             alert("Error al eliminar la tarea")
    //         }
    //         document.getElementById("actualizarTarea").setAttribute("class", "ocultar");
    //         llenarTablaTareas(respuesta.tareas)
    //     });
    //     req.addEventListener("error", function () {
    //         console.log(req.response);
    //     });

    //     var datos = {
    //         id: document.getElementById("act_idtarea").value,
    //         titulo: document.getElementById("act_titulo").value,
    //         descripcion: document.getElementById("act_descripcion").value,
    //         ejecutor: document.getElementById("act_ejecutor").value,
    //         fecha: document.getElementById("act_fecha").value
    //     }
    //     console.log(datos)
    //     req.send(JSON.stringify(datos));
    // }
}


function llenarTablaTareas(listatareas) {
    let contenidoTabla = "";
    for (const tarea of listatareas) {
        let thOptions = ""
        switch (tarea.permiso) {
            case 0:
                thOptions = `<i class="fas fa-book fa-fw" onclick="peticionEditar(${tarea.id})"></i>`;
                break;
            case 1:
                thOptions = `<i class="fas fa-book fa-fw" onclick="peticionEditar(${tarea.id})"></i>`;
                break;
            case 2:
                thOptions = `<i class="fas fa-book fa-fw" onclick="peticionEditar(${tarea.id})"></i>`;
                break;
            case 3:
                thOptions = "";
                break;
        }
        let fila = `<tr>
            <th>${tarea.titulo}</th>
            <th>${tarea.descripcion}</th>
            <th>${tarea.autor}</th>
            <th>${tarea.ejecutor}</th>
            <th>${tarea.fecha}</th>
            <th>${tarea.titulo}</th>
            <th>${tarea.estado}</th>
            <th>${thOptions}</th>
            <th><i class="fas fa-pencil-alt" onclick="peticionEditar(${tarea.id})"></i> <i class></th>
            <th><i class="fas fa-times" onclick="peticionEliminar(${tarea.id})"></i> <i class></th>
            </tr>`;
        contenidoTabla += fila;
    }
    document.getElementById("tblTareas").innerHTML = contenidoTabla;
}


function peticionEditar(id) {
    var req = new XMLHttpRequest();
    var url = "/gettarea?id=" + id;
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        var datos = JSON.parse(req.response);
        console.log(datos);
        document.getElementById("act_idtarea").value = datos.tarea.id;
        document.getElementById("act_titulo").value = datos.tarea.titulo;
        document.getElementById("act_descripcion").value = datos.tarea.descripcion;
        document.getElementById("act_fecha").value = String(datos.tarea.fecha).substr(0, 10);
        document.getElementById("actualizarTarea").setAttribute("class", "mostrar");
        document.getElementById("act_ejecutor").value = datos.tarea.ejecutor;
    });
    req.send(null);
};

function archivo(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
        console.log(f);
        document.getElementById("avatarT").src = f.target.result;
    }
    reader.readAsDataURL(file);
}


function peticionEliminar(id) {
    let req = new XMLHttpRequest();
    let url = "/eliminartarea?id=" + id;
    req.open("GET", url, true);
    req.addEventListener("load", function () {

        var resultado = JSON.parse(req.response);

        llenarTablaTareas(resultado);
    })
    req.send(null);
}


function actualizarTabla() {

    var req = new XMLHttpRequest();
    req.open("GET", "/leertareas", true);
    req.addEventListener("load", function () {
        llenarTablaTareas(JSON.parse(req.response))
    });
    req.addEventListener("error", function (err, result) {
    });
    req.send(null);
}

function cambioestado(id) {
    var req = new XMLHttpRequest();
    var url = "/cambioesrsdi?id=" + id;
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        console.log(req.response)
        var datos = JSON.parse(req.response);
        llenarTablaTareas(datos.tareas)
    });

    req.addEventListener("error", function () {
    });
    req.send(null);
}


function handleFileSelect(evt) {   //pedir fotos


    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

}










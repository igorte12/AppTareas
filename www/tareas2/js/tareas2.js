window.onload = function () {                   //Hacer es desplegable de opciones del usuario
    // document.getElementById("btnPeticion").onclick = function () {
    //     // Creación de la petición HTTP
    this.document.getElementById("datosuser").onclick = function (event) {
        document.getElementById("listatareas").setAttribute("class", "ocultar");
        document.getElementById("loader").setAttribute("class", "loader mostrar");
        event.preventDefault();
        if (document.getElementById("datousuario").getAttribute("class") != "mostrar") {
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
            document.getElementById("listatareas").getAttribute("class", "mostrar");
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
                if(req.response=="ok"){
                    alert("Usuario actualizado correctamente")
                }else{
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
            password: document.getElementById("password1").value
        }
        // Envío de la petición
        console.log(datos);
        req.send(JSON.stringify(datos));
    }
    this.document.getElementById("btnTarea").onclick = function (ev) {
        ev.preventDefault();
        var req = new XMLHttpRequest();
        // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
        req.open("POST", "/datosuser", true);
        req.setRequestHeader("Content-Type", "application/json");
        // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
        req.addEventListener("load", function () {
            // La petición ha tenido éxito
            console.log(req.response);
            var respuesta=JSON.parse(req.response);
            if (respuesta.estado==1) {
                alert("Tarea creada correctamente idtarea: "+respuesta.idtarea);
            } else {
                alert("Error al crear la tarea")
            }
        });
        req.addEventListener("error", function () {
            console.log(req.response); 
        });
var datos={
    titulo:document.getElementById("titulo").value,
    descripcion:document.getElementById("descripcion").value,
    ejecutor:document.getElementById("ejecutor").value,
    fecha:document.getElementById("fecha").value
}
console.log(datos)
req.send(JSON.stringify(datos));
    }
}




window.onload = function () {                   //Hacer es desplegable de opciones del usuario
    // document.getElementById("btnPeticion").onclick = function () {
    //     // Creación de la petición HTTP
    this.document.getElementById("datosuser").onclick = function (event) {
        event.preventDefault();
        if (document.getElementById("datousuario").getAttribute("class") != "mostrar") {
            var req = new XMLHttpRequest();
            // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
            req.open("GET", "/datouser", true);
            // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
            req.addEventListener("load", function () {
                // La petición ha tenido éxito
                if (req.status >= 200 && req.status < 400) {
                   console.log(req.response); //Pinta en div html

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


            document.getElementById("listatareas").getAttribute("class", "ocultar");
            document.getElementById("datousuario").setAttribute("class", "mostrar");
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

    }



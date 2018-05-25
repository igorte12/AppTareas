window.onload = function () {
    document.getElementById("btnPeticion").onclick = function () {
        // Creación de la petición HTTP
        var req = new XMLHttpRequest();
        // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
        req.open("GET", url, true);
        // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
        req.addEventListener("load", function () {
            // La petición ha tenido éxito
            if (req.status >= 200 && req.status < 400) {
                document.getElementById("datos").innerHTML=REQ.responseText; //Pinta en div html
        
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

        // ajaxGet("/peticion", function (text) {
        //     console.log(text)
        console.log("Peticion enviada");
    }
}





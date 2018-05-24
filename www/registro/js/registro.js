window.onload = function () {
    console.log("página lista")

    document.getElementById("password2").addEventListener("blur", function () {
        if (document.getElementById("password1").value != document.getElementById("password2").value) {
            document.getElementById("mensajes").setAttribute("style", "display:block");
            document.getElementById("mensajes").innerHTML = "Lac contraseñas deben ser iguales";
        } else {
            console.log("iguales");
            document.getElementById("guardar").disabled = false
        }
    })
        document.getElementById("password2").addEventListener("focus", function () {
        document.getElementById("mensajes").setAttribute("style", "display:none");
    })

}
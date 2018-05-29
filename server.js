var express = require('express');                                          //copiado de https://gist.github.com/gabmontes/e496a41f835bca65e99b
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require("fs");   //fs lee ficheros
var app = express();                                                      //copiado de https://github.com/expressjs/body-parser
var jsonParser = bodyParser.json();                                       // create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })         // create application/x-www-form-urlencoded parser
app.use(jsonParser);
app.use(urlencodedParser);
var cookieSession = require('cookie-session')                             //Definir las cookies
app.use(cookieSession({                                                  //Definir campos cookies
    name: 'session',                                                      //nombre de la cookie
    keys: ["SID"],                                                        //palabra que, junto con la propia contraseña introducida por el usuario, utilizará la cookie para encriptar las contraseñas (en ligar de SID se puede poner cualquier cosa)
    //Cookie Options
    maxAge: 24 * 60 * 60 * 1000 //24 horas                                  //Definir duración cookies
}))

var connection = mysql.createConnection({                              //acceso base de datos del servidor
    host: 'localhost',                                                 //puerto
    user: 'root',                                                     //usuario
    password: '',                                                     //contraseña
    database: 'apptareas',                                            //base dde datos
})

/**
 *Puntos de entrada de mi servidor
*/
app.get('/', function (req, res) {                                                  //lo que hay dentro es lo que aparecerá como página dinámica (se puede modificar la misma dentro del corchete del endpoint(app.get/app.post)) en la página raíz (localhost:3000) 
    // //     fs.readFile("./www/registro/registro.html", "utf8", function (err, text) {   //lee archivo registro.html
    // //         res.send(text);                                                         //devuelve el archivo registro.html
    // //       });
    res.send("Servidor ok")
});

app.get('/registro', function (req, res) {
    fs.readFile("./www/registro/registro.html", "utf8", function (err, texto) {
        res.send(texto)
    });
});

app.post('/registro', function (req, res) {

    var nombre = req.body.nombre
    var usuario = req.body.usuario
    var email = req.body.email
    var password = req.body.password1
    connection.query("insert into usuario (nombre, usuario, password, email) values (?,?,?,?)", [nombre, usuario, password, email], function (err, result) {
        if (err) {
            throw err;
        } else {
            res.send("Usuario introducido correctamente" + req.body.nombre);
        }

    })

});

app.get('/login', function (req, res) {
    fs.readFile("./www/login/login.html", "utf8", function (err, texto) {
        res.send(texto)
    });
});


app.post('/login', function (req, res) {
    var usuario = req.body.usuario
    var password = req.body.password1

    connection.query("SELECT * FROM usuario where usuario=? AND password=?", [usuario, password], function (err, result) {   //Coteja los datos usuario y password que introducimos en los input con la base de datos llamada usuario. si coinciden devuelve los valores de su fila, si no coincide devuelve cadena vacía.
        if (err) {
            throw err
        } else {


            if (result.length == 0) {
                fs.readFile("www/login/login.html", "utf8", function (err, texto) {
                    console.log("reemplazando");
                    texto = texto.replace('class="ocultar">[error]', 'class="mostrar">Usuario o contraseña incorrectos')
                    res.send(texto)

                })



            } else {
                req.session.user = usuario;
                req.session.iduser = result[0].id
                res.redirect('/tareas2');
            }
        }
    })

});

app.get('/tareas2', function (req, res) {
    if (req.session.user == undefined) {                 //si no está logueado (cookies)
        res.redirect('/login');                      //lo redirige a la página de login
    } else {
        fs.readFile("./www/tareas2/tareas2.html", "utf8", function (err, texto) {
            texto = texto.replace("[usuario]", req.session.user);
            res.send(texto)

        })
    }

});


app.get("/peticion", function (req, res) {
    console.log(req.session.user);
    setInterval(function () {
        res.send("Hola mundo");        //el 5000 significa esperar 5 segundos para enviar la respuesta
    }, 5000);
});


app.get("/cerrar", function (req, res) {
    res.session = null;
    res.redirect("/login");

})


app.get("/datosuser", function (req, res) {
    connection.query("select * from usuario where id=?", [req.session.iduser], function (err, result) {
        if (err) {
            throw err;
        } else {
            var datos = {

                nombre: result[0].nombre,
                usuario: result[0].usuario,
                email: result[0].email,
            }
            setTimeout(function () {
                res.send(JSON.stringify(datos));
            }, 1000);
        }
    })
})


app.post("/datosuser", function (req, res) {
    console.log(req.body);

    connection.query("UPDATE usuario SET nombre = ?, password = ?, email = ? WHERE id = ?",
        [req.body.nombre, req.body.password, req.body.email, req.session.iduser],
        function (err, result) {
            if (result.affectedRows > 0) {
                res.send("ok");

            } else {
                res.send("noOk");
            }
        })

})

app.post("/nuevatarea", function (req, res) {
    console.log(req.body);
    connection.query("insert into tarea (titulo,descripcion,fecha,autor,ejecutor) values(?,?,?,?,?")
    [req.body.titulo, req.body.descripcion, req.body.fecha, req.session.iduser, req.body.ejecutor],
        function (err, result) {
            if (err) {
                console.log(err)
                result = {
                    estado: 0,
                    idtarea: null
                }
            } else {
                console.log(result);
                result = {
                    estado: 1,
                    idtarea: result.insertId
                }
            }

            res.send(JSON.stringify(result));

        }
})

app.use(express.static('www'));          //Devuelve como página estática (no cambia nunca) (en la dirección localhost:3000/"nombre del archivo".html) lo guardado en la carpeta www (hay que ejecutar el archivo deseado en la url (/registro.html)))
// Para acceder a archivos css y js hay que partir de la ruta de la página estática que hemos configurado (www rn este caso, por lo que el archivo registro estaría en: registro/ css/ registro.css).

var server = app.listen(3000, function () {    //Arranca servidor (puerto 3000)
    console.log('Servidor web iniciado');
});
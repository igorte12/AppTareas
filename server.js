var express = require('express');                                          //copiado de https://gist.github.com/gabmontes/e496a41f835bca65e99b
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require("fs");   //fs lee ficheros
var app = express();                                                      //copiado de https://github.com/expressjs/body-parser
var jsonParser = bodyParser.json();                                       // create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })         // create application/x-www-form-urlencoded parser
app.use(jsonParser);
app.use(urlencodedParser);
var cookieSession =require('cookie-session')                             //Definir las cookies
app.use(cookieSession({                                                  //Definir campos cookies
    name:'session',
    keys:["SID"],
    //Cookie Options
    maxAge: 24 * 60*60*1000 //24 horas                                  //Definir duración cookies
}))

var connection = mysql.createConnection({                              //acceso base de datos del servidor
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apptareas',
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
        if (result.length == 0) {
            
            res.send("Usuario o contraseña incorrecta")
        } else {
            req.session.user=usuario;
            res.redirect('/tareas2');
        }

    })

});

app.get('/tareas2', function (req, res) {
    if(req.session.user==undefined){                 //si no está logueado (cookies)
        res.redirect('/login');                      //lo redirige a la página de login
    }else{
        fs.readFile("./www/tareas2/tareas2.html", "utf8", function (err, texto) {
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



app.use(express.static('www/registro'));          //Devuelve como página estática (no cambia nunca) (en la dirección localhost:3000/"nombre del archivo".html) lo guardado en la carpeta www/registro (hay que ejecutar el archivo deseado en la url (/registro.html)))



app.get("/cerrar", function(req,res){
res.send("cerar");
})

var server = app.listen(3000, function () {    //Arranca servidor (puerto 3000)
    console.log('Servidor web iniciado');

});


var express = require('express');                                          //copiado de https://gist.github.com/gabmontes/e496a41f835bca65e99b
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require("fs");   //fs lee ficheros
var app = express();                                                      //copiado de https://github.com/expressjs/body-parser
var jsonParser = bodyParser.json()                                        // create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })         // create application/x-www-form-urlencoded parser
app.use(jsonParser);
app.use(urlencodedParser);

var connection=mysql.createConnection({
host:'localhost',
user:'root',
password:'',
database:'apptareas',
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

    var nombre=req.body.nombre
    var usuario=req.body.usuario
    var email=req.body.email
    var password=req.body.password
    connection.query("insert into usuario (nombre, usuario, password, email) values (?,?,?,?)",[nombre,usuario,password,email],function(err,result){
         res.send("Usuario introducido correctamente" + req.body.nombre);
    })
   
});

app.use(express.static('www/registro'));          //Devuelve como página estática (no cambia nunca) (en la dirección localhost:3000/"nombre del archivo".html) lo guardado en la carpeta www/registro (hay que ejecutar el archivo deseado en la url (/registro.html)))


var server = app.listen(3000, function () {    //Arranca servidor (puerto 3000)
    console.log('Servidor web iniciado');
});
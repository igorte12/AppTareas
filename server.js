var express = require('express');                                          //copiado de https://gist.github.com/gabmontes/e496a41f835bca65e99b
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require("fs");   //fs lee ficheros
var app = express();                                                      //copiado de https://github.com/expressjs/body-parser
var jsonParser = bodyParser.json();                                       // create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })         // create application/x-www-form-urlencoded parser
app.use(jsonParser);
app.use(urlencodedParser);
const SELECT_ALL_TAREAS = "SELECT tarea.id,tarea.titulo,tarea.descripcion,tarea.fecha,tarea.estado,usuario.nombre as autor,usr.nombre as ejecutor FROM tarea,usuario,usuario as usr where autor=usuario.id AND ejecutor=usr.id";
const SELECT_ALL_TAREASID = "SELECT tarea.id,tarea.titulo,tarea.descripcion,tarea.fecha,tarea.estado,usuario.nombre as autor,usuario.id as autorid,usr.id as ejecutorid,usr.nombre as ejecutor FROM tarea,usuario,usuario as usr where autor=usuario.id AND ejecutor=usr.id";
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

            req.session.user = usuario;
            req.session.iduser = result.insertId;

            res.redirect('/tareas2');

        }

    })

});

app.get('/login', function (req, res) {             //faltan cosas
    fs.readFile("./www/login/login.html", "utf8", function (err, texto) {
        res.send(texto)

    })
    // if (req.session.user != undefined || req.session.iduser == false) {

    // } else {
    //     fs.readFile("./www/login/login.html", "utf8", function (err, texto) {
    //         res.send(texto)

    //     }
    //     )
});

app.post('/login', function (req, res) {
    console.log("Login post")
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
                console.log("login ok")
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
            connection.query("select * from usuario", function (err, result) {
                //Cargamos avatar usuario logeado.
                let options = "";
                if (err) {
                    throw err;
                } else {
                    for (const usuario of result) {
                        options += `<option value='${usuario.id}'>${usuario.nombre}</options>`;
                        
                        if (usuario.id == req.session.iduser) {
                            if (usuario.avatar != "") {
                                let imgAvatar = `<img src="${usuario.avatar}" alt="" id="avatarT">`;
                                texto = texto.replace(`<span class="fas fa-user"></span>`, imgAvatar);
                            }
                        }
                    }
                }
                texto = texto.split("[ejecutores]").join(options);
                res.send(texto);
            })
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
    //console.log(req.body);
    if (req.body.password == "") {
        res.send("noOK");
    } else {
        connection.query("UPDATE usuario SET nombre = ?, password = ?, email = ?, avatar = ? WHERE id = ?",
            [req.body.nombre, req.body.password, req.body.email, req.body.avatar, req.session.iduser],
            function (err, result) {
                if (result.affectedRows > 0) {
                    //console.log(result)
                    res.send("ok");

                } else {
                    res.send("noOk");
                }
            })
    }
})

app.post("/nuevatarea", function (req, res) {
    console.log(req.body);
    connection.query("insert into tarea (titulo,descripcion,fecha,autor,ejecutor) values(?,?,?,?,?)",
        [req.body.titulo, req.body.descripcion, req.body.fecha, req.session.iduser, req.body.ejecutor],
        function (err, result) {
            connection.query(SELECT_ALL_TAREAS, function (error, resultado) {
                resultado = convertDateFormat(resultado);
                if (error) {
                    throw error;
                } else {
                    if (err) {
                        console.log(err)
                        result = {
                            estado: 0,
                            idtarea: null,
                            tareas: resultado
                        }
                    } else {

                        console.log(result);
                        result = {
                            estado: 1,
                            idtarea: result.insertId,
                            tareas: resultado
                        }
                    }
                    res.send(JSON.stringify(result));
                }
            })
        });
});

app.get("/leertareas", function (req, res) {
    // connection.query("select ..............., function (error, resultado) {  
    connection.query(SELECT_ALL_TAREASID, function (error, resultado) {
        resultado.forEach(element => {
            if (req.session.iduser == element.autorid && req.session.iduser == element.ejecutorid) {
                element.permiso = 0;
            }
            if (req.session.iduser == element.autorid && req.session.iduser != element.ejecutorid) {
                element.permiso = 1;
            }
            if (req.session.iduser != element.autorid && req.session.iduser == element.ejecutorid) {
                element.permiso = 2;
            }
            if (req.session.iduser != element.autorid && req.session.iduser != element.ejecutorid) {
                element.permiso = 3;
            }

        })
        console.log(resultado)
        resultado = convertDateFormat(resultado);
        res.send(JSON.stringify(resultado));  //res.send envía cadena de texto del servidor a la web (tareas2.js) donde esta lo recibe en res. response
    });
});


app.get("/eliminartarea/:id?", function (req, res) {
    console.log("Eliminando tarea " + req.query.id);
    connection.query("DELETE FROM tarea WHERE id= ?", [req.query.id], function (err, result) {
        connection.query(SELECT_ALL_TAREASID, function (error, resultado) {
            resultado.forEach(element => {
                if (req.session.iduser == element.autorid && req.session.iduser == element.ejecutorid) {
                    element.permiso = 0;
                }
                if (req.session.iduser == element.autorid && req.session.iduser != element.ejecutorid) {
                    element.permiso = 1;
                }
                if (req.session.iduser != element.autorid && req.session.iduser == element.ejecutorid) {
                    element.permiso = 2;
                }
                if (req.session.iduser != element.autorid && req.session.iduser != element.ejecutorid) {
                    element.permiso = 3;
                }

            })

            resultado = convertDateFormat(resultado);
            res.send(JSON.stringify(resultado));  //res.send envía cadena de texto del servidor a la web (tareas2.js) donde esta lo recibe en res. response
        });
    })
})

app.post("/actualizartarea", function (req, res) {
    var result;
    connection.query("UPDATE tarea SET  titulo = ?, descripcion = ?, fecha = ?, ejecutor = ? WHERE tarea.id = ?",
        [req.body.titulo, req.body.descripcion, req.body.fecha, req.body.ejecutor, req.body.id], function (err, resulta) {
            connection.query(SELECT_ALL_TAREAS, function (error, resultado) {
                resultado = convertDateFormat(resultado);
                if (error) {
                    throw error;
                } else {
                    if (err) {
                        console.log(err)
                        result = {
                            estado: 0,
                            idtarea: null,
                            tareas: resultado
                        }
                    } else {

                        console.log(result);
                        result = {
                            estado: 1,
                            idtarea: null,
                            tareas: resultado
                        }
                    }
                    res.send(JSON.stringify(result));
                }
            })

        })
})

app.get("/gettarea/:id?", function (req, res) {
    let datos = {}
    connection.query("select * from tarea where id=?", [req.query.id], function (err, result) {
        console.log(result[0].titulo);

        datos.tarea = result[0];
        res.send(JSON.stringify(datos));
    })

})

app.get("cambioestado/:id?", function (req, res) {

    connection.query("Select tarea.id as idtarea,titulo,descripcion,autor as autorid,ejecutor as ejecutorid,fecha,estado,usuario.id as usuarioid,nombre FROM tarea RIGHT JOIN usuario on tarea.id=? and autor=usuario.id", [req.query.id], function (err, result) {
        for (const iterator of result) {
            if (iterator.idtarea) {
                datos.tarea = {
                    id: iterator.idtarea,
                    titulo: iterator.titulo,
                    descripcion: iterator.descripcion,
                    autor: iterator.autorid,
                    ejecutor: iterator.ejecutorid,
                    fecha: iterator.fecha,
                    estado: iterator.estado
                }
            }

            if (iterator.usuarioid) {
                let user = {
                    id: iterator.usuarioid,
                    nombre: iterator.nombre
                }
                datos.usuarios.push(user);
            }
        }
        res.send(JSON.stringify(datos));
    });

});

app.use(express.static('www'));          //Devuelve como página estática (no cambia nunca) (en la dirección localhost:3000/"nombre del archivo".html) lo guardado en la carpeta www (hay que ejecutar el archivo deseado en la url (/registro.html)))
// Para acceder a archivos css y js hay que partir de la ruta de la página estática que hemos configurado (www rn este caso, por lo que el archivo registro estaría en: registro/ css/ registro.css).

var server = app.listen(3000, function () {    //Arranca servidor (puerto 3000)
    console.log('Servidor web iniciado');
});


//fecha
function convertDateFormat(array) {
    for (let i = 0; i < array.length; i++) {
        let fecha = new Date(array[i].fecha);             //definir fecha recorriendo  el array (Date identifica el dia, el mes y el año)
        let formatFecha = [fecha.getDate(), fecha.getMonth(), fecha.getFullYear()].join('/');  //Separa las partes de la fecha(partes definidas por Date) con /
        array[i].fecha = formatFecha;                                           //sobrescribe la fecha de un valor del array por esa misma fecha con el formato dd/mm/yyyy (formatFecha) 
    }
    return array;
}

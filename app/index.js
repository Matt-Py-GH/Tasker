//Imports
import express from 'express';
import cookieParser from 'cookie-parser';

import { methods as auth } from './controllers/auth.controller.js';
import { methods as authorization } from './middleware/authorization.js';

import { query } from './model/model.js';

// Fix para __dirname
import path from 'path';
import { fileURLToPath } from 'url';

//Dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));


//Creación del servidor
const server = express()
server.set("port", 4000)
const port = server.get("port")
server.listen(port)
console.log("Servidor corriendo en:", port)

//Configuración principal
server.use('/scripts', express.static(__dirname + '/public/scripts'));
server.use('/styles', express.static(__dirname + '/public/styles'));
server.use('/resources', express.static(__dirname + '/public/resources'));
server.use('/resources/icon', express.static(__dirname + '/public/resources/icon'));
server.use(express.json())
server.use(cookieParser())


//GET
server.get("/",authorization.LoginIfNotAuth, (req, res) => {res.sendFile(__dirname + "/pages/login.html")})
server.get("/register", authorization.LoginIfNotAuth,(req, res) => {res.sendFile(__dirname + "/pages/register.html")})
server.get("/home",authorization.HomeIfVerified, (req, res) => {res.sendFile(__dirname + "/pages/home.html")})
server.get("/api/usuario", authorization.GetUserFromToken, (req, res) => {
    res.json({ username: req.user });
});
server.get("/api/tareas", authorization.GetUserFromToken, async (req, res) => {
    try {
      const idUsuario = req.userID;  // lo que guardaste en el middleware
      const resultado = await query('SELECT * FROM tarea WHERE idUsuario = $1', [idUsuario]);
  
      res.json(resultado.rows); // enviás las tareas como arreglo de objetos

    } catch (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).json({ status: 'Error', message: 'Error interno del servidor' });
    }
  });


//POST
server.post("/api/register",  auth.Register)
server.post("/api/login",  auth.Login)
server.post("/api/tareas", authorization.GetUserFromToken, async (req, res) => {
  const { nombre, descripcion, prioridad } = req.body;
  const idUsuario = req.userID;

  if (!nombre || !prioridad) {
    return res.status(400).json({ status: "Error", message: "Faltan datos obligatorios." });
  }

  try {
    const resultado = await query(
      `INSERT INTO Tarea (nombre, descripcion, estado, prioridad, idUsuario)
       VALUES ($1, $2, 'Incompleta', $3, $4)
       RETURNING *`,
      [nombre, descripcion, prioridad, idUsuario]
    );

    return res.status(201).json({ status: "OK", tarea: resultado.rows[0] });
  } catch (error) {
    console.error("Error al insertar tarea:", error.message);
    return res.status(500).json({ status: "Error", message: "Error interno del servidor." });
  }
});

//DELETE
server.delete("/api/tareas", authorization.GetUserFromToken, async (req, res) => {
  const idUsuario = req.userID;
  const resultado = await query('SELECT * FROM tarea WHERE idUsuario = $1', [idUsuario]);

  await query("DELETE FROM Tarea WHERE id = $1", [req.id])

});


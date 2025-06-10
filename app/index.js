//Imports
import express from 'express';
import cookieParser from 'cookie-parser';

import { methods as auth } from './controllers/auth.controller.js';
import { methods as authorization } from './middleware/authorization.js';

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


//Rutas
server.get("/",authorization.LoginIfNotAuth, (req, res) => {res.sendFile(__dirname + "/pages/login.html")})
server.get("/register", authorization.LoginIfNotAuth,(req, res) => {res.sendFile(__dirname + "/pages/register.html")})
server.get("/home",authorization.HomeIfVerified, (req, res) => {res.sendFile(__dirname + "/pages/home.html")})
server.post("/api/register",  auth.Register)
server.post("/api/login",  auth.Login)
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../model/model.js";

dotenv.config();
let tokelete = ""

async function HomeIfVerified(req, res, next) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return res.redirect("/");  // No hay cookies, no autorizado

    const cookieJWT = cookies.split("; ").find(c => c.startsWith("jwt="));
    if (!cookieJWT) return res.redirect("/"); // No hay cookie JWT

    const token = cookieJWT.slice(4); // quitamos "jwt="
    const tokenVerified = jsonwebtoken.verify(token, process.env.JWT_SIGN);

    // Verificamos que el usuario exista en la base
    const exists = await query('SELECT * FROM usuarios WHERE username = $1', [tokenVerified.user]);
    if (exists.rows.length === 0) return res.redirect("/"); // Usuario no encontrado

    // Usuario válido, dejamos pasar
    next();

  } catch (error) {
    // Token inválido, expirado o error en la DB
    return res.redirect("/");
  }
}

async function LoginIfNotAuth(req, res, next) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return next(); // No hay cookies, dejamos entrar a login

    const cookieJWT = cookies.split("; ").find(c => c.startsWith("jwt="));
    if (!cookieJWT) return next(); // No hay cookie JWT, dejamos entrar

    const token = cookieJWT.slice(4);
    tokelete = token
    const tokenVerified = jsonwebtoken.verify(token, process.env.JWT_SIGN);

    // Verificamos si el usuario existe
    const exists = await query('SELECT * FROM usuarios WHERE username = $1', [tokenVerified.user]);
    if (exists.rows.length > 0) {
      // Si usuario existe y está logueado, lo mandamos a home (no puede entrar a login)
      return res.redirect("/home");
    } else {
      // Si no existe, dejamos pasar al login
      next();
    }

  } catch (error) {
    // Token inválido o error: dejamos pasar para que intente loguearse de nuevo
    console.log("SE METIÓ AL CATCH:", error)
    next();
  }
}

export const methods = {
  HomeIfVerified,
  LoginIfNotAuth
}

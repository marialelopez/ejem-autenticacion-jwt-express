const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.end("Hola mundo!");
});

app.get("/api", validateToken, (req, res) => {
  res.json({
    tuits: [
      {
        id: 0,
        text: "Este es mi primer tuit",
        username: "aleja",
      },
      {
        id: 0,
        text: "El mejor lenguaje es html",
        username: "patito",
      },
    ],
  });
});

app.get("/login", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
    </head>
    <body>
        <form method="post" action="/auth">
            Nombre de usuario: <input type="text" name="text"> <br/>
            Contraseña: <input type="password" name="password"> <br/>
            <input type="submit" value="Iniciar sesión" />
        </form>
    </body>
    </html> `);
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  //consultar BD y validar que existen username y password
  const user = { username: username };

  const accessToken = generateAccessToken(user);
  res.header("authorization", accessToken).json({
    message: "Usuario autenticado",
    token: accessToken,
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "5m" });
}

function validateToken(req, res, next) {
  const accessToken = req.headers["authorization"];
  if (!accessToken) res.send("Acess denied");

  jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err) {
      res.send("Acess denied, token expired or incorrect");
    } else {
      next();
    }
  });
}
app.listen(8000, () => {
  console.log("Servidor iniciando...");
});

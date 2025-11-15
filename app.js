import express, { json } from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();

app.disable("x-powered-by");
app.use(json());
app.use(corsMiddleware());

//ruta raiz de la api
app.get("/", (req, res) => {
  res.send(
    "<h1>Bienvenido a mi API de películas con express</h1><br/><p>Usa el endpoint /movies para ver las películas</p>"
  );
});

//rutas de peliculas
app.use("/movies", moviesRouter);

//puerto de escucha, usa una variable de entorno o el 1234 por defecto
const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto http://localhost:${PORT}`);
});

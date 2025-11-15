const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const z = require("zod");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const { error } = require("node:console");
const cors = require("cors");

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPETED_ORIGINS = [
        "http://localhost:5500",
        "http://localhost:1234",
        "http://localhost:8080",
        "http://movie.com",
      ];

      if (ACCEPETED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido"));
    },
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: "Movie not found" });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.success === false) {
    return res.status(400).json({ error: result.error.message });
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4, genera un id unico para cada pelicula
    ...result.data,
  };

  //por el momento se coloca push, al hacer esto, ya no es un api REST
  movies.push(newMovie);

  res.status(201).json(newMovie); //actualizar la cache del cliente
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  // obtener el indice de la pelicula a actualizar
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  // si no se encuentra la pelicula, retornar un error 404
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: "Movie deleted successfully" });
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto http://localhost:${PORT}`);
});

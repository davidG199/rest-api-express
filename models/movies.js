import { randomUUID } from "node:crypto";
import movies from "../movies.json" with { type: "json" };

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  }

  static async getById(id) {
    return movies.find((movie) => movie.id === id);
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(), // uuid v4, genera un id unico para cada pelicula
      ...input,
    };

    //por el momento se coloca push, al hacer esto, ya no es un api REST
    movies.push(newMovie);
    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) return null;

    const updateMovie = {
      ...movies[movieIndex],
      ...input,
    };
    movies[movieIndex] = updateMovie;
    return updateMovie;
  }
}

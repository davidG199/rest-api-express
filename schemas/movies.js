import z from "zod"

const movieShema = z.object({
  title: z.string({
    invalid_type_error: "El titulo debe ser una cadena de texto",
    required_error: "El titulo es obligatorio",
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: "El poster debe ser una URL valida",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Horror",
      "Crime",
      "Romance",
      "Sci-Fi",
      "Fantasy",
      "Thriller",
    ]),
    {
      invalid_type_error: "El genero debe ser un array de cadenas de texto",
      required_error: "El genero es obligatorio",
    }
  ),
});

// Validacion completa para crear una nueva pelicula
function validateMovie(object) {
  return movieShema.safeParse(object);
}

// Partial permite que todos los campos sean opcionales para actualizaciones parciales, pero si se proporcionan,los campos deben cumplir con las mismas reglas de validacion
function validatePartialMovie(input) {
  return movieShema.partial().safeParse(input);
}
export { validateMovie, validatePartialMovie };
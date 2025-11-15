import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

const router = Router();
export const moviesRouter = router;

//prefijo /movies en el archivo app.js

router.get("/", MovieController.getAll);

router.get("/:id", MovieController.getById);

router.post("/", MovieController.create);

router.patch("/:id", MovieController.update);

router.delete("/:id", MovieController.delete);

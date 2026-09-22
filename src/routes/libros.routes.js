import { Router } from "express"
import { listarLibros, agregarLibro, eliminarLibro } from "../controllers/libros.controller.js"
import { soloAdmin } from "../middlewares/auth.middleware.js"
import { validarLibro } from "../middlewares/validaciones.middleware.js"

const router = Router()

router.get("/", listarLibros)
router.post("/", soloAdmin, validarLibro, agregarLibro)
router.delete("/:id", soloAdmin, eliminarLibro)

export default router

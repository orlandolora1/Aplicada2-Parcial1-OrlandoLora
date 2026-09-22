import { Router } from "express"
import {
  pedirPrestado,
  devolverPrestamo,
  listarTodosPrestamos,
  misPrestamos
} from "../controllers/prestamos.controller.js"
import { soloAdmin } from "../middlewares/auth.middleware.js"
import { validarPrestamo } from "../middlewares/validaciones.middleware.js"

const router = Router()

router.post("/", validarPrestamo, pedirPrestado)
router.put("/:id/devolver", devolverPrestamo)
router.get("/", soloAdmin, listarTodosPrestamos)
router.get("/mis-prestamos", misPrestamos)

export default router

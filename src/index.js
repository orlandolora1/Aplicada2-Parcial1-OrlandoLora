import "dotenv/config"
import express from "express"
import { loggerMiddleware } from "./middlewares/logger.middleware.js"
import { verificarToken } from "./middlewares/auth.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import librosRoutes from "./routes/libros.routes.js"
import prestamosRoutes from "./routes/prestamos.routes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(loggerMiddleware)

// Rutas públicas
app.use("/auth", authRoutes)

// Rutas protegidas con JWT
app.use("/libros", verificarToken, librosRoutes)
app.use("/prestamos", verificarToken, prestamosRoutes)

app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: "Error interno del servidor" })
})

app.listen(PORT, () => console.log(`Puerto ${PORT}`))

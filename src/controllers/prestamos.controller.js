import { prisma } from "../db.js"

// POST /prestamos - Pedir prestado un libro (cualquier usuario autenticado)
export const pedirPrestado = async (req, res, next) => {
  try {
    const { libroId } = req.body

    const libro = await prisma.libro.findUnique({ where: { id: libroId } })
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" })

    // Regla: no se puede pedir prestado un libro que no está disponible
    if (!libro.disponible) {
      return res.status(400).json({ error: "El libro no está disponible" })
    }

    const prestamo = await prisma.prestamo.create({
      data: { usuarioId: req.usuario.id, libroId }
    })

    // Regla: al pedir prestado, el libro cambia a disponible: false
    await prisma.libro.update({
      where: { id: libroId },
      data: { disponible: false }
    })

    res.status(201).json(prestamo)
  } catch (err) { next(err) }
}

// PUT /prestamos/:id/devolver - Devolver un libro (solo el dueño del préstamo)
export const devolverPrestamo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" })
    }

    const prestamo = await prisma.prestamo.findUnique({ where: { id } })
    if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado" })

    // Regla: un usuario solo puede devolver sus propios préstamos
    if (prestamo.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: "Acceso denegado" })
    }

    if (prestamo.fechaFin) {
      return res.status(400).json({ error: "Este préstamo ya fue devuelto" })
    }

    // Regla: al devolver, se registra la fechaFin
    const prestamoActualizado = await prisma.prestamo.update({
      where: { id },
      data: { fechaFin: new Date() }
    })

    // Regla: al devolver, el libro vuelve a disponible: true
    await prisma.libro.update({
      where: { id: prestamo.libroId },
      data: { disponible: true }
    })

    res.json(prestamoActualizado)
  } catch (err) { next(err) }
}

// GET /prestamos - Ver todos los préstamos (solo admin)
export const listarTodosPrestamos = async (req, res, next) => {
  try {
    const prestamos = await prisma.prestamo.findMany()
    res.json(prestamos)
  } catch (err) { next(err) }
}

// GET /prestamos/mis-prestamos - Ver los propios préstamos
export const misPrestamos = async (req, res, next) => {
  try {
    const prestamos = await prisma.prestamo.findMany({
      where: { usuarioId: req.usuario.id }
    })
    res.json(prestamos)
  } catch (err) { next(err) }
}

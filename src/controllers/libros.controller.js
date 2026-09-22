import { prisma } from "../db.js"

// GET /libros - Listar todos los libros (cualquier usuario autenticado)
export const listarLibros = async (req, res, next) => {
  try {
    const libros = await prisma.libro.findMany()
    res.json(libros)
  } catch (err) { next(err) }
}

// POST /libros - Agregar un libro (solo admin)
export const agregarLibro = async (req, res, next) => {
  try {
    const { titulo, autor } = req.body
    const libro = await prisma.libro.create({
      data: { titulo, autor }
    })
    res.status(201).json(libro)
  } catch (err) { next(err) }
}

// DELETE /libros/:id - Eliminar un libro (solo admin)
export const eliminarLibro = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" })
    }

    const libro = await prisma.libro.findUnique({ where: { id } })
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" })

    await prisma.libro.delete({ where: { id } })
    res.json({ mensaje: "Eliminado" })
  } catch (err) { next(err) }
}

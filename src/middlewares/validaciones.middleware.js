export const validarRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son requeridos" })
  }

  next()
}

export const validarLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "email y password son requeridos" })
  }

  next()
}

export const validarLibro = (req, res, next) => {
  const { titulo, autor } = req.body

  if (!titulo || !autor) {
    return res.status(400).json({ error: "titulo y autor son requeridos" })
  }

  next()
}

export const validarPrestamo = (req, res, next) => {
  const { libroId } = req.body

  if (!libroId) {
    return res.status(400).json({ error: "libroId es requerido" })
  }

  next()
}

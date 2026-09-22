<<<<<<< HEAD
# API de Biblioteca — Examen Parcial

API REST para gestión de libros y préstamos. Arquitectura por capas (`controllers` / `routes` / `middlewares`), Express 5 + Prisma 7 (adapter `pg`) + PostgreSQL, autenticación JWT con roles.

## Estructura

```
api-examen/
├── prisma/
│   └── schema.prisma        <- Usuario, Libro, Prestamo
├── prisma7.config.ts
├── src/
│   ├── index.js               <- Express, middlewares globales, rutas, app.listen
│   ├── db.js                   <- instancia de PrismaClient con adapter pg
│   ├── controllers/
│   │   ├── auth.controller.js      <- registro, login
│   │   ├── libros.controller.js    <- listar, agregar, eliminar
│   │   └── prestamos.controller.js <- pedir, devolver, listar, mis-prestamos
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── libros.routes.js
│   │   └── prestamos.routes.js
│   └── middlewares/
│       ├── logger.middleware.js         <- logging global
│       ├── auth.middleware.js            <- verificarToken + soloAdmin
│       └── validaciones.middleware.js    <- validación de campos requeridos, por ruta
├── .env.example
└── package.json
```

## Cómo quedaron aplicadas las reglas de negocio

- **No se puede pedir prestado un libro no disponible** → en `pedirPrestado`, se revisa `libro.disponible` antes de crear el préstamo; si es `false`, responde 400.
- **Al pedir prestado, el libro pasa a `disponible: false`** → justo después de crear el `Prestamo`, se actualiza el `Libro`.
- **Al devolver, `disponible: true` y se registra `fechaFin`** → en `devolverPrestamo`, se actualiza el préstamo con `fechaFin: new Date()` y el libro con `disponible: true`.
- **Un usuario solo puede devolver sus propios préstamos** → se compara `prestamo.usuarioId` contra `req.usuario.id` (viene del JWT); si no coincide, 403.
- **Admin ve todos los préstamos, usuario solo los suyos** → `GET /prestamos` lleva el middleware `soloAdmin`; `GET /prestamos/mis-prestamos` filtra por `usuarioId` del token, sin restricción de rol.

---

# Guía paso a paso

## 1. Requisitos previos
- Node.js 18+
- PostgreSQL corriendo (local o Neon/similar)

## 2. Crear la base de datos
```bash
psql -U postgres -c "CREATE DATABASE biblioteca_db;"
```

## 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Edita `.env`:
```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/biblioteca_db?schema=public"
JWT_SECRET="pon-aqui-una-cadena-larga-y-aleatoria"
PORT=3000
```

## 4. Instalar dependencias
```bash
npm install
```

## 5. Migrar la base de datos
```bash
npx prisma migrate dev --config prisma7.config.ts --name init
```

## 6. Correr el servidor
```bash
npm run dev
```
Debe mostrar `Puerto 3000`.

---

## Checklist de pruebas (en orden, para no perderte)

### 1. Registro y login
- [ ] `POST /auth/registro` con `{"nombre":"Admin","email":"admin@test.com","password":"123456","rol":"admin"}` → 201
- [ ] `POST /auth/registro` con `{"nombre":"Juan","email":"juan@test.com","password":"123456"}` (sin rol → queda "usuario") → 201
- [ ] `POST /auth/login` con el admin → 200 + token (guárdalo como `{{tokenAdmin}}`)
- [ ] `POST /auth/login` con Juan → 200 + token (guárdalo como `{{tokenUsuario}}`)
- [ ] `POST /auth/registro` sin `password` → 400
- [ ] `POST /auth/login` con contraseña incorrecta → 401

### 2. Libros (usa el header `Authorization: Bearer {{token}}`)
- [ ] `GET /libros` sin token → 401
- [ ] `GET /libros` con `{{tokenUsuario}}` → 200 (cualquier usuario puede listar)
- [ ] `POST /libros` con `{{tokenUsuario}}` y `{"titulo":"1984","autor":"Orwell"}` → 403 (no es admin)
- [ ] `POST /libros` con `{{tokenAdmin}}` y el mismo body → 201
- [ ] `DELETE /libros/1` con `{{tokenUsuario}}` → 403
- [ ] `DELETE /libros/1` con `{{tokenAdmin}}` → 200

### 3. Préstamos — crea 2 o 3 libros primero como admin
- [ ] `POST /prestamos` con `{{tokenUsuario}}` y `{"libroId": 2}` → 201, y el libro debe quedar `disponible: false` (verifica con `GET /libros`)
- [ ] `POST /prestamos` con el **mismo** `libroId` de nuevo (otro usuario o el mismo) → 400 "El libro no está disponible"
- [ ] `PUT /prestamos/1/devolver` con un token que **no** es dueño del préstamo → 403
- [ ] `PUT /prestamos/1/devolver` con `{{tokenUsuario}}` (el dueño) → 200, con `fechaFin` ya llena
- [ ] Verifica con `GET /libros` que el libro volvió a `disponible: true`
- [ ] `GET /prestamos` con `{{tokenUsuario}}` → 403 (no es admin)
- [ ] `GET /prestamos` con `{{tokenAdmin}}` → 200, todos los préstamos
- [ ] `GET /prestamos/mis-prestamos` con `{{tokenUsuario}}` → 200, solo los de ese usuario

Toma capturas de cada uno de estos casos en Thunder Client/Postman para tu entrega.
=======
# Aplicada2-Parcial1-OrlandoLora
Repositorio para el Parcial 1
>>>>>>> 3a2c80a394dd6d32f0f9b61699a7d9d7436b2823

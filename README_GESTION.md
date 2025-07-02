# Sistema de Gestión de Pedidos - Backend

Backend desarrollado con NestJS, Prisma y PostgreSQL.

## Características

- **Autenticación**: JWT con registro y login
- **Usuarios**: CRUD completo con roles
- **Categorías**: Gestión de categorías de productos
- **Productos**: CRUD con filtros y búsqueda
- **Pedidos**: Creación, seguimiento y gestión de estados
- **Validaciones**: DTOs con class-validator
- **Base de datos**: PostgreSQL con Prisma ORM

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Editar el archivo `.env` con tu configuración de PostgreSQL:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/gestion_pedidos?schema=public"
JWT_SECRET="tu-clave-secreta-jwt"
JWT_EXPIRES_IN="24h"
PORT=3000
```

3. Configurar la base de datos:
```bash
# Crear y aplicar migraciones
npx prisma migrate dev --name init

# Opcional: Poblar la base de datos con datos de prueba
npx prisma db seed
```

## Desarrollo

```bash
# Modo desarrollo
npm run start:dev

# Construir para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `GET /api/categories/:id` - Obtener categoría por ID
- `PATCH /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto por ID
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Pedidos
- `GET /api/orders` - Listar pedidos del usuario
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:id` - Obtener pedido por ID
- `PATCH /api/orders/:id/status` - Actualizar estado del pedido
- `PATCH /api/orders/:id/cancel` - Cancelar pedido

## Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
├── users/               # Módulo de usuarios
├── categories/          # Módulo de categorías
├── products/            # Módulo de productos
├── orders/              # Módulo de pedidos
├── prisma/              # Configuración de Prisma
├── app.module.ts        # Módulo principal
└── main.ts              # Punto de entrada
```

## Scripts de Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ver base de datos
npx prisma studio

# Resetear base de datos
npx prisma migrate reset
```

# ShipNow API V1

API base para el proyecto ShipNow del curso Backend III. El objetivo de esta pre-entrega es refactorizar la aplicación a una arquitectura profesional por capas y centralizar la configuración de entorno.

## Tecnologias

- Node.js 24.18.0
- Express
- MongoDB
- Mongoose
- Dotenv
- ESLint

## Requisitos Previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- Node.js 24.18.0 o superior
- npm
- Una base de datos MongoDB local o en MongoDB Atlas

## Instalacion

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Entrar a la carpeta del proyecto:

```bash
cd shipNowV1
```

Instalar dependencias:

```bash
npm install
```

## Variables De Entorno

El proyecto utiliza variables de entorno para configurar datos sensibles y valores que pueden cambiar segun el ambiente.

Crear un archivo `.env` en la raiz del proyecto tomando como base el archivo `.env.example`:

```bash
cp .env.example .env
```

Completar las variables necesarias:

```env
PORT=1234
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@clusterdev.xxxxxx.mongodb.net/shipnow?appName=xxxxxx
```

Variables requeridas:

- `PORT`: puerto donde se ejecuta el servidor.
- `NODE_ENV`: ambiente de ejecucion, por ejemplo `development` o `production`.
- `MONGODB_URI`: cadena de conexion a MongoDB.

Si falta una variable requerida, la aplicacion lanza un error descriptivo al iniciar y no continua la ejecucion.

## Scripts Disponibles

Levantar el servidor en modo desarrollo:

```bash
npm run dev
```

Ejecutar ESLint para revisar errores de formato y calidad de codigo:

```bash
npm run lint
```

Ejecutar ESLint y corregir automaticamente los errores que pueda resolver:

```bash
npm run lint:fix
```

## Estructura Del Proyecto

```txt
src/
  config/
    config.js
    db.js
  controllers/
    product.controller.js
    user.controller.js
  models/
    product.model.js
    user.model.js
  repositories/
    product.repository.js
    user.repository.js
  routes/
    product.routes.js
    users.routes.js
  services/
    product.service.js
    user.service.js
  utils/
    constants.js
  index.js
```

## Arquitectura Por Capas

El proyecto se organiza usando una arquitectura de tres capas principales:

### Controller

Es la unica puerta de entrada HTTP. Recibe `req` y `res`, obtiene parametros o datos del body, llama al service correspondiente y devuelve una respuesta con el status code adecuado.

Los controllers no deben importar Mongoose ni conocer detalles de MongoDB.

### Service

Contiene la logica de negocio de la aplicacion. Es la capa encargada de decidir que reglas aplicar antes o despues de consultar datos.

Ejemplos de logica que pertenece al service:

- Validar datos antes de crear o actualizar un producto.
- Decidir si se devuelven solo productos disponibles.
- Aplicar reglas relacionadas con roles de usuario.

### Repository

Es la unica capa que conoce los modelos de Mongoose. Encapsula el acceso a la base de datos y expone metodos para buscar, crear, actualizar o eliminar documentos.

El repository no debe contener logica de negocio. Su responsabilidad es acceder y persistir datos.

## Flujo De Dependencias

El flujo correcto de dependencias es:

```txt
Route -> Controller -> Service -> Repository -> Model
```

Las rutas solo conectan un path con el metodo del controller correspondiente.

## Constantes Del Dominio

Los valores fijos del dominio se centralizan en `src/utils/constants.js`.

Ejemplos:

- Roles de usuario: `ADMIN`, `USER`, `COURIER`.
- Estados de producto: `AVAILABLE`, `OUT_OF_STOCK`.

Esto evita usar strings sueltos en distintas partes del proyecto y reduce errores por valores mal escritos.

## Endpoints Principales

Usuarios:

```txt
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Productos:

```txt
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

Health check:

```txt
GET /health
```

## Estado Actual

El proyecto se encuentra en etapa inicial de refactorizacion para la pre-entrega. La entidad Products ya tiene su estructura base separada en routes, controller, service, repository y model.

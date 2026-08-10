# ShipNow API V1

API base para el proyecto ShipNow del curso Backend III. En esta 4ta pre-entrega se incorpora un sistema de logging profesional con Winston, conectado al manejo de errores y a los puntos relevantes de la aplicacion.

## Tecnologias

- Node.js 24.18.0
- Express
- MongoDB
- Mongoose
- Dotenv
- Winston
- winston-daily-rotate-file
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
    logger.js
  controllers/
    courier.controller.js
    delivery.controller.js
    order.controller.js
    product.controller.js
    user.controller.js
  error/
    custom.error.js
    error-codes.js
    errors.dictionary.js
  middlewares/
    error-handler.middleware.js
  models/
    courier.model.js
    delivery.model.js
    order.model.js
    product.model.js
    user.model.js
  mocks/
    controllers/
      mocks.controllers.js
    repositories/
      mocks.repository.js
    routes/
      mocks.routes.js
    services/
      mocks.services.js
  repositories/
    courier.repository.js
    delivery.repository.js
    order.repository.js
    product.repository.js
    user.repository.js
  routes/
    courier.routes.js
    delivery.routes.js
    logger.routes.js
    order.routes.js
    product.routes.js
    users.routes.js
  services/
    courier.service.js
    delivery.service.js
    order.service.js
    product.service.js
    user.service.js
  utils/
    constants.js
  index.js
```

## Arquitectura Por Capas

El proyecto se organiza usando una arquitectura de tres capas principales:

### Controller

Es la unica puerta de entrada HTTP. Recibe `req` y `res`, obtiene parametros o datos del body, llama al service correspondiente y devuelve una respuesta exitosa con el status code adecuado.

Los controllers no deben importar Mongoose ni conocer detalles de MongoDB. Tampoco deben responder errores de forma aislada; cualquier error se envia al middleware global con `next(error)`.

### Service

Contiene la logica de negocio de la aplicacion. Es la capa encargada de decidir que reglas aplicar antes o despues de consultar datos.

Ejemplos de logica que pertenece al service:

- Validar datos antes de crear o actualizar un producto.
- Decidir si se devuelven solo productos disponibles.
- Aplicar reglas relacionadas con roles de usuario.
- Lanzar errores personalizados del dominio, por ejemplo usuario inexistente, pedido no encontrado o estado invalido.

### Repository

Es la unica capa que conoce los modelos de Mongoose. Encapsula el acceso a la base de datos y expone metodos para buscar, crear, actualizar o eliminar documentos.

El repository no debe contener logica de negocio. Su responsabilidad es acceder y persistir datos.

## Flujo De Dependencias

El flujo correcto de dependencias es:

```txt
Route -> Controller -> Service -> Repository -> Model
```

Las rutas solo conectan un path con el metodo del controller correspondiente.

## Manejo Profesional De Errores

El proyecto centraliza los errores HTTP en una capa comun compuesta por:

- `src/error/error-codes.js`: constantes con los codigos de error del dominio.
- `src/error/errors.dictionary.js`: diccionario que relaciona cada codigo con su status HTTP y mensaje base.
- `src/error/custom.error.js`: clase `CustomError` usada por services y otras capas para representar errores esperados.
- `src/middlewares/error-handler.middleware.js`: middleware global que transforma errores en respuestas HTTP uniformes.

El flujo esperado ante un error es:

```txt
Service o capa correspondiente -> CustomError -> Controller next(error) -> errorHandler -> respuesta HTTP
```

Los errores esperados se detectan principalmente en los services. Los controllers no deciden la respuesta final de error; solo delegan el error al middleware global.

### Estructura De Respuesta De Error

Todos los errores controlados responden con la misma estructura:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo del error"
  }
}
```

Ejemplo para un usuario inexistente:

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Usuario no encontrado."
  }
}
```

### Errores Del Dominio

Algunos codigos de error incluidos:

- `VALIDATION_ERROR`: datos obligatorios faltantes o formato invalido.
- `INVALID_ID`: identificador de MongoDB invalido.
- `USER_NOT_FOUND`: usuario inexistente.
- `PRODUCT_NOT_FOUND`: producto inexistente.
- `INSUFFICIENT_STOCK`: stock insuficiente para crear una orden.
- `ORDER_NOT_FOUND`: pedido inexistente.
- `DELIVERY_NOT_FOUND`: entrega inexistente.
- `DELIVERY_ALREADY_ASSIGNED`: orden ya asignada a una entrega.
- `COURIER_NOT_FOUND`: repartidor inexistente.
- `COURIER_NOT_AVAILABLE`: repartidor no disponible.
- `INVALID_ORDER_STATUS`: estado de pedido invalido.
- `INVALID_DELIVERY_STATUS`: transicion de entrega invalida.
- `INVALID_MOCK_AMOUNT`: cantidad invalida para generar mocks.
- `INVALID_MOCK_TYPE`: tipo o coleccion de mocks invalida.
- `MOCKS_NOT_ALLOWED`: modulo de mocks deshabilitado en produccion.
- `ROUTE_NOT_FOUND`: ruta inexistente.
- `DATABASE_ERROR`: falla durante una operacion con MongoDB.
- `INTERNAL_SERVER_ERROR`: error inesperado.

### Como Probar Errores

Usuario inexistente:

```txt
GET /api/users/64b000000000000000000000
```

ID invalido:

```txt
GET /api/products/id-invalido
```

Producto con datos faltantes:

```txt
POST /api/products
```

Body:

```json
{
  "name": "Producto incompleto"
}
```

Ruta inexistente:

```txt
GET /api/ruta-inexistente
```

Mocks con cantidad negativa:

```txt
GET /api/mocks/users?qty=-1
```

Mocks con cantidad mayor al maximo permitido:

```txt
GET /api/mocks/users?qty=21
```

Mocks con coleccion invalida:

```txt
POST /api/mocks/seed?qty=5&collection=invalid
```

Falla durante carga en MongoDB:

```txt
POST /api/mocks/seed?qty=5
```

Para probar este caso, ejecutar el endpoint sin conexion valida a MongoDB o con `MONGODB_URI` incorrecto. La respuesta se deriva a `DATABASE_ERROR`.

## Constantes Del Dominio

Los valores fijos del dominio se centralizan en `src/utils/constants.js`.

Ejemplos:

- Roles de usuario: `ADMIN`, `USER`, `DRIVER`, `CUSTOMER`, `STORE`.
- Estados de producto: `AVAILABLE`, `OUT_OF_STOCK`.

Esto evita usar strings sueltos en distintas partes del proyecto y reduce errores por valores mal escritos.

## Logging Y Monitoreo Basico

ShipNow usa **Winston** como logger centralizado (`src/config/logger.js`), con rotacion diaria mediante `winston-daily-rotate-file`.

### Niveles De Log

- `debug`
- `http`
- `info`
- `warning`
- `error`
- `fatal`

### Comportamiento Segun Entorno

La configuracion se apoya en `NODE_ENV`:

- `development`: muestra desde `debug` (mas detalle en consola).
- `production`: muestra desde `info` (menos ruido, mas control).

### Persistencia Y Rotacion

Los errores importantes se guardan en la carpeta `logs/` en la raiz del proyecto:

- `logs/error-YYYY-MM-DD.log`: niveles `error` y `fatal`.
- `logs/fatal-YYYY-MM-DD.log`: solo nivel `fatal`.

La rotacion es diaria y conserva archivos por 3 dias (`maxFiles: '3d'`).

La carpeta `logs/` esta en `.gitignore`. Los archivos generados por la aplicacion **no** se suben al repositorio.

### Endpoint De Prueba

Para verificar que todos los niveles funcionan:

```txt
GET /logger-test
```

Ese endpoint escribe un mensaje en cada nivel (`debug`, `http`, `info`, `warning`, `error`, `fatal`). En consola deberias ver todos los niveles activos segun el entorno. En los archivos de `logs/` solo deben aparecer `error` y `fatal`.

### Integracion Con El Manejo De Errores

El middleware global (`error-handler.middleware.js`) registra:

- Errores de negocio / esperados (status 4xx) como `warning`.
- Errores inesperados del servidor como `error`.
- Fallas criticas de base de datos o disponibilidad como `fatal`.

Tambien se registran eventos relevantes como:

- Arranque del servidor.
- Conexion exitosa o fallida a MongoDB.
- Generacion e insercion de mocks.
- Cantidad o coleccion invalida en mocks.
- Creacion, actualizacion, eliminacion y "pedido no encontrado".

## Endpoints Principales

Health check:

```txt
GET /health
```

Prueba del logger:

```txt
GET /logger-test
```

Lectura de recursos:

```txt
GET /api/users
GET /api/users/:id
GET /api/products
GET /api/products/:id
GET /api/orders
GET /api/orders/:id
GET /api/couriers
GET /api/couriers/available
GET /api/couriers/available/:zone
GET /api/couriers/:id
GET /api/deliveries
GET /api/deliveries/:id
```

## Endpoints De Escritura

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| POST | `/api/users` | Crear usuario |
| POST | `/api/products` | Crear producto |
| POST | `/api/orders` | Crear orden |
| POST | `/api/couriers` | Crear repartidor |
| POST | `/api/deliveries/assign` | Asignar una orden a un repartidor |
| POST | `/api/mocks/seed` | Insertar datos mock relacionados en MongoDB |
| POST | `/api/mocks/mock-users` | Generar mocks de usuarios |
| POST | `/api/mocks/mock-products` | Generar mocks de productos |
| POST | `/api/mocks/mock-orders` | Generar mocks de ordenes |
| POST | `/api/mocks/mock-couriers` | Generar mocks de repartidores |
| POST | `/api/mocks/mock-deliveries` | Generar mocks de entregas |
| PATCH | `/api/users/:id` | Actualizar parcialmente un usuario |
| PATCH | `/api/products/:id` | Actualizar parcialmente un producto |
| PATCH | `/api/orders/:id` | Actualizar parcialmente una orden |
| PATCH | `/api/couriers/:id/availability` | Marcar repartidor como disponible |
| PATCH | `/api/couriers/:id/unavailability` | Marcar repartidor como no disponible |
| PUT | `/api/users/:id` | Actualizar usuario |
| PUT | `/api/products/:id` | Actualizar producto |
| PUT | `/api/orders/:id` | Actualizar orden |
| PUT | `/api/couriers/:id` | Actualizar repartidor |
| PUT | `/api/deliveries/:id/status` | Actualizar estado de una entrega |
| DELETE | `/api/users/:id` | Eliminar usuario |
| DELETE | `/api/products/:id` | Eliminar producto |
| DELETE | `/api/orders/:id` | Eliminar orden |
| DELETE | `/api/couriers/:id` | Eliminar repartidor |

## Mocks

El modulo de mocks permite generar datos falsos para usuarios, productos, repartidores, ordenes y entregas. La logica respeta el flujo por capas:

```txt
Route -> Controller -> Service -> Repository -> Model
```

Los endpoints `GET` solo devuelven datos simulados y no guardan nada en MongoDB. Reciben `qty` por query params.

- `qty`: cantidad de registros a generar. Debe ser un numero entero entre `1` y `20` para evitar cargas excesivas en MongoDB.

Usuarios mock:

```txt
GET /api/mocks/users?qty=2
```

Productos mock:

```txt
GET /api/mocks/products?qty=2
```

Repartidores mock:

```txt
GET /api/mocks/couriers?qty=2
```

Ordenes mock:

```txt
GET /api/mocks/orders?qty=2
```

Entregas mock:

```txt
GET /api/mocks/deliveries?qty=2
```

Escenario completo en memoria:

```txt
GET /api/mocks/scenario?qty=2
```

Ejemplo de usuarios mock:

```json
[
  {
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana.perez@mock.shipnow.test",
    "password": "123456",
    "role": "customer"
  },
  {
    "first_name": "Luis",
    "last_name": "Gomez",
    "email": "luis.gomez@mock.shipnow.test",
    "password": "123456",
    "role": "driver"
  }
]
```

### Carga De Datos De Prueba

El endpoint de seed inserta registros en MongoDB de forma controlada:

```txt
POST /api/mocks/seed?qty=10
```

Respuesta esperada:

```json
{
  "insertados": 60,
  "coleccion": "escenario_completo",
  "detalle": {
    "usuarios": 20,
    "productos": 10,
    "repartidores": 10,
    "ordenes": 10,
    "entregas": 10
  }
}
```

Por defecto crea un escenario completo con:

- Usuarios con roles validos usando `USER_ROLES`.
- Productos disponibles para poder armar pedidos.
- Repartidores con estados validos usando `COURIER_STATUS`.
- Ordenes con `customerId` real, productos reales, prioridad desde `DELIVERY_PRIORITY` y estado desde `ORDER_STATUS`.
- Entregas asociadas a ordenes y repartidores reales.

Tambien se puede cargar una coleccion especifica:

```txt
POST /api/mocks/seed?qty=10&collection=users
POST /api/mocks/seed?qty=10&collection=products
POST /api/mocks/seed?qty=10&collection=couriers
POST /api/mocks/seed?qty=10&collection=orders
POST /api/mocks/seed?qty=10&collection=deliveries
```

Valores permitidos para `collection`: `all`, `users`, `products`, `couriers`, `orders`, `deliveries`.

Para mantener compatibilidad con la version anterior, tambien existen estos endpoints `POST`:

```txt
POST /api/mocks/mock-users
POST /api/mocks/mock-products
POST /api/mocks/mock-orders
POST /api/mocks/mock-couriers
POST /api/mocks/mock-deliveries
```

Estos endpoints reciben body:

```json
{
  "count": 10,
  "saveToDatabase": false
}
```

Si `saveToDatabase` es `true`, guardan los datos en MongoDB usando la misma logica controlada del seed.

## Estado Actual

El proyecto se encuentra en la cuarta pre-entrega del modulo 4, enfocada en logging y monitoreo basico con Winston.

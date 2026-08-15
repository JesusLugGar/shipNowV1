import swaggerJSDoc from "swagger-jsdoc";

import { config } from "../config/config.js";
import {
  USER_ROLES,
  STATUS_PRODUCTS,
  ORDER_STATUS,
  DELIVERY_PRIORITY,
  COURIER_STATUS,
} from "../utils/constants.js";

const mongoIdExample = "64a1f2e4c3b2a1d5e6f7g8h9";

const schemas = {
  Error: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      error: {
        type: "object",
        properties: {
          code: { type: "string", example: "USER_NOT_FOUND" },
          message: { type: "string", example: "Usuario no encontrado." },
        },
      },
    },
  },
  Success: {
    type: "object",
    description: "Respuesta exitosa de operaciones que no devuelven la entidad (DELETE)",
    properties: {
      message: { type: "string", example: "Usuario borrado con éxito" },
    },
  },
  User: {
    type: "object",
    description: "El password no se incluye en las respuestas (select: false)",
    properties: {
      _id: { type: "string", example: mongoIdExample },
      first_name: { type: "string", example: "John" },
      last_name: { type: "string", example: "Doe" },
      email: { type: "string", example: "john.doe@example.com" },
      role: { type: "string", enum: Object.values(USER_ROLES), example: "customer" },
    },
  },
  CreateUserRequest: {
    type: "object",
    required: ["first_name", "last_name", "email", "password"],
    properties: {
      first_name: { type: "string", example: "John" },
      last_name: { type: "string", example: "Doe" },
      email: { type: "string", example: "john.doe@example.com" },
      password: { type: "string", example: "securePassword123" },
      role: { type: "string", enum: Object.values(USER_ROLES), example: "customer" },
    },
  },
  PatchUserRequest: {
    type: "object",
    properties: {
      first_name: { type: "string", example: "John" },
      last_name: { type: "string", example: "Doe" },
      email: { type: "string", example: "john.doe@example.com" },
      password: { type: "string", example: "securePassword123" },
      role: { type: "string", enum: Object.values(USER_ROLES), example: "customer" },
    },
  },
  Product: {
    type: "object",
    properties: {
      _id: { type: "string", example: mongoIdExample },
      name: { type: "string", example: "Café de grano" },
      description: { type: "string", example: "Café tostado 1kg" },
      price: { type: "integer", example: 12500 },
      stock: { type: "integer", example: 20 },
      status: { type: "string", enum: Object.values(STATUS_PRODUCTS), example: "available" },
    },
  },
  CreateProductRequest: {
    type: "object",
    required: ["name", "description", "price", "stock"],
    properties: {
      name: { type: "string", example: "Café de grano" },
      description: { type: "string", example: "Café tostado 1kg" },
      price: { type: "integer", description: "Entero mayor a 0, en pesos chilenos", example: 12500 },
      stock: { type: "integer", description: "Número mayor a 0 al crear", example: 20 },
    },
  },
  PatchProductRequest: {
    type: "object",
    properties: {
      name: { type: "string", example: "Café de grano" },
      description: { type: "string", example: "Café tostado 1kg" },
      price: { type: "integer", example: 12500 },
      stock: { type: "integer", example: 20 },
      status: { type: "string", enum: Object.values(STATUS_PRODUCTS), example: "available" },
    },
  },
  OrderItem: {
    type: "object",
    properties: {
      productId: { type: "string", example: mongoIdExample },
      quantity: { type: "integer", example: 2 },
      price: { type: "integer", description: "Precio snapshot al crear la orden", example: 12500 },
    },
  },
  CreateOrderItem: {
    type: "object",
    required: ["productId", "quantity"],
    properties: {
      productId: { type: "string", example: mongoIdExample },
      quantity: { type: "integer", minimum: 1, example: 2 },
    },
  },
  Order: {
    type: "object",
    properties: {
      _id: { type: "string", example: mongoIdExample },
      customerName: { type: "string", example: "John Doe" },
      customerId: { type: "string", example: mongoIdExample },
      address: { type: "string", example: "Av. Providencia 1234" },
      costDelivery: { type: "integer", example: 3500 },
      status: { type: "string", enum: Object.values(ORDER_STATUS), example: "created" },
      priority: { type: "string", enum: Object.values(DELIVERY_PRIORITY), example: "medium" },
      products: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
      courier: { type: "string", nullable: true, example: null },
      totalCost: { type: "integer", example: 28500 },
    },
  },
  CreateOrderRequest: {
    type: "object",
    required: ["customerId", "address", "priority", "products"],
    properties: {
      customerId: { type: "string", example: mongoIdExample },
      address: { type: "string", example: "Av. Providencia 1234" },
      priority: { type: "string", enum: Object.values(DELIVERY_PRIORITY), example: "medium" },
      products: { type: "array", items: { $ref: "#/components/schemas/CreateOrderItem" } },
    },
  },
  PatchOrderRequest: {
    type: "object",
    properties: {
      address: { type: "string", example: "Av. Providencia 1234" },
      status: { type: "string", enum: Object.values(ORDER_STATUS), example: "cancelled" },
      priority: { type: "string", enum: Object.values(DELIVERY_PRIORITY), example: "high" },
    },
  },
  Courier: {
    type: "object",
    properties: {
      _id: { type: "string", example: mongoIdExample },
      nameCourier: { type: "string", example: "Pedro Soto" },
      zone: { type: "string", example: "Santiago" },
      availableStatus: { type: "string", enum: Object.values(COURIER_STATUS), example: "available" },
    },
  },
  CreateCourierRequest: {
    type: "object",
    required: ["nameCourier", "zone"],
    properties: {
      nameCourier: { type: "string", example: "Pedro Soto" },
      zone: { type: "string", example: "Santiago" },
    },
  },
  PatchCourierRequest: {
    type: "object",
    properties: {
      nameCourier: { type: "string", example: "Pedro Soto" },
      zone: { type: "string", example: "Santiago" },
      availableStatus: { type: "string", enum: Object.values(COURIER_STATUS), example: "available" },
    },
  },
  Delivery: {
    type: "object",
    properties: {
      _id: { type: "string", example: mongoIdExample },
      orderId: { type: "string", example: mongoIdExample },
      courierId: { type: "string", example: mongoIdExample },
      status: { type: "string", enum: Object.values(ORDER_STATUS), example: "assigned" },
      assignedAt: { type: "string", format: "date-time" },
      startedAt: { type: "string", format: "date-time", nullable: true },
      deliveredAt: { type: "string", format: "date-time", nullable: true },
      cancelledAt: { type: "string", format: "date-time", nullable: true },
    },
  },
  AssignDeliveryRequest: {
    type: "object",
    required: ["orderId", "courierId"],
    properties: {
      orderId: { type: "string", example: mongoIdExample },
      courierId: { type: "string", example: mongoIdExample },
    },
  },
  UpdateDeliveryStatusRequest: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: Object.values(ORDER_STATUS),
        description: "assigned → in_transit|cancelled. in_transit → delivered|cancelled",
        example: "in_transit",
      },
    },
  },
  MockUser: {
    type: "object",
    description: "Usuario mock en memoria. Puede incluir password y a veces _id",
    properties: {
      _id: { type: "string", example: mongoIdExample },
      first_name: { type: "string", example: "Ana" },
      last_name: { type: "string", example: "Pérez" },
      email: { type: "string", example: "ana@mock.shipnow.test" },
      password: { type: "string", example: "123456" },
      role: { type: "string", enum: Object.values(USER_ROLES), example: "customer" },
    },
  },
  MockGenerateRequest: {
    type: "object",
    properties: {
      count: { type: "integer", minimum: 1, maximum: 20, example: 10 },
      qty: { type: "integer", minimum: 1, maximum: 20, example: 10 },
      saveToDatabase: { type: "boolean", example: false },
    },
  },
  MockSeedRequest: {
    type: "object",
    properties: {
      count: { type: "integer", minimum: 1, maximum: 20, example: 10 },
      collection: {
        type: "string",
        enum: ["all", "users", "products", "couriers", "orders", "deliveries"],
        example: "all",
      },
    },
  },
  MockSeedResult: {
    type: "object",
    properties: {
      insertados: { type: "integer", example: 10 },
      coleccion: { type: "string", example: "usuarios" },
    },
    additionalProperties: true,
  },
  MockScenario: {
    type: "object",
    properties: {
      users: { type: "array", items: { $ref: "#/components/schemas/MockUser" } },
      products: { type: "array", items: { $ref: "#/components/schemas/Product" } },
      couriers: { type: "array", items: { $ref: "#/components/schemas/Courier" } },
      orders: { type: "array", items: { $ref: "#/components/schemas/Order" } },
      deliveries: { type: "array", items: { $ref: "#/components/schemas/Delivery" } },
    },
  },
  MockOrdersMemory: {
    type: "object",
    properties: {
      orders: { type: "array", items: { $ref: "#/components/schemas/Order" } },
      relaciones: {
        type: "object",
        properties: {
          usuarios: { type: "array", items: { $ref: "#/components/schemas/MockUser" } },
          productos: { type: "array", items: { $ref: "#/components/schemas/Product" } },
        },
      },
    },
  },
  MockDeliveriesMemory: {
    type: "object",
    properties: {
      deliveries: { type: "array", items: { $ref: "#/components/schemas/Delivery" } },
      relaciones: {
        type: "object",
        properties: {
          ordenes: { type: "array", items: { $ref: "#/components/schemas/Order" } },
          repartidores: { type: "array", items: { $ref: "#/components/schemas/Courier" } },
        },
      },
    },
  },
};

const errorContent = (code, message) => ({
  description: message,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
      example: {
        success: false,
        error: { code, message },
      },
    },
  },
});

const responses = {
  ValidationError: errorContent("VALIDATION_ERROR", "Error de validación."),
  InvalidId: errorContent("INVALID_ID", "ID inválido."),
  NotFound: errorContent("USER_NOT_FOUND", "Recurso no encontrado."),
  Conflict: errorContent("EMAIL_DUPLICATE", "Conflicto con el estado actual del recurso."),
  Forbidden: errorContent("MOCKS_NOT_ALLOWED", "Simulaciones no permitidas en este entorno."),
  InvalidMockAmount: errorContent(
    "INVALID_MOCK_AMOUNT",
    "El campo count debe ser un número entero entre 1 y 20",
  ),
  InvalidOrderStatus: errorContent(
    "INVALID_ORDER_STATUS",
    "La orden no está en estado creado y no puede ser asignada a un repartidor.",
  ),
  InvalidDeliveryStatus: errorContent(
    "INVALID_DELIVERY_STATUS",
    "Transición de estado no permitida.",
  ),
  InternalServerError: errorContent("INTERNAL_SERVER_ERROR", "Error interno del servidor."),
};

const parameters = {
  MongoId: {
    name: "id",
    in: "path",
    required: true,
    description: "MongoDB ObjectId",
    schema: { type: "string", example: mongoIdExample },
  },
  Zone: {
    name: "zone",
    in: "path",
    required: true,
    description: "Zona del repartidor (string, no es un ObjectId)",
    schema: { type: "string", example: "Santiago" },
  },
  MockCount: {
    name: "count",
    in: "query",
    required: false,
    description: "Cantidad a generar. Entero entre 1 y 20. Default 10. También se acepta qty",
    schema: { type: "integer", minimum: 1, maximum: 20, default: 10 },
  },
  MockQty: {
    name: "qty",
    in: "query",
    required: false,
    description: "Alias de count",
    schema: { type: "integer", minimum: 1, maximum: 20 },
  },
  SaveToDatabase: {
    name: "saveToDatabase",
    in: "query",
    required: false,
    description: "Si es true, inserta en MongoDB y responde 201",
    schema: { type: "boolean", default: false },
  },
  SeedCollection: {
    name: "collection",
    in: "query",
    required: false,
    schema: {
      type: "string",
      enum: ["all", "users", "products", "couriers", "orders", "deliveries"],
      default: "all",
    },
  },
};

const swaggerDefinition = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShipNow API",
      version: "1.4.0",
      description:
        "API REST de ShipNow para gestionar usuarios, pedidos y entregas. Documentación interactiva de los módulos principales.",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT ?? 3000}`,
        description: "Servidor de desarrollo",
      },
    ],
    tags: [
      { name: "Health", description: "Health check" },
      { name: "Logger", description: "Herramienta de validación de Winston. No es funcionalidad de negocio" },
      { name: "Users", description: "Usuarios" },
      { name: "Products", description: "Productos" },
      { name: "Orders", description: "Pedidos" },
      { name: "Couriers", description: "Repartidores" },
      { name: "Deliveries", description: "Entregas" },
      { name: "Mocks", description: "Datos de prueba (no disponible en production)" },
    ],
    components: {
      schemas,
      responses,
      parameters,
    },
  },
  apis: ["./src/docs/**/*.yaml"],
});

export default swaggerDefinition;
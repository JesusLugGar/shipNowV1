import { ERROR_CODES } from './error-codes.js';

export const errorDictionary = {
    [ERROR_CODES.VALIDATION_ERROR]: {
        status: 400,
        message: 'Error de validación.',
    },
    [ERROR_CODES.INVALID_ID]: {
        status: 400,
        message: 'ID inválido.',
    },
    [ERROR_CODES.USER_NOT_FOUND]: {
        status: 404,
        message: 'Usuario no encontrado.',
    },
    [ERROR_CODES.EMAIL_DUPLICATE]: {
        status: 409,
        message: 'El correo electrónico ya está en uso.',
    },
    [ERROR_CODES.PRODUCT_NOT_FOUND]: {
        status: 404,
        message: 'Producto no encontrado.',
    },
    [ERROR_CODES.INSUFFICIENT_STOCK]: {
        status: 409,
        message: 'Stock insuficiente para completar la operación.',
    },
    [ERROR_CODES.ORDER_NOT_FOUND]: {
        status: 404,
        message: 'Pedido no encontrado.',
    },
    [ERROR_CODES.DELIVERY_NOT_FOUND]: {
        status: 404,
        message: 'Entrega no encontrada.',
    },
    [ERROR_CODES.DELIVERY_ALREADY_ASSIGNED]: {
        status: 409,
        message: 'Ya existe una entrega asignada a esta orden.',
    },
    [ERROR_CODES.COURIER_NOT_FOUND]: {
        status: 404,
        message: 'Courier no encontrado.',
    },
    [ERROR_CODES.COURIER_ALREADY_EXISTS]: {
        status: 409,
        message: 'El Courier ya existe.',
    },
    [ERROR_CODES.COURIER_ALREADY_ASSIGNED]: {
        status: 409,
        message: 'El Courier ya está asignado a otro pedido.',
    },
    [ERROR_CODES.COURIER_ALREADY_AVAILABLE]: {
        status: 409,
        message: 'El Courier ya está marcado como disponible.',
    },
    [ERROR_CODES.COURIER_ALREADY_UNAVAILABLE]: {
        status: 409,
        message: 'El Courier ya está marcado como no disponible.',
    },
    [ERROR_CODES.COURIER_NOT_AVAILABLE]: {
        status: 409,
        message: 'El Courier no está disponible.',
    },
    [ERROR_CODES.INVALID_ORDER_STATUS]: {
        status: 400,
        message: 'Estado de pedido inválido.',
    },
    [ERROR_CODES.INVALID_DELIVERY_STATUS]: {
        status: 400,
        message: 'Estado de entrega inválido.',
    },
    [ERROR_CODES.INVALID_MOCK_AMOUNT]: {
        status: 400,
        message: 'Cantidad de simulación inválida.',
    },
    [ERROR_CODES.INVALID_MOCK_TYPE]: {
        status: 400,
        message: 'Tipo de simulación inválido.',
    },
    [ERROR_CODES.MOCKS_NOT_ALLOWED]: {
        status: 403,
        message: 'Simulaciones no permitidas en este entorno.',
    },
    [ERROR_CODES.ROUTE_NOT_FOUND]: {
        status: 404,
        message: 'Ruta solicitada no encontrada.',
    },
    [ERROR_CODES.FORBIDDEN]: {
        status: 403,
        message: 'Acceso prohibido.',
    },
    [ERROR_CODES.DATABASE_ERROR]: {
        status: 500,
        message: 'Error de base de datos.',
    },
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
        status: 500,
        message: 'Error interno del servidor.',
    },
    [ERROR_CODES.SERVICE_UNAVAILABLE]: {
        status: 503,
        message: 'Servicio no disponible.',
    },
};
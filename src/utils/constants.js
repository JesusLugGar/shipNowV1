export const USER_ROLES = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    DRIVER: 'driver',
    CUSTOMER: 'customer',
    STORE: 'store'
});

export const STATUS_PRODUCTS = Object.freeze ({
    AVAILABLE: 'available',
    OUT_OF_STOCK: 'out_of_stock'
}); 

export const ORDER_STATUS = Object.freeze({
    CREATED: 'created',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});

export const DELIVERY_PRIORITY = Object.freeze({
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
});

export const COURIER_STATUS = Object.freeze({
    AVAILABLE: 'available',
    UNAVAILABLE: 'unavailable'
});
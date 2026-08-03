import mongoose from 'mongoose';

import { ERROR_CODES } from '../error/error-codes.js';
import { errorDictionary } from '../error/errors.dictionary.js';
import CustomError from '../error/custom.error.js';

const resolveError = (error) => {
    if (error instanceof CustomError) {
        return error;
    }

    if (error instanceof mongoose.Error.CastError) {
        return new CustomError(ERROR_CODES.INVALID_ID);
    }

    if (error instanceof mongoose.Error.ValidationError) {
        return new CustomError(ERROR_CODES.VALIDATION_ERROR, error.message);
    }

    if (error?.code === 11000 && error?.keyPattern?.email) {
        return new CustomError(ERROR_CODES.EMAIL_DUPLICATE);
    }

    if (error?.code === 11000) {
        return new CustomError(ERROR_CODES.VALIDATION_ERROR, 'El registro ya existe.');
    }

    if (error instanceof mongoose.Error || error?.name?.startsWith('Mongo')) {
        return new CustomError(ERROR_CODES.DATABASE_ERROR);
    }

    return new CustomError(ERROR_CODES.INTERNAL_SERVER_ERROR);
};

export function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    const resolvedError = resolveError(error);
    const dictionaryError = errorDictionary[resolvedError.code] ?? errorDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR];
    const status = resolvedError.status ?? dictionaryError.status;

    console.error(`[${resolvedError.code}] ${resolvedError.message}`, {
        method: req.method,
        path: req.originalUrl,
    });

    res.status(status).json({
        success: false,
        error: {
            code: resolvedError.code,
            message: resolvedError.message ?? dictionaryError.message,
        },
    });
}
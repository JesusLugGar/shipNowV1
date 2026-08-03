import { errorDictionary } from './errors.dictionary.js';
import { ERROR_CODES } from './error-codes.js';

class CustomError extends Error {
    constructor(errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR, customMessage) {
        const resolvedCode = Object.hasOwn(errorDictionary, errorCode) ? errorCode : ERROR_CODES.INTERNAL_SERVER_ERROR;
        const errorInfo = errorDictionary[resolvedCode];

        super(customMessage ?? errorInfo.message);

        this.name = 'CustomError';
        this.code = resolvedCode;
        this.status = errorInfo.status;

        Error.captureStackTrace?.(this, this.constructor);
    }
}

export default CustomError;
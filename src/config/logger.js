import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { config } from '../config/config.js';


const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red bold',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};

winston.addColors(customLevels.colors);

const logFormatConsole = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level}]: ${stack ?? message}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),   
    winston.format.json()
);

const isDevelopment = config.NODE_ENV === 'development';

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: isDevelopment ? 'debug' : 'info',
    transports: [
        new winston.transports.Console({
            format: logFormatConsole,
        }),
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '3d',
            format: fileFormat,

        }),
        new DailyRotateFile({
            filename: 'logs/fatal-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'fatal',
            maxFiles: '3d',
            format: fileFormat, 
        })
    ],

});

export default logger;
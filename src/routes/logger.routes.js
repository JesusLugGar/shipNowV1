import express from 'express';

import logger from '../config/logger.js';

const router = express.Router();

router.get('/logger-test', (req, res) => {
    logger.debug('Debug level log');
    logger.http('HTTP level log');
    logger.info('Info level log');
    logger.warning('Warning level log');
    logger.error('Error level log');
    logger.fatal('Fatal level log');

    res.send('Logger test Completado! Revisar los logs.');
});

export default router;
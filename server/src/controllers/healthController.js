const healthService = require('../services/healthService');

/**
 * GET /health
 *
 * Answers 503 with the reason when the database is unreachable. This one
 * endpoint reports its own failure instead of handing it to the error
 * middleware: saying what is wrong is the whole point of a health check, and
 * the body is what the container healthcheck and any uptime monitor read.
 */
async function check(req, res) {
    const { healthy, error } = await healthService.check();

    if (healthy) {
        return res.json({ status: 'ok', database: 'connected' });
    }

    console.error('[health] database check failed ->', error);

    res.status(503).json({
        status: 'error',
        database: 'disconnected',
        error: error.message,
    });
}

module.exports = { check };

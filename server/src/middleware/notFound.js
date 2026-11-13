const AppError = require('../utils/AppError');

/**
 * Catches requests that matched no route and turns them into a JSON 404,
 * so clients get the same content type from a bad path as from everything
 * else. Registered after all routers and before the error handler.
 */
function notFound(req, res, next) {
    next(new AppError('Not found', 404));
}

module.exports = notFound;

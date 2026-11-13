const AppError = require('../utils/AppError');

/**
 * The single place errors become responses.
 *
 * A client error (an AppError below 500) sends its own message, because that
 * message was written to be read by the caller. Anything else -- an unexpected
 * throw, a driver error, a bug -- is logged in full on the server and answered
 * with a generic message, so SQL text, column names and stack traces never
 * reach a client.
 *
 * Express recognises an error handler by its arity, so all four parameters
 * must stay in the signature.
 */
function errorHandler(err, req, res, next) {
    const isAppError = err instanceof AppError;
    const status = isAppError ? err.statusCode : 500;
    const exposeMessage = isAppError && err.expose && status < 500;

    if (!exposeMessage) {
        // Everything the operator needs, and nothing the client will see.
        console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);
    }

    // Once the response has started there is no way to change the status, so
    // hand off to Express, which will abort the connection.
    if (res.headersSent) {
        return next(err);
    }

    res.status(status).json({
        error: exposeMessage ? err.message : 'Internal server error',
    });
}

module.exports = errorHandler;

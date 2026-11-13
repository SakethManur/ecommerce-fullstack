/**
 * An error carrying the HTTP status it should produce.
 *
 * `expose` decides whether the message is safe to send to the client. It
 * defaults to true for 4xx (the message is a deliberate explanation, such as
 * "Invalid credentials") and false for 5xx (the message is likely to contain
 * SQL or schema detail).
 */
class AppError extends Error {
    /**
     * @param {string}  message
     * @param {number}  [statusCode=500]
     * @param {Object}  [options]
     * @param {boolean} [options.expose] Override the default exposure rule.
     * @param {Error}   [options.cause]  The underlying error, kept for logging.
     */
    constructor(message, statusCode = 500, options = {}) {
        super(message);

        this.name = 'AppError';
        this.statusCode = statusCode;
        this.expose = options.expose !== undefined
            ? options.expose
            : statusCode < 500;

        if (options.cause) this.cause = options.cause;

        // Keep this constructor out of the reported stack.
        if (Error.captureStackTrace) Error.captureStackTrace(this, AppError);
    }

    /** @param {string} message */
    static badRequest(message) {
        return new AppError(message, 400);
    }

    /** @param {string} message */
    static unauthorized(message) {
        return new AppError(message, 401);
    }

    /** @param {string} message */
    static notFound(message) {
        return new AppError(message, 404);
    }
}

module.exports = AppError;

const path = require('path');

// The one and only dotenv call in this codebase. The path is resolved from
// __dirname rather than the process cwd, so server/.env is found whether the
// app is started from server/, from the repo root, or by a process manager.
// In a container there is no .env at all and this is a no-op -- the real
// values come from the environment.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Reads an integer environment variable.
 *
 * An unset variable falls back to the documented default. A variable that is
 * set but unusable throws, so a typo in a deployment's configuration fails
 * loudly at boot instead of surfacing as a confusing error on first query.
 *
 * @param {string} name
 * @param {number} fallback
 * @returns {number}
 */
function readInt(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined || raw.trim() === '') return fallback;

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(
            `Invalid ${name}: expected a positive integer, received "${raw}"`
        );
    }
    return parsed;
}

/**
 * Reads a comma-separated list. Returns null when unset, which callers read
 * as "not configured" rather than "empty list".
 *
 * @param {string} name
 * @returns {string[]|null}
 */
function readList(name) {
    const raw = process.env[name];
    if (!raw || raw.trim() === '') return null;

    const items = raw.split(',').map((item) => item.trim()).filter(Boolean);
    return items.length > 0 ? items : null;
}

/**
 * @typedef {Object} DbConfig
 * @property {string} host
 * @property {string} user
 * @property {string} password
 * @property {string} database
 * @property {number} port
 * @property {number} connectionLimit
 */

/**
 * @typedef {Object} Config
 * @property {string}        env          NODE_ENV, defaulting to development.
 * @property {number}        port         Port the HTTP server listens on.
 * @property {string[]|null} corsOrigins  Allowed origins; null means any.
 * @property {DbConfig}      db
 */

/** @type {Config} */
const config = Object.freeze({
    env: process.env.NODE_ENV || 'development',
    port: readInt('PORT', 5001),

    // null means CORS_ORIGIN was not configured, in which case any origin is
    // allowed -- the behaviour before this was configurable. Deployed clients
    // therefore keep working until the variable is set deliberately.
    corsOrigins: readList('CORS_ORIGIN'),

    db: Object.freeze({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ecommerce_db',
        port: readInt('DB_PORT', 3306),
        connectionLimit: readInt('DB_POOL_SIZE', 10),
    }),
});

module.exports = config;

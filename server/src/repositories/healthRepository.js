const { db } = require('../config/db');

/**
 * The cheapest query that proves the pool can reach the database and get a
 * reply. Throws if it cannot.
 *
 * @returns {Promise<void>}
 */
async function ping() {
    await db.query('SELECT 1');
}

module.exports = { ping };

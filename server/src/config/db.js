const mysql = require('mysql2');
const config = require('./index');

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    queueLimit: 0,

    // Required by the hosted databases this app is deployed against (TiDB,
    // PlanetScale), whose certificates are not in Node's trust store. Local
    // MySQL in Docker serves a self-signed certificate and is also fine with
    // this.
    ssl: {
        rejectUnauthorized: false,
    },
});

// The promise-based wrapper is what every repository uses.
const db = pool.promise();

/**
 * Takes a connection and immediately returns it, so startup can report
 * whether the database is reachable. Previously this ran as a side effect of
 * requiring the db module; it is now explicit, which keeps importing the app
 * (in a test, say) from opening sockets.
 *
 * @returns {Promise<void>} Rejects when the database cannot be reached.
 */
async function verifyConnection() {
    const connection = await db.getConnection();
    connection.release();
}

/**
 * Drains the pool so the process can exit cleanly on shutdown.
 *
 * @returns {Promise<void>}
 */
async function closePool() {
    await db.end();
}

module.exports = { db, verifyConnection, closePool };

const config = require('./config');
const app = require('./app');
const { verifyConnection, closePool } = require('./config/db');

// How long to let in-flight requests finish before giving up on a clean exit.
const SHUTDOWN_TIMEOUT_MS = 10000;

const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);

    // Reported but not fatal: the API still starts, and /health is what says
    // whether it can serve. Keeps a brief database outage from crash-looping
    // the container.
    verifyConnection()
        .then(() => console.log('✅ Connected to Database successfully!'))
        .catch((err) => console.error('❌ Database Connection Failed:', err.message));
});

let shuttingDown = false;

/**
 * Stops accepting connections, lets open requests finish, drains the database
 * pool, then exits. A second signal is ignored rather than cutting the first
 * shutdown short.
 *
 * @param {string} signal
 */
async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`${signal} received, shutting down gracefully...`);

    // Backstop: if a connection will not drain, exit anyway rather than wait
    // for the orchestrator's SIGKILL.
    const forceExit = setTimeout(() => {
        console.error('Shutdown timed out, exiting immediately.');
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    try {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
        console.log('HTTP server closed.');

        await closePool();
        console.log('Database pool closed.');

        clearTimeout(forceExit);
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
}

// SIGTERM is what Docker and Render send; SIGINT is Ctrl-C in development.
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

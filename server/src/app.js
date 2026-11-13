const express = require('express');
const cors = require('cors');

const config = require('./config');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
    // '*' is what cors() sent before the origin was configurable, so an
    // unset CORS_ORIGIN leaves the response headers exactly as they were and
    // deployed clients keep working.
    origin: config.corsOrigins === null ? '*' : config.corsOrigins,
}));

// Replaces body-parser, which express.json() has superseded.
app.use(express.json());

app.use(routes);

// Order matters: anything that matched no route becomes a 404, and the error
// handler must be registered last so every throw above reaches it.
app.use(notFound);
app.use(errorHandler);

// Exported without listening, so a test can import the app and drive it
// in-process. Binding a port and shutting down cleanly are server.js's job.
module.exports = app;

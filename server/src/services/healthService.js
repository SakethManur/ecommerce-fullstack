const healthRepository = require('../repositories/healthRepository');

/**
 * Reports whether the database answers.
 *
 * Returns a result rather than throwing, because a failed check is this
 * endpoint's normal output, not an error: its whole job is to say which way
 * things are.
 *
 * @returns {Promise<{healthy: boolean, error?: Error}>}
 */
async function check() {
    try {
        await healthRepository.ping();
        return { healthy: true };
    } catch (err) {
        return { healthy: false, error: err };
    }
}

module.exports = { check };

const accountsRepository = require('../repositories/accountsRepository');
const AppError = require('../utils/AppError');

/**
 * Registers an account.
 *
 * A duplicate email is the expected failure here and is reported as a 400 with
 * the message this endpoint has always returned. Anything else -- the database
 * being unreachable, for instance -- is left to propagate, so an outage is no
 * longer misreported to the caller as "account already exists".
 *
 * @param {Object} input
 * @returns {Promise<{success: boolean, userId: number}>}
 * @throws {AppError} 400 when the email is already registered.
 */
async function register({ firstName, lastName, email, password }) {
    try {
        const userId = await accountsRepository.insert({
            firstName,
            lastName,
            email,
            password,
        });
        return { success: true, userId };
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new AppError('Account likely already exists', 400, { cause: err });
        }
        throw err;
    }
}

/**
 * Verifies credentials and returns the signed-in account.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 * @throws {AppError} 401 when no account matches.
 */
async function login(email, password) {
    const user = await accountsRepository.findByCredentials(email, password);

    if (!user) {
        throw AppError.unauthorized('Invalid credentials');
    }

    return {
        success: true,
        userId: user.id,
        role: user.role,
        user,
    };
}

module.exports = { register, login };

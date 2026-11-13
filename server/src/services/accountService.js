const accountsRepository = require('../repositories/accountsRepository');
const AppError = require('../utils/AppError');

/**
 * Updates whichever of phone and address were supplied, leaving the other
 * untouched -- the client sends one field at a time.
 *
 * @param {Object} input
 * @returns {Promise<void>}
 * @throws {AppError} 400 when userId is missing.
 */
async function update({ userId, phone, address }) {
    if (!userId) {
        throw AppError.badRequest('Missing User ID');
    }

    if (phone) {
        await accountsRepository.updatePhone(userId, phone);
    }
    if (address) {
        await accountsRepository.updateAddress(userId, address);
    }
}

module.exports = { update };

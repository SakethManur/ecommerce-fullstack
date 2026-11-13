const { db } = require('../config/db');

/**
 * Creates an account. The role is fixed to 'user': the API has never let a
 * caller choose its own role, and an admin is only ever seeded directly.
 *
 * @param {Object} account
 * @returns {Promise<number>} The new account's id.
 */
async function insert({ firstName, lastName, email, password }) {
    const [result] = await db.query(
        'INSERT INTO accounts (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, "user")',
        [firstName, lastName, email, password]
    );
    return result.insertId;
}

/**
 * Looks up an account by email and password.
 *
 * NOTE: the comparison is on the stored plaintext password, which is how this
 * application has always worked. Hashing is a separate change that has to move
 * the existing rows too.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object|undefined>}
 */
async function findByCredentials(email, password) {
    const [rows] = await db.query(
        'SELECT * FROM accounts WHERE email = ? AND password = ?',
        [email, password]
    );
    return rows[0];
}

/**
 * @param {string|number} userId
 * @param {string} phone
 * @returns {Promise<void>}
 */
async function updatePhone(userId, phone) {
    await db.query('UPDATE accounts SET phone = ? WHERE id = ?', [phone, userId]);
}

/**
 * @param {string|number} userId
 * @param {string} address
 * @returns {Promise<void>}
 */
async function updateAddress(userId, address) {
    await db.query('UPDATE accounts SET address = ? WHERE id = ?', [address, userId]);
}

module.exports = { insert, findByCredentials, updatePhone, updateAddress };

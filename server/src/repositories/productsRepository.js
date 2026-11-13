const { db } = require('../config/db');

// Maps the API's sort keys to SQL. Anything not listed here adds no ORDER BY,
// which is what the original inline chain of if/else did.
const SORT_CLAUSES = {
    price_low: ' ORDER BY price ASC',
    price_high: ' ORDER BY price DESC',
    rating: ' ORDER BY rating DESC',
};

/**
 * Finds products, optionally filtered and sorted.
 *
 * The clauses are appended in the same order as the original query, and every
 * value is still bound as a parameter -- the only interpolated text is the
 * fixed ORDER BY from the table above.
 *
 * @param {Object} criteria
 * @param {string} [criteria.search]   Matched against name and category.
 * @param {string} [criteria.minPrice]
 * @param {string} [criteria.maxPrice]
 * @param {string} [criteria.sort]
 * @returns {Promise<Object[]>}
 */
async function findAll({ search, minPrice, maxPrice, sort } = {}) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND (name LIKE ? OR category LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
        query += ' AND price >= ?';
        params.push(minPrice);
    }
    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(maxPrice);
    }

    if (sort && Object.prototype.hasOwnProperty.call(SORT_CLAUSES, sort)) {
        query += SORT_CLAUSES[sort];
    }

    const [rows] = await db.query(query, params);
    return rows;
}

/**
 * @param {string|number} id
 * @returns {Promise<Object|undefined>} undefined when no product matches.
 */
async function findById(id) {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
}

/**
 * @param {Object} product
 * @returns {Promise<number>} The new product's id.
 */
async function insert({ name, price, category, description, image_url, stock }) {
    const [result] = await db.query(
        'INSERT INTO products (name, price, category, description, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, category, description, image_url, stock]
    );
    return result.insertId;
}

/**
 * Reduces a product's stock. Not guarded against going negative here -- the
 * CHECK constraint in schema.sql is what rejects that.
 *
 * @param {string|number} productId
 * @param {number} quantity
 * @returns {Promise<void>}
 */
async function decrementStock(productId, quantity) {
    await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [quantity, productId]
    );
}

module.exports = { findAll, findById, insert, decrementStock };

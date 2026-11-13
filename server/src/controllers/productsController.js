const productsService = require('../services/productsService');

/** GET /products */
async function list(req, res) {
    const { search, minPrice, maxPrice, sort } = req.query;
    const products = await productsService.list({ search, minPrice, maxPrice, sort });
    res.json(products);
}

/** GET /products/:id */
async function getById(req, res) {
    const product = await productsService.getById(req.params.id);

    // A missing product is passed straight to res.json, which answers 200 with
    // an empty body. That is what this endpoint has always done and what the
    // client expects; returning a 404 instead would be a response change.
    res.json(product);
}

/** POST /products */
async function create(req, res) {
    const { name, price, category, description, image_url, stock } = req.body;

    await productsService.create({ name, price, category, description, image_url, stock });

    // The original response named a productId, but read insertId off the
    // driver's [rows, fields] tuple instead of the result row, so the value
    // was always undefined and JSON.stringify dropped the key. The body has
    // therefore only ever contained this message, and that is reproduced here
    // rather than silently changing the shape. The service does return the new
    // id, so including it is a one-line follow-up once agreed.
    res.json({ message: 'Product added successfully!' });
}

module.exports = { list, getById, create };

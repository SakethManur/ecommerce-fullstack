const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- 1. PRODUCT APIs ---

// GET /products
app.get('/products', async (req, res) => {
    try {
        const { search, minPrice, maxPrice, sort } = req.query;
        let query = "SELECT * FROM products WHERE 1=1";
        let params = []; 

        if (search) {
            query += " AND (name LIKE ? OR category LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (minPrice) { query += " AND price >= ?"; params.push(minPrice); }
        if (maxPrice) { query += " AND price <= ?"; params.push(maxPrice); }

        if (sort === 'price_low') query += " ORDER BY price ASC";
        else if (sort === 'price_high') query += " ORDER BY price DESC";
        else if (sort === 'rating') query += " ORDER BY rating DESC";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("DATABASE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /products/:id (Single Product)
app.get('/products/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/products', async (req, res) => {
    const { name, price, category, description, image_url, stock } = req.body;
    
    // Simple validation
    if (!name || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await db.query(
            'INSERT INTO products (name, price, category, description, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)', 
            [name, price, category, description, image_url, stock || 10]
        );
        res.json({ message: "Product added successfully!", productId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. AUTH APIs ---

app.post('/authentication/create-account', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO accounts (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, "user")', 
            [firstName, lastName, email, password]
        );
        res.json({ success: true, userId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: "Account likely already exists" });
    }
});

app.post('/authentication/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            // Note: We now send back the ROLE too
            res.json({ success: true, userId: users[0].id, role: users[0].role, user: users[0] });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. CART APIs ---

app.get('/cart', async (req, res) => {
    const { userId } = req.query;
    try {
        const query = `
            SELECT cart.id, products.name, products.price, products.image_url, cart.quantity 
            FROM cart 
            JOIN products ON cart.product_id = products.id 
            WHERE cart.user_id = ?`;
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /cart
app.post('/cart', async (req, res) => {
    const { userId, productId, quantity, size } = req.body; // <--- ADD size
    try {
        await db.query(
            'INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)', 
            [userId, productId, quantity || 1, size || null] // <--- Save size or null
        );
        res.json({ message: "Added to cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE id = ?', [req.params.id]);
        res.json({ message: "Item removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. ORDER APIs ---

app.get('/tax-on-product/:country', (req, res) => {
    const country = req.params.country.toLowerCase();
    let taxRate = 10;
    if (country === 'india') taxRate = 18;
    else if (country === 'usa') taxRate = 8;
    else if (country === 'uk') taxRate = 20;
    res.json({ country: req.params.country, taxRate: taxRate });
});

app.post('/order', async (req, res) => {
    const { userId, items, address } = req.body;
    
    let subtotal = 0;
    // Calculate Total
    items.forEach(item => subtotal += (item.price * item.quantity));
    
    const totalWithTax = subtotal * 1.08;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    try {
        // 1. Create the Order
        await db.query(
            'INSERT INTO orders (user_id, items, total_price, delivery_address, delivery_date) VALUES (?, ?, ?, ?, ?)', 
            [userId, JSON.stringify(items), totalWithTax, address, deliveryDate]
        );

        // 2. SUBTRACT STOCK FOR EACH ITEM (New Logic)
        for (const item of items) {
            // We use item.product_id (from cart) or item.id (direct buy)
            const pid = item.product_id || item.id;
            const qty = item.quantity;
            
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, pid]);
        }

        // 3. Clear Cart
        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.json({ message: `Order placed. Arriving: ${deliveryDate.toDateString()}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/ordered-items', async (req, res) => {
    const { userId } = req.query;
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. ACCOUNT APIs ---

app.put('/account/update', async (req, res) => {
    const { userId, phone, address } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing User ID" });

    try {
        // Dynamic Update: Updates phone if provided, updates address if provided
        if (phone) {
            await db.query('UPDATE accounts SET phone = ? WHERE id = ?', [phone, userId]);
        }
        if (address) {
            await db.query('UPDATE accounts SET address = ? WHERE id = ?', [address, userId]);
        }
        
        res.json({ message: "Profile updated successfully!" });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// --- 6. NEW: REVIEWS APIs ---

// GET Reviews for a specific product
app.get('/products/:id/reviews', async (req, res) => {
    try {
        const query = `
            SELECT reviews.*, accounts.first_name 
            FROM reviews 
            JOIN accounts ON reviews.user_id = accounts.id 
            WHERE product_id = ? 
            ORDER BY created_at DESC`;
        const [rows] = await db.query(query, [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new review
app.post('/products/:id/reviews', async (req, res) => {
    const { userId, rating, comment } = req.body;
    const productId = req.params.id;
    try {
        await db.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)', 
            [userId, productId, rating, comment]
        );
        res.json({ message: "Review added!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 7. NEW: WISHLIST APIs ---

app.get('/wishlist', async (req, res) => {
    const { userId } = req.query;
    try {
        const query = `
            SELECT wishlist.id, products.name, products.price, products.image_url 
            FROM wishlist 
            JOIN products ON wishlist.product_id = products.id 
            WHERE wishlist.user_id = ?`;
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/wishlist', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        // Check duplicate
        const [exists] = await db.query('SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);
        if (exists.length > 0) return res.json({ message: "Already in wishlist" });

        await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, productId]);
        res.json({ message: "Added to wishlist" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- ADMIN ORDER APIs ---
app.get('/admin/orders', async (req, res) => {
    try {
        // We join with accounts to see WHO bought the item
        const query = `
            SELECT orders.*, accounts.email, accounts.first_name 
            FROM orders 
            JOIN accounts ON orders.user_id = accounts.id 
            ORDER BY order_date DESC`;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/admin/order/:id/status', async (req, res) => {
    const { status } = req.body; // 'Shipped', 'Delivered'
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: "Order status updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(5001, () => {
    console.log("Server running on port 5001");
});
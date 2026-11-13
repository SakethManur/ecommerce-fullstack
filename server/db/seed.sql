-- ---------------------------------------------------------------------------
-- Demo data for LOCAL DEVELOPMENT ONLY.
--
-- !! DO NOT RUN THIS AGAINST A DEPLOYED DATABASE !!
--
-- The API stores and compares passwords in plaintext, so the logins below are
-- real, usable credentials exactly as written. They exist so `docker compose
-- up` gives you something to click through, nothing more.
--
--   admin@example.com     / admin123     (role: admin)
--   customer@example.com  / customer123  (role: user)
--
-- Runs after schema.sql. INSERT IGNORE keeps a re-run from failing on the
-- unique email key.
-- ---------------------------------------------------------------------------

USE ecommerce_db;

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO accounts (id, first_name, last_name, email, password, role, phone, address) VALUES
    (1, 'Demo', 'Admin', 'admin@example.com', 'admin123', 'admin', '+1-555-0100', '1 Admin Way, Dev City'),
    (2, 'Demo', 'Customer', 'customer@example.com', 'customer123', 'user', '+1-555-0101', '123 Main St, Dev City');

-- ---------------------------------------------------------------------------
-- Products (15)
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO products (id, name, price, category, description, image_url, stock, rating) VALUES
    (1,  'Aurora Wireless Headphones', 129.99, 'Electronics',
         'Over-ear Bluetooth headphones with active noise cancelling and 30-hour battery life.',
         'https://picsum.photos/seed/headphones/600/600', 42, 4.6),
    (2,  'Nimbus Mechanical Keyboard', 89.50, 'Electronics',
         'Hot-swappable 75% mechanical keyboard with tactile brown switches and white backlight.',
         'https://picsum.photos/seed/keyboard/600/600', 28, 4.4),
    (3,  'Pulse Fitness Tracker', 59.00, 'Electronics',
         'Water-resistant activity band tracking steps, heart rate and sleep for up to 7 days.',
         'https://picsum.photos/seed/tracker/600/600', 65, 4.1),
    (4,  'Kestrel 4K Webcam', 74.25, 'Electronics',
         'Autofocus 4K webcam with dual noise-cancelling microphones and a privacy shutter.',
         'https://picsum.photos/seed/webcam/600/600', 19, 3.9),
    (5,  'Everyday Cotton T-Shirt', 19.99, 'Clothing',
         'Mid-weight 100% combed cotton crew neck. Pre-shrunk and available in five colours.',
         'https://picsum.photos/seed/tshirt/600/600', 120, 4.3),
    (6,  'Trailhead Rain Jacket', 149.00, 'Clothing',
         'Three-layer waterproof shell with taped seams, pit zips and a packable hood.',
         'https://picsum.photos/seed/jacket/600/600', 34, 4.7),
    (7,  'Summit Merino Socks', 22.00, 'Clothing',
         'Cushioned merino wool hiking socks that stay warm when damp. Two-pair pack.',
         'https://picsum.photos/seed/socks/600/600', 88, 4.5),
    (8,  'Classic Denim Jeans', 69.95, 'Clothing',
         'Straight-leg 12oz denim with a touch of stretch for everyday wear.',
         'https://picsum.photos/seed/jeans/600/600', 51, 4.0),
    (9,  'Cast Iron Skillet 12"', 44.90, 'Home',
         'Pre-seasoned cast iron skillet, oven safe to 260C and ready to use out of the box.',
         'https://picsum.photos/seed/skillet/600/600', 40, 4.8),
    (10, 'Linen Duvet Cover Set', 119.00, 'Home',
         'Stonewashed French linen duvet cover with two pillowcases. Softens with every wash.',
         'https://picsum.photos/seed/duvet/600/600', 23, 4.2),
    (11, 'Ceramic Pour-Over Set', 38.75, 'Home',
         'Ceramic pour-over cone and 600ml carafe with a reusable stainless steel filter.',
         'https://picsum.photos/seed/pourover/600/600', 60, 4.4),
    (12, 'Desk Lamp with USB-C', 54.00, 'Home',
         'Dimmable LED desk lamp, five colour temperatures and an 18W USB-C charging port.',
         'https://picsum.photos/seed/lamp/600/600', 47, 3.8),
    (13, 'The Pragmatic Programmer', 42.50, 'Books',
         'Classic guide to software craftsmanship, 20th anniversary edition. Hardcover.',
         'https://picsum.photos/seed/pragmatic/600/600', 75, 4.9),
    (14, 'Designing Data-Intensive Applications', 55.00, 'Books',
         'Martin Kleppmann on the architecture behind reliable, scalable data systems.',
         'https://picsum.photos/seed/ddia/600/600', 58, 4.9),
    (15, 'Pocket Notebook 3-Pack', 14.99, 'Books',
         'Set of three 64-page dot-grid pocket notebooks with a lay-flat stitched spine.',
         'https://picsum.photos/seed/notebook/600/600', 0, 4.1);

-- ---------------------------------------------------------------------------
-- Reviews -- a few, so the product pages are not empty.
-- Note product 15 is deliberately left at stock 0 to exercise the
-- out-of-stock path.
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO reviews (id, user_id, product_id, rating, comment) VALUES
    (1, 2, 1,  5, 'Noise cancelling is genuinely good for the price. Battery easily lasts a week.'),
    (2, 2, 6,  5, 'Kept me completely dry on a four-hour hike in steady rain.'),
    (3, 2, 9,  4, 'Heavy, as expected. Seasoning held up well after a month of use.'),
    (4, 1, 13, 5, 'Still the book I hand to every new hire.'),
    (5, 2, 12, 3, 'Light is great, but the base takes up more desk space than I expected.');

-- ---------------------------------------------------------------------------
-- Wishlist -- two saved items for the demo customer.
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO wishlist (user_id, product_id) VALUES
    (2, 2),
    (2, 14);

-- ---------------------------------------------------------------------------
-- Schema for the ecommerce app.
--
-- Derived from the queries in server/index.js. Every column here is one the
-- API reads or writes; nothing is speculative.
--
-- Safe to run repeatedly: tables are only created when absent. It is also the
-- first init script for the MySQL container (see docker-compose.yml).
-- ---------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS ecommerce_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- ---------------------------------------------------------------------------
-- accounts -- users and admins
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name  VARCHAR(100)  NOT NULL,
    last_name   VARCHAR(100)  NOT NULL DEFAULT '',
    email       VARCHAR(255)  NOT NULL,
    -- NOTE: the API stores and compares this in plaintext. See the warning in
    -- seed.sql; hashing it is a separate change.
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    phone       VARCHAR(30)   NULL,
    address     VARCHAR(500)  NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    -- The create-account route relies on this to reject duplicate signups.
    UNIQUE KEY uq_accounts_email (email)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- products -- catalogue and stock
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name         VARCHAR(255)  NOT NULL,
    price        DECIMAL(10, 2) NOT NULL,
    category     VARCHAR(100)  NOT NULL,
    description  TEXT          NULL,
    image_url    VARCHAR(1000) NULL,
    stock        INT           NOT NULL DEFAULT 10,
    -- NULL until the product has been rated; ORDER BY rating DESC sorts
    -- unrated products last.
    rating       DECIMAL(2, 1) NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_products_price  CHECK (price > 0),
    CONSTRAINT chk_products_stock  CHECK (stock >= 0),
    CONSTRAINT chk_products_rating CHECK (rating BETWEEN 1 AND 5),

    -- Supports the search / filter / sort on GET /products.
    KEY idx_products_category (category),
    KEY idx_products_price (price)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- cart -- a user's pending items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED NOT NULL,
    product_id  INT UNSIGNED NOT NULL,
    quantity    INT          NOT NULL DEFAULT 1,
    size        VARCHAR(20)  NULL,
    added_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_cart_quantity CHECK (quantity > 0),

    KEY idx_cart_user (user_id),
    KEY idx_cart_product (product_id),

    -- A cart is disposable: drop the rows with the user or the product.
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id) REFERENCES accounts (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- orders -- immutable purchase records
--
-- items is a JSON snapshot of what was bought, so an order stays readable
-- after a product is renamed, repriced or removed.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id           INT UNSIGNED  NOT NULL,
    items             JSON          NOT NULL,
    total_price       DECIMAL(10, 2) NOT NULL,
    delivery_address  VARCHAR(500)  NOT NULL,
    delivery_date     DATE          NOT NULL,
    order_date        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status            ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled')
                          NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (id),
    CONSTRAINT chk_orders_total CHECK (total_price >= 0),

    KEY idx_orders_user (user_id),
    KEY idx_orders_date (order_date),

    -- RESTRICT, not CASCADE: deleting a user must not erase the sales record.
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES accounts (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- reviews -- per-product user feedback
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED NOT NULL,
    product_id  INT UNSIGNED NOT NULL,
    rating      TINYINT UNSIGNED NOT NULL,
    comment     TEXT         NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),

    KEY idx_reviews_user (user_id),
    KEY idx_reviews_product (product_id),

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES accounts (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- wishlist -- saved products, one row per user/product pair
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED NOT NULL,
    product_id  INT UNSIGNED NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    -- Enforces at the database what POST /wishlist checks in application code.
    UNIQUE KEY uq_wishlist_user_product (user_id, product_id),

    -- user_id is the leftmost column of the unique key above, so it already
    -- has an index; product_id needs its own.
    KEY idx_wishlist_product (product_id),

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id) REFERENCES accounts (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wishlist_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

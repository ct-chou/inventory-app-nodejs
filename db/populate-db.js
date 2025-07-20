#! /usr/bin/env node
require('dotenv').config();
const { Client } = require("pg");

const SQL_PRODUCTS = `
    DROP TABLE IF EXISTS products CASCADE;
    CREATE TABLE products (
        product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        volume_ml INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        in_stock BOOLEAN DEFAULT TRUE,
        category VARCHAR(50) NOT NULL
    );
    INSERT INTO products (name, description, volume_ml, price, in_stock, category) VALUES
        ('Guava Kombucha', 'Refreshing kombucha with tropical guava flavor', 300, 3.50, TRUE, 'bottled'),
        ('Guava Kombucha', 'Refreshing kombucha with tropical guava flavor', 500, 5.00, TRUE, 'bottled'),
        ('Apple Kombucha', 'Crisp apple-infused kombucha', 300, 3.00, TRUE, 'can'),
        ('Apple Kombucha', 'Crisp apple-infused kombucha', 500, 5.00, TRUE, 'can'),
        ('Strawberry Kombucha', 'Sweet and tangy strawberry kombucha', 300, 3.50, TRUE, 'bottled'),
        ('Strawberry Kombucha', 'Sweet and tangy strawberry kombucha', 500, 5.50, TRUE, 'bottled'),
        ('Ginger Kombucha', 'Spicy ginger kombucha with a kick', 300, 3.50, TRUE, 'can'),
        ('Ginger Kombucha', 'Spicy ginger kombucha with a kick', 500, 5.50, TRUE, 'can'),
        ('Mango Kombucha', 'Exotic mango-flavored kombucha', 300, 3.50, TRUE, 'bottled'),
        ('Mango Kombucha', 'Exotic mango-flavored kombucha', 500, 5.50, TRUE, 'bottled'),
        ('Yellow Kiwi Kombucha', 'Unique yellow kiwi kombucha blend', 300, 4.00, TRUE, 'seasonal'),
        ('Yellow Kiwi Kombucha', 'Unique yellow kiwi kombucha blend', 500, 6.00, TRUE, 'seasonal'),
        ('Classic Kombucha', 'Original kombucha blend', 5000, 25.00, TRUE, 'keg');
`;

const SQL_INVENTORY = `
    DROP TABLE IF EXISTS inventory CASCADE;
    CREATE TABLE inventory (
        product_id INTEGER PRIMARY KEY REFERENCES products(product_id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO inventory (product_id, quantity) VALUES
        (1, 100),
        (2, 50),
        (3, 200),
        (4, 150),
        (5, 80),
        (6, 60),
        (7, 120),
        (8, 90),
        (9, 110),
        (10, 70),
        (11, 30),
        (12, 20),
        (13, 10);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    user: process.env.PGUSER,
    host: 'localhost',
    database: 'inventory_app',
    password: process.env.PGPASSWORD,
    port: 5432,
  });
  await client.connect();
  await client.query(SQL_PRODUCTS);
  await client.query(SQL_INVENTORY);
  await client.end();
  console.log("done");
}

main();

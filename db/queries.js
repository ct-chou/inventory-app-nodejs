const pool = require('./pool');

async function getAllProducts() {
  try {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    const query = 'DELETE FROM products WHERE product_id = $1';
    await pool.query(query, [productId]);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

async function getAllProductsWithInventory() {
  try {
    const query = `
      SELECT 
        p.product_id, 
        p.name, 
        p.description, 
        p.volume_ml, 
        p.price, 
        p.in_stock, 
        p.category, 
        i.quantity, 
        i.last_updated
      FROM 
        products p
      JOIN 
        inventory i ON p.product_id = i.product_id
      ORDER BY 
        p.name, i.quantity
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching products with inventory:', error);
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const query = `
    SELECT 
        p.product_id, 
        p.name, 
        p.description, 
        p.volume_ml, 
        p.price, 
        p.in_stock, 
        p.category, 
        i.quantity, 
        i.last_updated
      FROM 
        products p
      JOIN 
        inventory i ON p.product_id = i.product_id
      WHERE p.product_id = $1
      ORDER BY 
        p.name, i.quantity
      
    `;
    const result = await pool.query(query, [productId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

async function addProduct(product) {
  try {
    const query = `
      INSERT INTO products (name, description, volume_ml, price, in_stock, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING product_id
    `;

    const values = [product.name, product.description, product.volume_ml, product.price, product.in_stock === 'true' || product.in_stock === true, product.category];
    const result = await pool.query(query, values);
    console.log('Product added:', result.rows[0]);
    return result.rows[0].product_id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

async function addInventory(productId, quantity) {
  try {
    const query = `
      INSERT INTO inventory (product_id, quantity)
      VALUES ($1, $2)
      ON CONFLICT (product_id)
      DO UPDATE SET quantity = inventory.quantity + $2, last_updated = NOW()
    `;
    const values = [productId, quantity];
    await pool.query(query, values);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
}

async function updateProduct(productId, product) {
  try {
    const query = `
      UPDATE products
      SET name = $1, description = $2, volume_ml = $3, price = $4, in_stock = $5, category = $6
      WHERE product_id = $7
    `;
    const values = [product.name, product.description, product.volume_ml, product.price, product.in_stock === 'true' || product.in_stock === true, product.category, productId];
    await pool.query(query, values);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

async function updateInventory(productId, quantity) {
  try {
    const query = `
      UPDATE inventory
      SET quantity = $1, last_updated = NOW()
      WHERE product_id = $2
    `;
    await pool.query(query, [quantity, productId]);
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
} 



module.exports = {
   addProduct,
   addInventory,
  deleteProduct,
  getAllProducts,
  getAllProductsWithInventory,
  getProductById,
  updateProduct,
  updateInventory,
};
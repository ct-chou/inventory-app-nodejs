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


module.exports = {
  getAllProducts,
  getAllProductsWithInventory,
  getProductById,
};
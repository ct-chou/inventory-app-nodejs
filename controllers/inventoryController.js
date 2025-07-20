const db = require('../db/queries');

async function getAllInventoryItems(req, res) {
    try {
        const items = await db.getAllProductsWithInventory();
        console.log('Inventory Items:', items);
        res.render('index', {
            title: 'Inventory List',
            items: items
        });
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getItem(req, res) {
    const itemId = req.params.id;
    try {
        const item = await db.getProductById(itemId);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.render('item', {
            title: item.name,
            item: item
        });
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllInventoryItems,
    getItem
};
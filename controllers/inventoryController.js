const {body, validationResult} = require('express-validator');
const db = require('../db/queries');

const noSpecialChars = 'must contain only letters, numbers and spaces';
const alphaNumericErrorMessage = 'must be alphanumeric';
const lengthErrorMessage = 'length must be between 1 and 100 characters';
const integerErrorMessage = 'must be a positive integer';
const numberErrorMessage = 'must be a number (can include decimals)';
const descriptionLengthErrorMessage = 'must be at most 500 characters long';

const validateProduct = [
    body('name')
        .matches(/^[a-zA-Z0-9\s]+$/).withMessage(`Name ${noSpecialChars}`)
        .isLength({ min: 1, max: 100 }).withMessage(`Name ${lengthErrorMessage}`),
    body('volume_ml')
        .isInt({ min: 1 }).withMessage(`Volume ${integerErrorMessage}`)
        .toInt(),
    body('description')
        .optional({ checkFalsy: true })
        .isLength({ max: 500 }).withMessage(`Description ${descriptionLengthErrorMessage}`),
    body('price')
        .optional({ checkFalsy: true })
        .isDecimal().withMessage(`Price ${numberErrorMessage}`)
        .toFloat(),
    body('category')
        .optional({ checkFalsy: true })
        .isAlphanumeric().withMessage(`Category ${alphaNumericErrorMessage}`)
        .isLength({ min: 1, max: 50 }).withMessage(`Category ${lengthErrorMessage}`),
    body('in_stock')
        .optional({ checkFalsy: true })
        .isBoolean().withMessage('In stock must be a boolean value'),
    body('quantity')
        .isInt({ min: 0 }).withMessage(`Quantity ${integerErrorMessage}`)
        .toInt()   
];

async function deleteItem(req, res) {
    const itemId = req.params.id;
    try {
        await db.deleteProduct(itemId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send('Internal Server Error');
    }
}   

async function getSearchResults(req, res) {
    const searchTerm = req.query.name;
    console.log('Search Term:', searchTerm);
    try {
        const items = await db.searchByName(searchTerm);
        console.log('Search Results:', items);
        res.render('index', {
            title: 'Search Results',
            items: items,
            searchTerm: searchTerm
        });
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getAllInventoryItems(req, res) {
    try {
        const items = await db.getAllProductsWithInventory();
        console.log('Inventory Items:', items);
        res.render('index', {
            title: 'Inventory List',
            searchTerm:'',
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

async function addItemForm(req, res) {
    res.render('add-form', {
        title: 'Add New Product'
    });
}

async function getItemEditForm(req, res) {
    const itemId = req.params.id;
    try {
        const item = await db.getProductById(itemId);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.render('edit-form', {
            title: `Edit ${item.name}`,
            itemId: itemId,
            item: item
        });
    } catch (error) {
        console.error('Error fetching item for edit:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function addItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('add-form', {
            title: 'Add New Product',
            errors: errors.array()
        });
    }

    const { name, description, volume_ml, price, in_stock, category, quantity } = req.body;
    try {
        const product_id = await db.addProduct({ name, description, volume_ml, price, in_stock, category });
        // const product = await db.getProductByName(name);
        await db.addInventory(product_id, quantity);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function updateItem(req, res) {
    const itemId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('edit-form', {
            title: 'Edit Product',
            errors: errors.array(),
            item: req.body
        });
    }

    const { name, description, volume_ml, price, in_stock, category, quantity } = req.body;
    try {
        await db.updateProduct(itemId, { name, description, volume_ml, price, in_stock, category });
        await db.updateInventory(itemId, quantity);
        res.redirect(`/item/${itemId}`);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllInventoryItems,
    getItem,
    addItemForm,
    deleteItem,
    addItem,
    getItemEditForm,
    updateItem,
    getSearchResults,
    validateProduct  // Export the validation middleware
};
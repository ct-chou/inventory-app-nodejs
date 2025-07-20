const { Router } = require('express');
const inventoryController = require('../controllers/inventoryController');
const inventoryRouter = Router();  

inventoryRouter.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Then call your controller
    inventoryController.getAllInventoryItems(req, res);
});
inventoryRouter.get('/item/:id', inventoryController.getItem);
inventoryRouter.get('/add', inventoryController.addItemForm);
inventoryRouter.post('/add', inventoryController.validateProduct, inventoryController.addItem);

module.exports = inventoryRouter;

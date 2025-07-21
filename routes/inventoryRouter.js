const { Router } = require('express');
const inventoryController = require('../controllers/inventoryController');
const inventoryRouter = Router();  

inventoryRouter.get('/', inventoryController.getAllInventoryItems);
inventoryRouter.get('/item/:id', inventoryController.getItem);
inventoryRouter.post('/item/:id/delete', inventoryController.deleteItem);
inventoryRouter.get('/add', inventoryController.addItemForm);
inventoryRouter.post('/add', inventoryController.validateProduct, inventoryController.addItem);

module.exports = inventoryRouter;

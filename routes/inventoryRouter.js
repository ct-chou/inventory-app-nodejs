const { Router } = require('express');
const inventoryController = require('../controllers/inventoryController');
const inventoryRouter = Router();  

inventoryRouter.get('/', inventoryController.getAllInventoryItems);
inventoryRouter.get('/item/:id', inventoryController.getItem);

module.exports = inventoryRouter;

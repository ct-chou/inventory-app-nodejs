const { Router } = require('express');
const inventoryController = require('../controllers/inventoryController');
const inventoryRouter = Router();  

inventoryRouter.get('/', inventoryController.getAllInventoryItems);
inventoryRouter.get('/item/:id', inventoryController.getItem);
inventoryRouter.post('/item/:id/delete', inventoryController.deleteItem);
inventoryRouter.get('/add', inventoryController.addItemForm);
inventoryRouter.post('/add', inventoryController.validateProduct, inventoryController.addItem);
inventoryRouter.get('/item/:id/edit', inventoryController.getItemEditForm);
inventoryRouter.post('/item/:id/edit', inventoryController.validateProduct, inventoryController.updateItem);
inventoryRouter.get('/search', inventoryController.getSearchResults); // Assuming search functionality is handled in the same controller

module.exports = inventoryRouter;

const express = require('express');
const app = express();
const inventoryRouter = require('./routes/inventoryRouter');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use('/', inventoryRouter); // Use the inventory router for root path

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`
));
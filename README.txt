Designing an inventory management app to practice concepts learned from TOP. 
The imaginary store will  be for kombucha

Database: inventory_app
Tables:

1. products
  product_id
  name: guava, apple, strawberry, ginger, mango, yellow kiwi
  description:
  volume_ml: 300, 500
  price: 3, 5
  in_stock: boolean
  category: bottled, can, keg, seasonal

2. customers
  customer_id
  name: full name
  email:
  phone (opt):
  address (opt):
  created_at: timestamp

3. orders
  order_id:
  customer_id
  order_date: timestamp
  total_cost:
  payment_status: paid, cart, return
  order_status: processing, shipped, completed

4. inventory
  product_id
  stock_quantity:
  last_updated: timestamp




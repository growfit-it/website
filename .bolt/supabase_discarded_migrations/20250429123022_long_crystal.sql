-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE orderstatus AS ENUM ('ToBeDelivered', 'AlreadyDelivered');
CREATE TYPE product_item_type AS ENUM ('Bundled Meal', 'Meal Prep');
CREATE TYPE subscription_status AS ENUM ('active', 'paused');
CREATE TYPE subscription_type AS ENUM ('Chef''s Choice', 'My Choice');

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Items table
CREATE TABLE IF NOT EXISTS productitems (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type product_item_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Bundles table
CREATE TABLE IF NOT EXISTS productbundles (
  id SERIAL PRIMARY KEY,
  subscriptionmeals INTEGER,
  categoryfilter INTEGER REFERENCES categories(id),
  priceineurcents INTEGER NOT NULL,
  stripeproductid VARCHAR(255),
  stripepriceid VARCHAR(255),
  fullname VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscription_status subscription_status DEFAULT 'active',
  subscription_type subscription_type DEFAULT 'Chef''s Choice',
  main_subscription_label VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customerid INTEGER REFERENCES customers(id),
  productitemid INTEGER REFERENCES productitems(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  deliverydate DATE NOT NULL,
  status orderstatus DEFAULT 'ToBeDelivered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE productitems ENABLE ROW LEVEL SECURITY;
ALTER TABLE productbundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for customers
CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Customers can update own data" ON customers
  FOR UPDATE USING (auth.uid()::text = email);

-- Policies for orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = orders.customerid
      AND customers.email = auth.uid()::text
    )
  );

-- Policies for public access to product data
CREATE POLICY "Anyone can view products" ON productitems
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view bundles" ON productbundles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customerid ON orders(customerid);
CREATE INDEX idx_orders_deliverydate ON orders(deliverydate);
CREATE INDEX idx_productbundles_categoryfilter ON productbundles(categoryfilter);
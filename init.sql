--
-- Name: product_category; Type: ENUM;
--
CREATE TYPE product_category AS ENUM (
    'Sneakers',
    'Streetwear'
);

-- All below commands are on Schema: products with Owner: puser
--
-- Name: products; Type: TABLE; 
--
CREATE TABLE products (
  pid SERIAL PRIMARY KEY,
  brand character varying(50) NOT NULL,
	name character varying(50) NOT NULL,
	category product_category NOT NULL,
	created_at timestamp without time zone DEFAULT now()
);

--
-- Name: products_brand_name_category_ukey; Type: INDEX; Columns: brand, name, category; 
--
CREATE UNIQUE INDEX products_brand_name_category_ukey ON products USING btree (brand, name, category);

--
-- Name: products_true_to_size; Type: TABLE; 
--
CREATE TABLE products_true_to_size (
  psid SERIAL PRIMARY KEY,
	pid integer NOT NULL,
	true_to_size integer NOT NULL CONSTRAINT size_range CHECK (true_to_size >= 1 AND true_to_size <= 5),
  created_at timestamp without time zone DEFAULT now()
);
	
--
-- Name: products_true_to_size_pid_fkey; Type: CONSTRAINT; 
--
ALTER TABLE ONLY products_true_to_size
  ADD CONSTRAINT products_true_to_size_pid_fkey FOREIGN KEY (pid) REFERENCES products(pid);
	
--
-- Name: idx_admin_integration_details_created_by; Type: INDEX;
--
CREATE INDEX index_products_true_to_size_true_to_size ON products_true_to_size USING btree(true_to_size);

-- Add data in products table
INSERT INTO products(brand, name, category) VALUES ('Adidas', 'Yeezy', 'Sneakers');
INSERT INTO products(brand, name, category) VALUES ('Jordan', 'Retro', 'Sneakers');
INSERT INTO products(brand, name, category) VALUES ('Nike', 'Kyrie', 'Sneakers');
INSERT INTO products(brand, name, category) VALUES ('Nike', 'Shox', 'Sneakers');
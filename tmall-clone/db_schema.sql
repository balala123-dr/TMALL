-- tmall-clone database schema
-- Charset: utf8mb4, Engine: InnoDB

CREATE TABLE IF NOT EXISTS address (
  address_area_id CHAR(6) PRIMARY KEY,
  address_name VARCHAR(50) NOT NULL,
  address_region_id CHAR(6),
  CONSTRAINT fk_address_parent
    FOREIGN KEY (address_region_id) REFERENCES address(address_area_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "user" (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name VARCHAR(25) NOT NULL,
  user_nickname VARCHAR(50),
  user_password VARCHAR(50) NOT NULL,
  user_realname VARCHAR(20),
  user_gender SMALLINT,
  user_birthday DATE,
  user_address CHAR(6),
  user_homeplace CHAR(6),
  user_profile_picture_src VARCHAR(100),
  CONSTRAINT uk_user_name UNIQUE (user_name),
  CONSTRAINT fk_user_address
    FOREIGN KEY (user_address) REFERENCES address(address_area_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_user_homeplace
    FOREIGN KEY (user_homeplace) REFERENCES address(address_area_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admin (
  admin_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_name VARCHAR(25) NOT NULL,
  admin_nickname VARCHAR(50),
  admin_password VARCHAR(50) NOT NULL,
  admin_profile_picture_src VARCHAR(255),
  CONSTRAINT uk_admin_name UNIQUE (admin_name)
);

CREATE TABLE IF NOT EXISTS category (
  category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_name VARCHAR(20) NOT NULL,
  category_image_src VARCHAR(255),
  CONSTRAINT uk_category_name UNIQUE (category_name)
);

CREATE TABLE IF NOT EXISTS product (
  product_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  product_title VARCHAR(100),
  product_price DECIMAL(10,2),
  product_sale_price DECIMAL(10,2),
  product_create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  product_category_id INT NOT NULL,
  product_is_enabled SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT idx_product_category FOREIGN KEY (product_category_id)
    REFERENCES category(category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_image (
  product_image_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_image_type SMALLINT NOT NULL,
  product_image_src VARCHAR(255) NOT NULL,
  product_image_product_id INT NOT NULL,
  CONSTRAINT idx_product_image_product FOREIGN KEY (product_image_product_id)
    REFERENCES product(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property (
  property_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  property_name VARCHAR(25) NOT NULL,
  property_category_id INT NOT NULL,
  CONSTRAINT idx_property_category FOREIGN KEY (property_category_id)
    REFERENCES category(category_id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_value (
  property_value_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  property_value_value VARCHAR(100),
  property_value_property_id INT NOT NULL,
  property_value_product_id INT NOT NULL,
  CONSTRAINT uk_property_value_product_property UNIQUE (property_value_product_id, property_value_property_id),
  CONSTRAINT fk_property_value_property
    FOREIGN KEY (property_value_property_id) REFERENCES property(property_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_property_value_product
    FOREIGN KEY (property_value_product_id) REFERENCES product(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_order (
  product_order_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_order_code VARCHAR(30) NOT NULL,
  product_order_address CHAR(6) NOT NULL,
  product_order_detail_address VARCHAR(255),
  product_order_post CHAR(6),
  product_order_receiver VARCHAR(20) NOT NULL,
  product_order_mobile CHAR(11) NOT NULL,
  product_order_pay_date TIMESTAMP,
  product_order_delivery_date TIMESTAMP,
  product_order_confirm_date TIMESTAMP,
  product_order_status SMALLINT NOT NULL DEFAULT 0,
  product_order_user_id INT NOT NULL,
  CONSTRAINT uk_product_order_code UNIQUE (product_order_code),
  CONSTRAINT fk_product_order_user
    FOREIGN KEY (product_order_user_id) REFERENCES "user"(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_product_order_address
    FOREIGN KEY (product_order_address) REFERENCES address(address_area_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_order_item (
  product_order_item_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_order_item_number SMALLINT NOT NULL,
  product_order_item_price DECIMAL(10,2) NOT NULL,
  product_order_item_product_id INT NOT NULL,
  product_order_item_order_id INT NOT NULL,
  product_order_item_user_id INT NOT NULL,
  product_order_item_user_message VARCHAR(255),
  CONSTRAINT idx_product_order_item_product FOREIGN KEY (product_order_item_product_id)
    REFERENCES product(product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT idx_product_order_item_order FOREIGN KEY (product_order_item_order_id)
    REFERENCES product_order(product_order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_product_order_item_user
    FOREIGN KEY (product_order_item_user_id) REFERENCES "user"(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS review (
  review_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  review_content TEXT NOT NULL,
  review_create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  review_user_id INT NOT NULL,
  review_product_id INT NOT NULL,
  review_order_item_id INT,
  CONSTRAINT idx_review_product FOREIGN KEY (review_product_id)
    REFERENCES product(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_review_user
    FOREIGN KEY (review_user_id) REFERENCES "user"(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_review_order_item
    FOREIGN KEY (review_order_item_id) REFERENCES product_order_item(product_order_item_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);


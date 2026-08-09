CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE intervention_status AS ENUM ('pending', 'done', 'cancelled');
CREATE TYPE payment_status AS ENUM ('processed', 'awaiting');
CREATE TYPE payment_type AS ENUM ('debit_card', 'cash');
CREATE TYPE mime_type AS ENUM ('image/jpeg', 'image/png');

CREATE TABLE app_user(
   id SERIAL,
   email VARCHAR(50)  NOT NULL,
   password VARCHAR(50)  NOT NULL,
   first_name VARCHAR(50)  NOT NULL,
   last_name VARCHAR(50)  NOT NULL,
   is_active BOOLEAN NOT NULL,
   created_on TIMESTAMP NOT NULL,
   updated_on TIMESTAMP,
   deleted_on TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE bike_type(
   id SERIAL,
   bike_type VARCHAR(50) ,
   PRIMARY KEY(id)
);

CREATE TABLE bike_brand(
   id SERIAL,
   brand_name VARCHAR(50) ,
   PRIMARY KEY(id)
);

CREATE TABLE job(
   id SERIAL,
   name VARCHAR(100)  NOT NULL,
   price NUMERIC(6,2)   NOT NULL,
   duration VARCHAR(50)  NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE bike_model(
   id SERIAL,
   model_name VARCHAR(50) ,
   brand_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(brand_id) REFERENCES bike_brand(id)
);

CREATE TABLE zone(
   id INTEGER,
   coordinates GEOMETRY NOT NULL,
   label VARCHAR(50)  NOT NULL,
   created_on TIMESTAMP NOT NULL,
   updated_on TIMESTAMP,
   deleted_on TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE interval_(
   id SERIAL,
   start_date TIMESTAMP NOT NULL,
   end_date TIMESTAMP NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE role(
   id INTEGER,
   label VARCHAR(50)  NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE permission(
   id INTEGER,
   permission VARCHAR(50)  NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE bike(
   id SERIAL,
   created_on TIMESTAMP NOT NULL,
   updated_on TIMESTAMP,
   deleted_on TIMESTAMP,
   id_1 INTEGER NOT NULL,
   user_id INTEGER NOT NULL,
   type_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES bike_model(id),
   FOREIGN KEY(user_id) REFERENCES app_user(id),
   FOREIGN KEY(type_id) REFERENCES bike_type(id)
);

CREATE TABLE intervention(
   id SERIAL,
   status intervention_status NOT NULL,
   is_cancelled BOOLEAN,
   cancelled_on TIMESTAMP,
   created_on TIMESTAMP NOT NULL,
   updated_on TIMESTAMP,
   deleted_on TIMESTAMP,
   intervention_id INTEGER NOT NULL,
   job_id INTEGER NOT NULL,
   mechanic_id INTEGER NOT NULL,
   cycle_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(intervention_id) REFERENCES interval_(id),
   FOREIGN KEY(job_id) REFERENCES job(id),
   FOREIGN KEY(mechanic_id) REFERENCES app_user(id),
   FOREIGN KEY(cycle_id) REFERENCES bike(id)
);

CREATE TABLE full_address(
   id SERIAL,
   number VARCHAR(50) ,
   street VARCHAR(150) ,
   postal_code VARCHAR(10) ,
   locality VARCHAR(100) ,
   region VARCHAR(100) ,
   country VARCHAR(100) ,
   zone_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(zone_id),
   FOREIGN KEY(zone_id) REFERENCES zone(id)
);

CREATE TABLE company_info(
   id SERIAL,
   name VARCHAR(50)  NOT NULL,
   description VARCHAR(300)  NOT NULL,
   phone_number VARCHAR(12)  NOT NULL,
   linkedin_link VARCHAR(100) ,
   facebook_link VARCHAR(100) ,
   twitter_link VARCHAR(100) ,
   instagram_link VARCHAR(100) ,
   full_address_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(full_address_id),
   FOREIGN KEY(full_address_id) REFERENCES full_address(id)
);

CREATE TABLE payment(
   id SERIAL,
   status payment_status NOT NULL,
   type payment_type NOT NULL,
   amount NUMERIC(8,2)   NOT NULL,
   created_on TIMESTAMP NOT NULL,
   updated_on TIMESTAMP,
   intervention_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(intervention_id) REFERENCES intervention(id)
);

CREATE TABLE file(
   id SERIAL,
   MIME_type mime_type NOT NULL,
   url VARCHAR(200)  NOT NULL,
   intervention_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(intervention_id) REFERENCES intervention(id)
);

CREATE TABLE comment(
   id SERIAL,
   text VARCHAR(1000)  NOT NULL,
   created_on TIMESTAMP NOT NULL,
   user_id INTEGER NOT NULL,
   intervention_id INTEGER NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES app_user(id),
   FOREIGN KEY(intervention_id) REFERENCES intervention(id)
);

CREATE TABLE user_full_address(
   user_id INTEGER,
   full_address_id INTEGER,
   PRIMARY KEY(user_id, full_address_id),
   FOREIGN KEY(user_id) REFERENCES app_user(id),
   FOREIGN KEY(full_address_id) REFERENCES full_address(id)
);

CREATE TABLE user_role(
   user_id INTEGER,
   role_id INTEGER,
   PRIMARY KEY(user_id, role_id),
   FOREIGN KEY(user_id) REFERENCES app_user(id),
   FOREIGN KEY(role_id) REFERENCES role(id)
);

CREATE TABLE role_permission(
   role_id INTEGER,
   permissions_id INTEGER,
   PRIMARY KEY(role_id, permissions_id),
   FOREIGN KEY(role_id) REFERENCES role(id),
   FOREIGN KEY(permissions_id) REFERENCES permission(id)
);

CREATE TABLE user_permission(
   user_id INTEGER,
   permission_id INTEGER,
   PRIMARY KEY(user_id, permission_id),
   FOREIGN KEY(user_id) REFERENCES app_user(id),
   FOREIGN KEY(permission_id) REFERENCES permission(id)
);

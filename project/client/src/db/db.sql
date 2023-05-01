Create DATABASE data_bot;

USE data_bot;

CREATE TABLE `payment_methods` (
  `id` tinyint AUTO_INCREMENT NOT NULL,
  `CLABE` VARCHAR(25),
  `no_card` varchar(25),
  `bank` tinytext,
  `subsidary` varchar(400),
  PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(50),
  `date` date,
  `type_us` ENUM('admin', 'ayudante'),
  `e-mail` tinytext,
  `pass` tinytext,
  `cel` varchar(25),
  PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(120),
  `key_word` varchar(80),
  `price` double,
  `stock` smallint,
  `img` text,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `catalogs` (
  `id` tinyint AUTO_INCREMENT NOT NULL,
  `name` varchar(20),
  `description` tinytext,
  `state` bit,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;


CREATE TABLE `catalog_products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `id_product` int,
  `id_catalog` tinyint,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id_product`) REFERENCES `products`(`id`),
    FOREIGN KEY (`id_catalog`) REFERENCES `catalogs`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `categories` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(100),
  `state` bit,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `categories_products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `id_categories` int,
  `id_product` int,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id_categories`) REFERENCES `categories`(`id`),
    FOREIGN KEY (`id_product`) REFERENCES `products`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `sold_products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `id_product` int,
  `quantity` smallint,
  `id_categories` int,
  `date_purchase` date,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_product`) REFERENCES `products`(`id`),
  FOREIGN KEY (`id_categories`) REFERENCES `categories`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `place_deliveries` (
  `id` tinyint AUTO_INCREMENT NOT NULL,
  `direction` tinytext,
  `cp` INT,
  `open_h` VARCHAR(10),
  `close_h` VARCHAR(10),
  PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `clients` (
  `id` INT,
  `number` varchar(20),
  `purchases` int,
  PRIMARY KEY (`number`)
);
CREATE TABLE `orders` (
  `id` int AUTO_INCREMENT NOT NULL,
  `folio` varchar(50),
  `date_order` date,
  `total` double,
  `state` enum('Pagado', 'Abonado', 'NA'),
  `id_client` varchar(20),
  `id_place` tinyint,
  `id_payment_method` TINYINT,
    PRIMARY KEY (`id`),
        FOREIGN KEY (`id_client`) REFERENCES `clients`(`number`),
        FOREIGN KEY (`id_place`) REFERENCES `place_deliveries`(`id`),
        FOREIGN KEY (`id_payment_method`) REFERENCES `payment_methods`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `order_details` (
  `id` int AUTO_INCREMENT NOT NULL,
  `id_order` int,
  `id_product` int,
  `quantity` smallint,
  `price` double,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`id_order`) REFERENCES `orders`(`id`),
    FOREIGN KEY (`id_product`) REFERENCES `products`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;



CREATE TABLE `deliveries` (
  `id` int AUTO_INCREMENT NOT NULL,
  `folio` varchar(50),
  `date_delivery` date,
  `rest` double,
  `state` bit,
  `id_client` varchar(20),
  `id_place` tinyint,
  `id_order` int,
    PRIMARY KEY (`id`),
        FOREIGN KEY (`id_client`) REFERENCES `clients`(`number`),
        FOREIGN KEY (`id_place`) REFERENCES `place_deliveries`(`id`),
        FOREIGN KEY (`id_order`) REFERENCES `orders`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `shoppings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `id_product` int,
  `quantity` smallint,
  `id_client` varchar(20),
  `date_purchase` date,
    PRIMARY KEY (`id`),
        FOREIGN KEY (`id_product`) REFERENCES `products`(`id`),
        FOREIGN KEY (`id_client`) REFERENCES `clients`(`number`)
);

CREATE TABLE `questions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `id_client` varchar(20),
  `question` text,
  `id_product` int, 
  `state` bit,
    PRIMARY KEY (`id`),
        FOREIGN KEY (`id_client`) REFERENCES `clients`(`number`),
        FOREIGN KEY (`id_product`) REFERENCES `products`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `answers` (
  `id` int AUTO_INCREMENT NOT NULL,
  `question` text,
  `answer` text,
  `id_user` int,
  `id_product` int,
  `ans_date` date,
    PRIMARY KEY (`id`),
        FOREIGN KEY (`id_user`) REFERENCES `users`(`id`),
        FOREIGN KEY (`id_product`) REFERENCES `products`(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE `Menus` (
  `id` int AUTO_INCREMENT NOT NULL,
  `option_key` varchar(100),
  `keywords` varchar(100),
  PRIMARY KEY (`id`)
);

CREATE TABLE `Menu_responses` (
  `id` int AUTO_INCREMENT NOT NULL,
  `option_key` varchar(100) DEFAULT NULL,
  `reply_message` varchar(100) DEFAULT NULL,
  `trigger` varchar(45) DEFAULT NULL,
  `media` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO payment_methods (CLABE, no_card, bank, subsidary) VALUES 
(
    '524 421 89799352332 0','4000 0012 3456 7890', 'Santander', 'Oxxo, Bodega Aurrera, 7-eleven'
),
(
    '234 421 80199252332 1','5876 0012 3456 8910', 'BBVA', 'Oxxo, Bodega Aurrera, 7-eleven, Chdraui'
);

INSERT INTO `users` (`name`, `date`, `type_us`, `e-mail`, `pass`, `cel`) VALUES 
('Carlos Daniel Lozano V', '2003/01/17','admin',  'charly.code0012@gmail.com', '0906gean', '33-2524-8063'),
('Diego Aljeandro Lozano', '2004/01/03','ayudante', 'digo12@gmail.com', '123456', '33-3809-4097');

INSERT INTO `products` (`name`, key_word, price, stock, img) VALUES
('lapiz mirado no 2', 'milapiz 2', 5.5, 12, "/lapiz.jpg"),
('colores prismacolor 24', 'prismacolor24', 250, 40, "/prismacolor24.jpg");

INSERT INTO `catalogs` (`name`, `description`, `state`) VALUES
('papeleria', 'productos para una papeleria', 1);

INSERT INTO `catalog_products`(id_product, id_catalog) VALUES 
(100, 100);

INSERT INtO `categories`(`name`, `state`) VALUES
('lapices', 1);

INSERT INTO `categories_products` (id_categories, id_product) VALUES 
(100, 100);

INSERT INTO sold_products (id_product, amount, id_categories, date_purchase) VALUES 
(100, 25, 100, '2022/10/28');

INSERT INTO `place_deliveries`(direction, cp, open_h, close_h) VALUES 
('calle Laurel 10, col La higuera', 45189, '11:30', '20:30');

INSERT INTO clients(id, `number`, purchases) VALUES
(1,'33-2524-8063', 15);

INSERT INTO `orders`(folio, date_order, total, `state`, `id_client`, id_place, id_payment_method) VALUES
("d234567", '2022/10/27',16.5 ,'Abonado', '33-2524-8063', 100, 100);

INSERT INTO `order_details`(id_order, id_product, quantity, price) VALUES
(100, 100, 3, 5.5);

INSERT INTO deliveries(folio, date_delivery, rest, `state`, id_client, id_place, id_order) VALUES
("d234567", '2022/10/28', 8, 0, '33-2524-8063', 100, 100);

INSERT INTO shoppings(id_product, quantity, id_client, date_purchase) VALUES
(100, 3, '33-2524-8063', '2022/10/28');

INSERT INTO questions(id_client, question, id_product, `state`) VALUES
('33-2524-8063', '¿Hay otro lapiz de la misma marca?', 100, 0);

INSERT INTO answers(question, answer, id_user, id_product, ans_date) VALUES
('¿Tiene sacapuntas?', 'No', 100, 101, '2022/10/15');

INSERT INTO Menus(option_key, keywords)VALUES('STEP_1','hola, hola!,ola,inicio,welcome');

INSERT INTO Menu_responses(option_key, reply_message, `trigger`, media) VALUES
('STEP_1','Hola soy un BOT',NULL,NULL);



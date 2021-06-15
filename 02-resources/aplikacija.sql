/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `aplikacija`;

CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'Djordje', '$2b$11$5XSr0G/QGnqdBRcdG.8L2uuZs/8O20ix/vS9hQ30b9Hc7plTYFEmy', 1),
	(4, 'Djordje.grkovic', '$2b$11$z6yoazHjMwhnshtWCT3IDeZw1av6BkhROZTlgz5jK6yyN7op8fijO', 1),
	(5, 'Djordje98', '$2b$11$MgeSvgG7gaoZVWnSuyMfr.6XRgudCT3i7Cblb7SDxGl1D9Oelvr7e', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`) VALUES
	(9, 'HDD'),
	(1, 'Operativni sistem'),
	(11, 'Ports'),
	(8, 'RAM'),
	(7, 'Screen size'),
	(10, 'Type of keyboard');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `uq_feature_name_category_id` (`name`,`category_id`),
  KEY `fk_feature_category_id` (`category_id`),
  CONSTRAINT `fk_feature_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `feature` DISABLE KEYS */;
INSERT INTO `feature` (`feature_id`, `name`, `category_id`) VALUES
	(12, '100GB', 9),
	(8, '13.2 inch', 7),
	(7, '15.6 inch', 7),
	(11, '16 GB', 8),
	(6, '17.2 inch', 7),
	(13, '250 GB', 9),
	(9, '4 GB', 8),
	(10, '8 GB', 8),
	(14, '900 GB', 9),
	(18, 'HDMI', 11),
	(5, 'Linux', 1),
	(2, 'Mac os', 1),
	(16, 'UK', 10),
	(15, 'US', 10),
	(20, 'VGA', 11),
	(19, 'Video port', 11),
	(1, 'Windows', 1),
	(17, 'YU', 10);
/*!40000 ALTER TABLE `feature` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `laptop` (
  `laptop_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`laptop_id`),
  UNIQUE KEY `uq_laptop_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `laptop` DISABLE KEYS */;
INSERT INTO `laptop` (`laptop_id`, `created_at`, `title`, `description`, `price`) VALUES
	(19, '2021-06-04 12:15:27', 'Laptop Dell2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 45.87),
	(20, '2021-06-04 12:19:47', 'Laptop Dell3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 45.87),
	(21, '2021-06-04 12:19:53', 'Laptop Dell4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 45.87),
	(22, '2021-06-15 19:03:30', 'Laptop Linux Winter', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 425.87),
	(23, '2021-06-15 19:06:36', 'Laptop Lenovo', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 125.87),
	(24, '2021-06-15 19:08:43', 'Laptop Acer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 125.87),
	(26, '2021-06-15 19:10:48', 'Laptop Acer 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 125.87),
	(27, '2021-06-15 19:13:18', 'Laptop Lenovo ThinkPad', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 925.87),
	(28, '2021-06-15 19:14:30', 'Laptop Lenovo Legion', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 725.87),
	(29, '2021-06-15 19:15:24', 'Laptop Lenovo Legion X', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 725.87),
	(30, '2021-06-15 19:17:14', 'Laptop Asus 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 379.99),
	(31, '2021-06-15 19:18:03', 'Laptop Asus 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 579.99),
	(32, '2021-06-15 19:19:03', 'Laptop Dell Inspiron', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 999.99);
/*!40000 ALTER TABLE `laptop` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `laptop_category` (
  `laptop_category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `laptop_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`laptop_category_id`),
  UNIQUE KEY `uq_laptop_category_laptop_id_category_id` (`laptop_id`,`category_id`),
  KEY `fk_laptop_category_category_id` (`category_id`),
  CONSTRAINT `fk_laptop_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_laptop_category_laptop_id` FOREIGN KEY (`laptop_id`) REFERENCES `laptop` (`laptop_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `laptop_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `laptop_category` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `laptop_feature` (
  `laptop_feature_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `laptop_id` int(10) unsigned NOT NULL,
  `feature_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`laptop_feature_id`),
  UNIQUE KEY `uq_laptop_feature_laptop_id_feature_id` (`laptop_id`,`feature_id`),
  KEY `fk_laptop_feature_feature_id` (`feature_id`),
  CONSTRAINT `fk_laptop_feature_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_laptop_feature_laptop_id` FOREIGN KEY (`laptop_id`) REFERENCES `laptop` (`laptop_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `laptop_feature` DISABLE KEYS */;
INSERT INTO `laptop_feature` (`laptop_feature_id`, `value`, `laptop_id`, `feature_id`) VALUES
	(43, '10', 19, 1),
	(44, '16', 19, 11),
	(45, '8', 20, 1),
	(46, '3.0', 20, 18),
	(47, '8 GB', 21, 10),
	(48, 'Catlina', 21, 2),
	(49, 'Mint', 22, 5),
	(50, '13.2 inch', 22, 8),
	(51, '07', 23, 1),
	(52, '100GB', 23, 12),
	(53, '07', 24, 1),
	(54, '250GB', 24, 13),
	(55, '07', 26, 1),
	(56, '900GB', 26, 14),
	(57, '2.0', 26, 19),
	(58, 'Big Sur', 27, 2),
	(59, '1.0', 27, 20),
	(60, '4GB', 27, 9),
	(61, '10', 28, 1),
	(62, '17.2 inch', 28, 6),
	(63, '4GB', 28, 9),
	(64, '10', 29, 1),
	(65, '15.6 inch', 29, 7),
	(66, '16GB', 29, 11),
	(67, '10', 30, 1),
	(68, 'YU', 30, 17),
	(69, '16GB', 30, 11),
	(70, '10', 31, 1),
	(71, 'US', 31, 15),
	(72, '16GB', 31, 11),
	(73, '10', 32, 1),
	(74, 'UK', 32, 16),
	(75, '16GB', 32, 11);
/*!40000 ALTER TABLE `laptop_feature` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `laptop_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `fk_photo_laptop_id` (`laptop_id`),
  CONSTRAINT `fk_photo_laptop_id` FOREIGN KEY (`laptop_id`) REFERENCES `laptop` (`laptop_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `laptop_id`) VALUES
	(15, 'static/uploads/2021/06/a717752b-9bd7-4eb4-b150-5b966d8674a2-adsl-i-vdsl-internet.jpg', 20),
	(16, 'static/uploads/2021/06/23c7ba71-b504-4456-b646-9798550cbbe3-adsl-i-vdsl-internet.jpg', 21),
	(17, 'static/uploads/2021/06/a8632b69-dc37-4164-8112-d17475b950dc-adsl-i-vdsl-internet.jpg', 19),
	(18, 'static/uploads/2021/06/6edf0ba3-0050-4865-ae57-6b4c5390a8ab-slika2.jpg', 19),
	(19, 'static/uploads/2021/06/6208ac54-e23b-475b-93dc-3ff39ca85eca-slika2.jpg', 19),
	(20, 'static/uploads/2021/06/f469b7b8-eca0-42f3-a366-d11f093e0fb8-slika2.jpg', 19),
	(21, 'static/uploads/2021/06/96262f3d-b11f-4b0d-8132-e05e89b9da4c-adsl-i-vdsl-internet.jpg', 22),
	(22, 'static/uploads/2021/06/063be394-f61d-4662-a457-e494536acdd3-adsl-i-vdsl-internet.jpg', 23),
	(23, 'static/uploads/2021/06/8398507c-27a5-43fc-b6f6-237d746fd76d-adsl-i-vdsl-internet.jpg', 24),
	(24, 'static/uploads/2021/06/348708a3-2662-4aed-9fc8-c58b92c74b78-adsl-i-vdsl-internet.jpg', 26),
	(25, 'static/uploads/2021/06/548fadea-1d56-4bb1-a686-bc93b58572ee-adsl-i-vdsl-internet.jpg', 27),
	(26, 'static/uploads/2021/06/0c28c563-6fda-49ef-bcb7-f51a6c02fcaf-adsl-i-vdsl-internet.jpg', 28),
	(27, 'static/uploads/2021/06/564a1f83-79ed-4ffb-ae90-e954608f66c5-adsl-i-vdsl-internet.jpg', 29),
	(28, 'static/uploads/2021/06/2d792553-f49a-4589-b697-616f77c4a3eb-adsl-i-vdsl-internet.jpg', 30),
	(29, 'static/uploads/2021/06/ece655a2-ae4a-4e3d-93d6-11216be81c31-adsl-i-vdsl-internet.jpg', 31),
	(30, 'static/uploads/2021/06/bd029f91-81ed-4c8d-875d-041724fefb87-adsl-i-vdsl-internet.jpg', 32);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

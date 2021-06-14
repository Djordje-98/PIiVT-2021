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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`) VALUES
	(9, 'HDD'),
	(1, 'Operativni sistem'),
	(11, 'Ports'),
	(3, 'Racunarski softver'),
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
	(4, 'Izdavaz 4', 3),
	(5, 'Linux', 1),
	(2, 'Mac os', 1),
	(3, 'Produkciona kuca', 3),
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `laptop` DISABLE KEYS */;
INSERT INTO `laptop` (`laptop_id`, `created_at`, `title`, `description`, `price`) VALUES
	(19, '2021-06-04 12:15:27', 'Laptop Dell2', 'Ovo je neki opis3', 45.87),
	(20, '2021-06-04 12:19:47', 'Laptop Dell3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio lorem, hendrerit id nibh vel, sollicitudin molestie nunc. Vestibulum faucibus arcu sapien, id lobortis odio tincidunt quis. Nunc luctus cursus sapien, sit amet porttitor nibh cursus id. Donec venenatis erat eu est imperdiet mollis. Phasellus et congue est. Praesent et velit non risus blandit molestie et at libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Nunc ac lectus et erat maximus consectetur.', 45.87),
	(21, '2021-06-04 12:19:53', 'Laptop Dell4', 'Ovo je neki opis3', 45.87);
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `laptop_feature` DISABLE KEYS */;
INSERT INTO `laptop_feature` (`laptop_feature_id`, `value`, `laptop_id`, `feature_id`) VALUES
	(43, '10', 19, 1),
	(44, '2020', 19, 2),
	(45, 'ACME', 20, 1),
	(46, '2020', 20, 2),
	(47, 'ACME', 21, 1),
	(48, '2020', 21, 2);
/*!40000 ALTER TABLE `laptop_feature` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `laptop_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `fk_photo_laptop_id` (`laptop_id`),
  CONSTRAINT `fk_photo_laptop_id` FOREIGN KEY (`laptop_id`) REFERENCES `laptop` (`laptop_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `laptop_id`) VALUES
	(15, 'static/uploads/2021/06/a717752b-9bd7-4eb4-b150-5b966d8674a2-adsl-i-vdsl-internet.jpg', 20),
	(16, 'static/uploads/2021/06/23c7ba71-b504-4456-b646-9798550cbbe3-adsl-i-vdsl-internet.jpg', 21),
	(17, 'static/uploads/2021/06/a8632b69-dc37-4164-8112-d17475b950dc-adsl-i-vdsl-internet.jpg', 19),
	(18, 'static/uploads/2021/06/6edf0ba3-0050-4865-ae57-6b4c5390a8ab-slika2.jpg', 19),
	(19, 'static/uploads/2021/06/6208ac54-e23b-475b-93dc-3ff39ca85eca-slika2.jpg', 19),
	(20, 'static/uploads/2021/06/f469b7b8-eca0-42f3-a366-d11f093e0fb8-slika2.jpg', 19);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

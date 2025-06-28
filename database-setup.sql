-- SOA Sales Database Setup Script
-- Execute this script in your MySQL database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS soa_sales;
USE soa_sales;

-- Create sales table
CREATE TABLE IF NOT EXISTS `tbl_sales` (
  `sale_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `partner_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`sale_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create sale details table
CREATE TABLE IF NOT EXISTS `tbl_sale_details` (
  `sale_detail_id` int NOT NULL AUTO_INCREMENT,
  `sale_id` int DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`sale_detail_id`),
  KEY `fk_sale_details_sale` (`sale_id`),
  KEY `idx_ticket_id` (`ticket_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_deleted` (`deleted`),
  CONSTRAINT `fk_sale_details_sale` FOREIGN KEY (`sale_id`) REFERENCES `tbl_sales` (`sale_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create users table (if it doesn't exist) - for reference
CREATE TABLE IF NOT EXISTS `tbl_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create partners table (if it doesn't exist) - for reference
CREATE TABLE IF NOT EXISTS `tbl_partners` (
  `partner_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`partner_id`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert sample data
INSERT INTO `tbl_users` (`name`, `email`) VALUES
('Juan Pérez', 'juan@example.com'),
('María García', 'maria@example.com'),
('Carlos López', 'carlos@example.com');

INSERT INTO `tbl_partners` (`name`, `email`) VALUES
('Eventos ABC', 'info@eventosabc.com'),
('Producciones XYZ', 'contacto@produccionesxyz.com'),
('Show Center', 'ventas@showcenter.com');

-- Insert sample sales
INSERT INTO `tbl_sales` (`user_id`, `partner_id`, `total_amount`) VALUES
(1, 1, 150.00),
(2, 2, 200.00),
(3, 3, 300.00);

-- Insert sample sale details
INSERT INTO `tbl_sale_details` (`sale_id`, `ticket_id`, `amount`) VALUES
(1, 101, 75.00),
(1, 102, 75.00),
(2, 201, 100.00),
(2, 202, 100.00),
(3, 301, 150.00),
(3, 302, 150.00);

-- Create indexes for better performance
CREATE INDEX idx_sales_user_id ON tbl_sales(user_id);
CREATE INDEX idx_sales_partner_id ON tbl_sales(partner_id);
CREATE INDEX idx_sales_total_amount ON tbl_sales(total_amount);
CREATE INDEX idx_sales_created_at ON tbl_sales(created_at);

CREATE INDEX idx_sale_details_sale_id ON tbl_sale_details(sale_id);
CREATE INDEX idx_sale_details_ticket_id ON tbl_sale_details(ticket_id);
CREATE INDEX idx_sale_details_amount ON tbl_sale_details(amount);

-- Show table structure
DESCRIBE tbl_sales;
DESCRIBE tbl_sale_details;

-- Show sample data
SELECT 
  s.sale_id,
  s.user_id,
  s.partner_id,
  s.total_amount,
  s.created_at,
  COUNT(sd.sale_detail_id) as detail_count
FROM tbl_sales s
LEFT JOIN tbl_sale_details sd ON s.sale_id = sd.sale_id
GROUP BY s.sale_id; 
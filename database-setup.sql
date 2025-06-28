-- SOA Tickets Database Setup Script
-- Execute this script in your MySQL database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS soa_tickets;
USE soa_tickets;

-- Create tickets table
CREATE TABLE IF NOT EXISTS `tbl_tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `event_location_id` int DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `used_at` datetime DEFAULT NULL,
  `is_used` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`ticket_id`),
  KEY `event_location_id` (`event_location_id`),
  CONSTRAINT `tbl_tickets_ibfk_1` FOREIGN KEY (`event_location_id`) REFERENCES `tbl_event_locations` (`event_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create event locations table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS `tbl_event_locations` (
  `event_location_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text,
  `capacity` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`event_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create users table (if it doesn't exist)
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

-- Insert sample data
INSERT INTO `tbl_users` (`name`, `email`) VALUES
('Juan Pérez', 'juan@example.com'),
('María García', 'maria@example.com'),
('Carlos López', 'carlos@example.com');

-- Insert sample event location
INSERT INTO `tbl_event_locations` (`name`, `address`, `capacity`) VALUES
('Estadio Principal', 'Av. Principal 123, Ciudad', 50000),
('Teatro Municipal', 'Calle Teatro 456, Centro', 1000),
('Arena Deportiva', 'Boulevard Deportivo 789, Norte', 15000);

-- Create indexes for better performance
CREATE INDEX idx_tickets_code ON tbl_tickets(code);
CREATE INDEX idx_tickets_event_location ON tbl_tickets(event_location_id);
CREATE INDEX idx_tickets_is_used ON tbl_tickets(is_used);
CREATE INDEX idx_tickets_is_active ON tbl_tickets(is_active);
CREATE INDEX idx_tickets_deleted ON tbl_tickets(deleted);

-- Show table structure
DESCRIBE tbl_tickets;
DESCRIBE tbl_event_locations;

-- Show sample data
SELECT * FROM tbl_event_locations; 
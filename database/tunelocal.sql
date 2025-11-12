-- TuneLocal Database Schema
-- Import this file into phpMyAdmin or MySQL

-- Create Database
CREATE DATABASE IF NOT EXISTS `tunelocal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tunelocal`;

-- Table structure for music library
CREATE TABLE IF NOT EXISTS `music_library` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `file_data` longblob NOT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `last_played` datetime DEFAULT NULL,
  `play_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_date_added` (`date_added`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for playlists
CREATE TABLE IF NOT EXISTS `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `type` enum('spotify','youtube') NOT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for saved songs/playlists
CREATE TABLE IF NOT EXISTS `saved_songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `type` enum('spotify','youtube') NOT NULL,
  `title` varchar(255) NOT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_date_added` (`date_added`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for settings/preferences
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('theme', 'dark'),
('storage_used', '0'),
('total_tracks', '0')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- Create views for statistics
CREATE OR REPLACE VIEW `library_stats` AS
SELECT 
    COUNT(*) as total_tracks,
    SUM(file_size) as total_size,
    MAX(date_added) as last_upload
FROM music_library;

COMMIT;

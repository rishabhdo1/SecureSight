-- Create database
CREATE DATABASE IF NOT EXISTS securesight;
USE securesight;

-- Create Camera table
CREATE TABLE IF NOT EXISTS Camera (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- Create Incident table
CREATE TABLE IF NOT EXISTS Incident (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cameraId INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    tsStart DATETIME NOT NULL,
    tsEnd DATETIME NOT NULL,
    thumbnailUrl TEXT NOT NULL,
    resolved BOOLEAN DEFAULT false,
    FOREIGN KEY (cameraId) REFERENCES Camera(id)
);

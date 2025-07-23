import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rishabh@5678",
  database: process.env.DB_NAME || "securesight",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Initialize database with schema and seed data
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection()

    try {
      // Create database if it doesn't exist
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)
      await connection.query(`USE ${dbConfig.database}`)

      // Create Camera table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS Camera (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL
        )
      `)

      // Create Incident table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS Incident (
          id INT PRIMARY KEY AUTO_INCREMENT,
          cameraId INT NOT NULL,
          type VARCHAR(255) NOT NULL,
          tsStart DATETIME NOT NULL,
          tsEnd DATETIME NOT NULL,
          thumbnailUrl TEXT NOT NULL,
          resolved BOOLEAN DEFAULT false,
          FOREIGN KEY (cameraId) REFERENCES Camera(id)
        )
      `)

      // Check if data exists, if not seed it
      const [cameraRows] = await connection.execute("SELECT COUNT(*) as count FROM Camera")
      const cameraCount = (cameraRows as any[])[0].count

      if (cameraCount === 0) {
        // Insert seed cameras
        const cameras = [
          ["Shop Floor", "Main retail area"],
          ["Vault", "Secure storage room"],
          ["Entrance", "Main building entrance"],
          ["Parking Lot", "External parking area"],
          ["Loading Dock", "Goods receiving area"],
        ]

        for (const [name, location] of cameras) {
          await connection.execute("INSERT INTO Camera (name, location) VALUES (?, ?)", [name, location])
        }

        // Insert seed incidents
        const incidents = [
          [
            1,
            "Unauthorized Access",
            "2024-01-15 02:15:00",
            "2024-01-15 02:18:00",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
            false,
          ],
          [
            3,
            "Face Recognised",
            "2024-01-15 08:30:00",
            "2024-01-15 08:32:00",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
            false,
          ],
          [
            2,
            "Gun Threat",
            "2024-01-15 14:45:00",
            "2024-01-15 14:47:00",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
            false,
          ],
          [
            1,
            "Suspicious Activity",
            "2024-01-15 16:20:00",
            "2024-01-15 16:25:00",
            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
            false,
          ],
          [
            4,
            "Unauthorized Access",
            "2024-01-15 19:10:00",
            "2024-01-15 19:12:00",
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
            false,
          ],
          [
            3,
            "Face Recognised",
            "2024-01-15 21:35:00",
            "2024-01-15 21:36:00",
            "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
            true,
          ],
          [
            5,
            "Suspicious Activity",
            "2024-01-15 23:45:00",
            "2024-01-15 23:50:00",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
            false,
          ],
          [
            2,
            "Gun Threat",
            "2024-01-16 01:20:00",
            "2024-01-16 01:23:00",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
            false,
          ],
          [
            1,
            "Unauthorized Access",
            "2024-01-16 03:15:00",
            "2024-01-16 03:18:00",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
            false,
          ],
          [
            4,
            "Face Recognised",
            "2024-01-16 09:30:00",
            "2024-01-16 09:31:00",
            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
            true,
          ],
          [
            3,
            "Suspicious Activity",
            "2024-01-16 12:45:00",
            "2024-01-16 12:48:00",
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
            false,
          ],
          [
            5,
            "Gun Threat",
            "2024-01-16 15:20:00",
            "2024-01-16 15:22:00",
            "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
            false,
          ],
          [
            2,
            "Unauthorized Access",
            "2024-01-16 18:10:00",
            "2024-01-16 18:13:00",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
            false,
          ],
          [
            1,
            "Face Recognised",
            "2024-01-16 20:25:00",
            "2024-01-16 20:26:00",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
            false,
          ],
          [
            4,
            "Suspicious Activity",
            "2024-01-16 22:40:00",
            "2024-01-16 22:44:00",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
            false,
          ],
        ]

        for (const incident of incidents) {
          await connection.execute(
            "INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (?, ?, ?, ?, ?, ?)",
            incident,
          )
        }

        console.log("Database initialized with seed data")
      }
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// Get database connection
export async function getConnection() {
  return await pool.getConnection()
}

export default pool

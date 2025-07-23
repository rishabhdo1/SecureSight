import { type NextRequest, NextResponse } from "next/server"
import pool, { initializeDatabase } from "@/lib/database"
import type { Incident } from "@/lib/types"

// Initialize database on first request
let isInitialized = false

export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isInitialized) {
      await initializeDatabase()
      isInitialized = true
    }

    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get("resolved")

    let query = `
      SELECT 
        i.*,
        c.name as cameraName,
        c.location as cameraLocation
      FROM Incident i
      JOIN Camera c ON i.cameraId = c.id
    `

    const params: any[] = []

    if (resolved !== null) {
      query += " WHERE i.resolved = ?"
      params.push(resolved === "true")
    }

    query += " ORDER BY i.tsStart DESC"

    const connection = await pool.getConnection()

    try {
      const [rows] = await connection.execute(query, params)
      const incidents = rows as Incident[]

      return NextResponse.json(incidents)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}

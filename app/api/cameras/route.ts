import { NextResponse } from "next/server"
import pool from "@/lib/database"
import type { Camera } from "@/lib/types"

export async function GET() {
  try {
    const connection = await pool.getConnection()

    try {
      const [rows] = await connection.execute("SELECT * FROM Camera ORDER BY id")
      const cameras = rows as Camera[]

      return NextResponse.json(cameras)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error fetching cameras:", error)
    return NextResponse.json({ error: "Failed to fetch cameras" }, { status: 500 })
  }
}

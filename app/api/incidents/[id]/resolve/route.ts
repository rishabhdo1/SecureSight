import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/database"


export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const { params } = context
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid incident ID" }, { status: 400 })
  }

  try {
    const connection = await pool.getConnection()

    try {
      const [currentRows] = await connection.execute("SELECT * FROM Incident WHERE id = ?", [id])
      const currentIncident = (currentRows as any[])[0]

      if (!currentIncident) {
        return NextResponse.json({ error: "Incident not found" }, { status: 404 })
      }

      const newResolvedStatus = !currentIncident.resolved

      await connection.execute("UPDATE Incident SET resolved = ? WHERE id = ?", [newResolvedStatus, id])

      const [updatedRows] = await connection.execute(
        `
        SELECT 
          i.*,
          c.name as cameraName,
          c.location as cameraLocation
        FROM Incident i
        JOIN Camera c ON i.cameraId = c.id
        WHERE i.id = ?
        `,
        [id],
      )

      const updatedIncident = (updatedRows as any[])[0]
      return NextResponse.json(updatedIncident)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 })
  }
}

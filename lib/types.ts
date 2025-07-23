export interface Camera {
  id: number
  name: string
  location: string
}

export interface Incident {
  id: number
  cameraId: number
  type: string
  tsStart: string
  tsEnd: string
  thumbnailUrl: string
  resolved: boolean
  cameraName?: string
  cameraLocation?: string
}

export type IncidentType = "Unauthorized Access" | "Gun Threat" | "Face Recognised" | "Suspicious Activity"

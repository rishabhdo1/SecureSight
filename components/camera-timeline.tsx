"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import type { Incident, Camera } from "@/lib/types"

interface CameraTimelineProps {
  incidents: Incident[]
  cameras: Camera[]
  onIncidentSelect: (incident: Incident) => void
  selectedIncident: Incident | null
}

export default function CameraTimeline({
  incidents,
  cameras,
  onIncidentSelect,
  selectedIncident,
}: CameraTimelineProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timelineHours] = useState(Array.from({ length: 24 }, (_, i) => i))

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "Gun Threat":
        return "bg-red-500"
      case "Unauthorized Access":
        return "bg-orange-500"
      case "Face Recognised":
        return "bg-blue-500"
      case "Suspicious Activity":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getIncidentPosition = (timestamp: string) => {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return ((hours * 60 + minutes) / (24 * 60)) * 100
  }

  const getIncidentWidth = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    return Math.max((durationMinutes / (24 * 60)) * 100, 0.5) // Minimum width for visibility
  }

  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, "0") + ":00"
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  // Filter incidents for selected date
  const dayIncidents = incidents.filter((incident) => {
    const incidentDate = new Date(incident.tsStart)
    return incidentDate.toDateString() === selectedDate.toDateString()
  })

  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <div className="p-4">
        {/* Timeline Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Camera Timeline</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigateDate("prev")}
                className="text-white hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(selectedDate)}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigateDate("next")}
                className="text-white hover:bg-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Unauthorized Access</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Gun Threat</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Face Recognition</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Suspicious Activity</span>
            </div>
          </div>
        </div>

        {/* Time Scale */}
        <div className="relative mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            {timelineHours
              .filter((_, i) => i % 3 === 0)
              .map((hour) => (
                <span key={hour}>{formatHour(hour)}</span>
              ))}
          </div>
          <div className="h-px bg-gray-600 relative">
            {timelineHours.map((hour) => (
              <div
                key={hour}
                className="absolute top-0 w-px h-2 bg-gray-500"
                style={{ left: `${(hour / 24) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Camera Rows */}
        <div className="space-y-3">
          {cameras.map((camera) => {
            const cameraIncidents = dayIncidents.filter((incident) => incident.cameraId === camera.id)

            return (
              <div key={camera.id} className="flex items-center gap-4">
                {/* Camera Label */}
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-medium text-white">Camera - {camera.id.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-400">{camera.name}</div>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 relative h-8 bg-gray-800 rounded">
                  {cameraIncidents.map((incident) => (
                    <button
                      key={incident.id}
                      className={`absolute top-1 h-6 rounded ${getIncidentColor(incident.type)} 
                        hover:opacity-80 transition-opacity cursor-pointer
                        ${selectedIncident?.id === incident.id ? "ring-2 ring-white" : ""}
                      `}
                      style={{
                        left: `${getIncidentPosition(incident.tsStart)}%`,
                        width: `${getIncidentWidth(incident.tsStart, incident.tsEnd)}%`,
                      }}
                      onClick={() => onIncidentSelect(incident)}
                      title={`${incident.type} - ${new Date(incident.tsStart).toLocaleTimeString()}`}
                    />
                  ))}

                  {/* Current Time Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-yellow-400"
                    style={{ left: `${((new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60)) * 100}%` }}
                  />
                </div>

                {/* Incident Count */}
                <div className="w-8 text-center">
                  <span className="text-xs text-gray-400">{cameraIncidents.length}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Shield, Eye, Activity, ChevronRight } from "lucide-react"
import type { Incident } from "@/lib/types"

interface IncidentListProps {
  incidents: Incident[]
  selectedIncident: Incident | null
  onIncidentSelect: (incident: Incident) => void
  onResolveIncident: (id: number) => void
}

export default function IncidentList({
  incidents,
  selectedIncident,
  onIncidentSelect,
  onResolveIncident,
}: IncidentListProps) {
  const [resolvingIds, setResolvingIds] = useState<Set<number>>(new Set())

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "Gun Threat":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "Unauthorized Access":
        return <Shield className="w-4 h-4 text-orange-400" />
      case "Face Recognised":
        return <Eye className="w-4 h-4 text-blue-400" />
      case "Suspicious Activity":
        return <Activity className="w-4 h-4 text-green-400" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case "Gun Threat":
        return "text-red-400"
      case "Unauthorized Access":
        return "text-orange-400"
      case "Face Recognised":
        return "text-blue-400"
      case "Suspicious Activity":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleResolve = async (id: number) => {
    setResolvingIds((prev) => new Set(prev).add(id))
    try {
      await onResolveIncident(id)
    } finally {
      setResolvingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Separate unresolved and resolved incidents
  const unresolvedIncidents = incidents.filter((i) => !i.resolved)
  const resolvedIncidents = incidents.filter((i) => i.resolved)

  return (
    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
      {/* Unresolved Incidents */}
      <div className="space-y-2">
        {unresolvedIncidents.map((incident) => (
          <Card
            key={incident.id}
            className={`p-3 cursor-pointer transition-all duration-200 bg-gray-700 border-gray-600 hover:bg-gray-600
              ${selectedIncident?.id === incident.id ? "ring-2 ring-blue-500 bg-gray-600" : ""}
              ${resolvingIds.has(incident.id) ? "animate-pulse" : ""}
            `}
            onClick={() => onIncidentSelect(incident)}
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="relative w-12 h-9 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={incident.thumbnailUrl || "/placeholder.svg"}
                  alt={`${incident.type} incident`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {getIncidentIcon(incident.type)}
                    <span className={`font-medium text-sm ${getIncidentTypeColor(incident.type)}`}>
                      {incident.type}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResolve(incident.id)
                    }}
                    disabled={resolvingIds.has(incident.id)}
                    className="text-xs bg-transparent border-gray-500 text-gray-300 hover:bg-gray-600 h-6 px-2"
                  >
                    Resolve <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                <div className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Shop Floor Camera A</span>
                </div>

                <div className="text-xs text-gray-400">{formatTime(incident.tsStart)} on 7-Jul-2025</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resolved Incidents */}
      {resolvedIncidents.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400 font-medium">Resolved</div>
          {resolvedIncidents.map((incident) => (
            <Card
              key={incident.id}
              className="p-3 cursor-pointer bg-gray-800 border-gray-600 opacity-60 hover:opacity-80"
              onClick={() => onIncidentSelect(incident)}
            >
              <div className="flex gap-3">
                <div className="relative w-12 h-9 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={incident.thumbnailUrl || "/placeholder.svg"}
                    alt={`${incident.type} incident`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getIncidentIcon(incident.type)}
                      <span className={`font-medium text-sm ${getIncidentTypeColor(incident.type)}`}>
                        {incident.type}
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 mb-1">
                    <span className="font-medium">{incident.cameraName}</span>
                  </div>

                  <div className="text-xs text-gray-500">{formatTime(incident.tsStart)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {incidents.length === 0 && (
        <Card className="p-8 text-center bg-gray-800 border-gray-600">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="font-medium mb-2 text-white">All Clear!</h3>
          <p className="text-sm text-gray-400">No active incidents to display</p>
        </Card>
      )}
    </div>
  )
}

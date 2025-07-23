"use client"

import { useState, useEffect } from "react"
import { Shield, Activity, AlertTriangle, Users, CameraIcon, Layers, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import IncidentPlayer from "@/components/incident-player"
import IncidentList from "@/components/incident-list"
import CameraTimeline from "@/components/camera-timeline"
import type { Incident, Camera } from "@/lib/types"

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchIncidents(), fetchCameras()]).then(() => setLoading(false))
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch("/api/incidents")
      const data = await response.json()
      setIncidents(data)

      // Auto-select first unresolved incident
      const firstUnresolved = data.find((incident: Incident) => !incident.resolved)
      if (firstUnresolved) {
        setSelectedIncident(firstUnresolved)
      }
    } catch (error) {
      console.error("Error fetching incidents:", error)
    }
  }

  const fetchCameras = async () => {
    try {
      const response = await fetch("/api/cameras")
      const data = await response.json()
      setCameras(data)
    } catch (error) {
      console.error("Error fetching cameras:", error)
    }
  }

  const handleResolveIncident = async (id: number) => {
    try {
      const response = await fetch(`/api/incidents/${id}/resolve`, {
        method: "PATCH",
      })

      if (response.ok) {
        const updatedIncident = await response.json()

        // Update incidents list
        setIncidents((prev) => prev.map((incident) => (incident.id === id ? updatedIncident : incident)))

        // If the resolved incident was selected, select next unresolved
        if (selectedIncident?.id === id) {
          const nextUnresolved = incidents.find((incident) => incident.id !== id && !incident.resolved)
          setSelectedIncident(nextUnresolved || null)
        }
      }
    } catch (error) {
      console.error("Error resolving incident:", error)
    }
  }

  const unresolvedCount = incidents.filter((i) => !i.resolved).length
  const resolvedCount = incidents.filter((i) => i.resolved).length
  const criticalCount = incidents.filter(
    (i) => !i.resolved && (i.type === "Gun Threat" || i.type === "Unauthorized Access"),
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading SecureSight...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-500" />
                <div>
                  <h1 className="text-xl font-bold text-white">SECURESIGHT</h1>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-6">
                <Button variant="ghost" className="text-yellow-400 hover:bg-gray-700">
                  <Layers className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700">
                  <CameraIcon className="w-4 h-4 mr-2" />
                  Cameras
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700">
                  <Activity className="w-4 h-4 mr-2" />
                  Scenes
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Incidents
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
              </nav>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" className="text-gray-300">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">MA</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="text-white">Mohammed Afnan</div>
                  <div className="text-gray-400 text-xs">admin@securesight.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Camera Grid (Optional) */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="space-y-3">
            {cameras.slice(0, 6).map((camera) => (
              <div key={camera.id} className="relative">
                <div className="aspect-video bg-gray-700 rounded overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Camera - {camera.id.toString().padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Main Video */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <IncidentPlayer incident={selectedIncident} />
          </div>

          {/* Timeline */}
          <div className="h-48 border-t border-gray-700">
            <CameraTimeline
              incidents={incidents}
              cameras={cameras}
              onIncidentSelect={setSelectedIncident}
              selectedIncident={selectedIncident}
            />
          </div>
        </div>

        {/* Right Panel - Incidents */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-lg font-semibold">{unresolvedCount} Unresolved Incidents</span>
            </div>
            <div className="text-sm text-gray-400 mb-4">{resolvedCount} resolved incidents</div>
          </div>

          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncident}
            onResolveIncident={handleResolveIncident}
          />
        </div>
      </main>
    </div>
  )
}

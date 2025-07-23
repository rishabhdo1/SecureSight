"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Incident } from "@/lib/types"

interface IncidentPlayerProps {
  incident: Incident | null
}

export default function IncidentPlayer({ incident }: IncidentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(50)

  if (!incident) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-white/60">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
            <Play className="w-8 h-8" />
          </div>
          <p>Select an incident to view footage</p>
        </div>
      </div>
    )
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case "Gun Threat":
        return "bg-red-500/90"
      case "Unauthorized Access":
        return "bg-orange-500/90"
      case "Face Recognised":
        return "bg-blue-500/90"
      case "Suspicious Activity":
        return "bg-yellow-500/90"
      default:
        return "bg-gray-500/90"
    }
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Main Video Display */}
      <div className="relative w-full h-full">
        <Image
          src={incident.thumbnailUrl || "/placeholder.svg"}
          alt={`${incident.type} incident`}
          fill
          className="object-cover"
        />

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30 border-2 border-white/50"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
          </Button>
        </div>

        {/* Top Left - Incident Info */}
        <div className="absolute top-6 left-6 space-y-3">
          <Badge className={`${getIncidentTypeColor(incident.type)} text-white border-0 px-3 py-1`}>
            {incident.type}
          </Badge>
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="font-semibold">{incident.cameraName}</div>
            <div className="text-sm text-white/80">{incident.cameraLocation}</div>
          </div>
        </div>

        {/* Top Right - Timestamp */}
        <div className="absolute top-6 right-6">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-sm">
              {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
            </div>
          </div>
        </div>

        {/* Bottom Left - Camera Label */}
        <div className="absolute bottom-20 left-6">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-sm font-medium">Camera - {incident.cameraId.toString().padStart(2, "0")}</div>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="flex items-center gap-4">
          {/* Play Controls */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-white text-sm">03:12</span>
            <Slider
              value={[currentTime]}
              onValueChange={(value) => setCurrentTime(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-white text-sm">37:05</span>
          </div>

          {/* Volume and Fullscreen */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-20"
            />
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

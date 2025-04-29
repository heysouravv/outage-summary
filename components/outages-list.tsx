"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Outage } from "@/components/outage-dashboard"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface OutagesListProps {
  outages: Outage[]
  onOutageSelect: (outage: Outage) => void
  selectedOutageId?: string
}

export function OutagesList({ outages, onOutageSelect, selectedOutageId }: OutagesListProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusIcon = (status: Outage["status"]) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "investigating":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusText = (status: Outage["status"]) => {
    switch (status) {
      case "active":
        return "Active"
      case "investigating":
        return "Investigating"
      case "resolved":
        return "Resolved"
    }
  }

  const getStatusColor = (status: Outage["status"]) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800 border-red-200"
      case "investigating":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Outage Events</h2>
        <p className="text-sm text-muted-foreground">
          {outages.filter((o) => o.status !== "resolved").length} active issues
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {outages.map((outage) => (
            <div
              key={outage.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedOutageId === outage.id ? "bg-muted" : "hover:bg-muted/50"
              }`}
              onClick={() => onOutageSelect(outage)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate">{outage.service}</h3>
                <Badge variant="outline" className={`${getStatusColor(outage.status)} flex items-center gap-1`}>
                  {getStatusIcon(outage.status)}
                  {getStatusText(outage.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{outage.description}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Started: {formatTime(outage.startTime)}</span>
                <span className="mx-1">•</span>
                <span>{outage.affectedAreas.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

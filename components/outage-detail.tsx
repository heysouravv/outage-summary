"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AIChatInterface } from "@/components/ai-chat-interface"
import { AppointmentScheduler } from "@/components/appointment-scheduler"
import type { Outage, Technician } from "@/components/outage-dashboard"
import { AlertTriangle, Calendar, CheckCircle, Clock, MessageSquare, X } from "lucide-react"

interface OutageDetailProps {
  outage: Outage
  technicians: Technician[]
  onClose: () => void
  onAppointmentScheduled: (technicianId: string, date: Date, timeSlot: string) => void
}

export function OutageDetail({ outage, technicians, onClose, onAppointmentScheduled }: OutageDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatDateTime = (date: Date) => {
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: Outage["status"]) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "investigating":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getStatusText = (status: Outage["status"]) => {
    switch (status) {
      case "active":
        return "Active Outage"
      case "investigating":
        return "Under Investigation"
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
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden w-full h-full">
      <div className="flex items-center justify-between p-4 border-b border-border bg-background w-full">
        <div className="flex items-center gap-3">
          {getStatusIcon(outage.status)}
          <div>
            <h2 className="text-lg font-semibold">{outage.service}</h2>
            <Badge variant="outline" className={getStatusColor(outage.status)}>
              {getStatusText(outage.status)}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full h-full">
        <div className="border-b border-border bg-background w-full">
          <TabsList className="mx-4 my-1 w-[calc(100%-2rem)] grid grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center justify-center">
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Technician
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 p-4 overflow-auto w-full">
          <ScrollArea className="h-full w-full">
            <div className="space-y-6 w-full max-w-5xl mx-auto">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Outage Details</CardTitle>
                  <CardDescription>Started at {formatDateTime(outage.startTime)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <p>{outage.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Affected Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {outage.affectedAreas.map((area) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {outage.estimatedResolution && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Resolution</h3>
                        <p>{formatDateTime(outage.estimatedResolution)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Updates Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outage.updates.map((update, index) => (
                      <div key={index} className="relative pl-6 pb-4">
                        {index !== outage.updates.length - 1 && (
                          <div className="absolute top-2 left-[9px] bottom-0 w-[2px] bg-border" />
                        )}
                        <div className="absolute top-2 left-0 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{formatDateTime(update.time)}</p>
                          <p>{update.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 p-0 overflow-hidden w-full h-full">
          <AIChatInterface outage={outage} />
        </TabsContent>

        <TabsContent value="schedule" className="flex-1 p-0 overflow-hidden w-full h-full">
          <AppointmentScheduler
            outage={outage}
            technicians={technicians}
            onAppointmentScheduled={onAppointmentScheduled}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

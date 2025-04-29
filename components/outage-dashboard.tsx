"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { OutagesList } from "@/components/outages-list"
import { OutageDetail } from "@/components/outage-detail"
import { useToast } from "@/hooks/use-toast"

export type Outage = {
  id: string
  service: string
  startTime: Date
  status: "active" | "investigating" | "resolved"
  description: string
  affectedAreas: string[]
  estimatedResolution?: Date
  updates: {
    time: Date
    message: string
  }[]
}

export type Technician = {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  distance: number // in miles
  availability: {
    date: Date
    slots: string[]
  }[]
}

// Sample data
const outages: Outage[] = [
  {
    id: "out-1",
    service: "Cloud Storage Service",
    startTime: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    status: "active",
    description: "Intermittent access issues affecting Cloud Storage in US-East region",
    affectedAreas: ["US-East", "US-Central"],
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 2),
        message: "Issue identified: Network routing problem detected",
      },
      {
        time: new Date(Date.now() - 3600000),
        message: "Engineers deployed to resolve network routing issues",
      },
    ],
  },
  {
    id: "out-2",
    service: "Authentication API",
    startTime: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    status: "investigating",
    description: "Users experiencing delayed authentication responses",
    affectedAreas: ["Global"],
    estimatedResolution: new Date(Date.now() + 3600000), // 1 hour from now
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 5),
        message: "Increased latency detected in authentication services",
      },
      {
        time: new Date(Date.now() - 3600000 * 3),
        message: "Root cause identified as database connection pool saturation",
      },
      {
        time: new Date(Date.now() - 3600000 * 1),
        message: "Implementing connection pool optimizations",
      },
    ],
  },
  {
    id: "out-3",
    service: "Payment Processing",
    startTime: new Date(Date.now() - 3600000 * 12), // 12 hours ago
    status: "resolved",
    description: "Payment transactions failing for European customers",
    affectedAreas: ["Europe"],
    estimatedResolution: new Date(Date.now() - 3600000), // 1 hour ago
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 12),
        message: "Payment failures reported by European customers",
      },
      {
        time: new Date(Date.now() - 3600000 * 8),
        message: "Issue traced to third-party payment gateway",
      },
      {
        time: new Date(Date.now() - 3600000 * 4),
        message: "Working with payment provider to restore service",
      },
      {
        time: new Date(Date.now() - 3600000 * 1),
        message: "Service fully restored, monitoring for stability",
      },
    ],
  },
  {
    id: "out-4",
    service: "Content Delivery Network",
    startTime: new Date(Date.now() - 3600000 * 1), // 1 hour ago
    status: "active",
    description: "Increased latency affecting media delivery in Asia-Pacific region",
    affectedAreas: ["Asia-Pacific"],
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 1),
        message: "Latency spikes detected in APAC edge locations",
      },
      {
        time: new Date(Date.now() - 1800000), // 30 minutes ago
        message: "Traffic rerouting in progress to mitigate impact",
      },
    ],
  },
]

const technicians: Technician[] = [
  {
    id: "tech-1",
    name: "Alex Johnson",
    location: {
      lat: 37.7749,
      lng: -122.4194,
    },
    distance: 5.2,
    availability: [
      {
        date: new Date(Date.now() + 86400000), // tomorrow
        slots: ["09:00", "11:00", "14:00", "16:00"],
      },
      {
        date: new Date(Date.now() + 86400000 * 2), // day after tomorrow
        slots: ["10:00", "13:00", "15:00"],
      },
    ],
  },
  {
    id: "tech-2",
    name: "Samantha Lee",
    location: {
      lat: 37.3382,
      lng: -121.8863,
    },
    distance: 12.7,
    availability: [
      {
        date: new Date(Date.now() + 86400000), // tomorrow
        slots: ["08:00", "10:00", "15:00"],
      },
      {
        date: new Date(Date.now() + 86400000 * 2), // day after tomorrow
        slots: ["09:00", "11:00", "14:00", "16:00"],
      },
    ],
  },
  {
    id: "tech-3",
    name: "Marcus Chen",
    location: {
      lat: 37.4419,
      lng: -122.143,
    },
    distance: 8.3,
    availability: [
      {
        date: new Date(Date.now() + 86400000), // tomorrow
        slots: ["13:00", "15:00", "17:00"],
      },
      {
        date: new Date(Date.now() + 86400000 * 2), // day after tomorrow
        slots: ["08:00", "10:00", "12:00"],
      },
    ],
  },
]

export function OutageDashboard() {
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null)
  const { toast } = useToast()

  const handleOutageSelect = (outage: Outage) => {
    setSelectedOutage(outage)
  }

  const handleAppointmentScheduled = (technicianId: string, date: Date, timeSlot: string) => {
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment has been scheduled for ${date.toLocaleDateString()} at ${timeSlot}`,
    })
    setSelectedOutage(null)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b border-border h-14 flex items-center px-6">
            <h1 className="text-xl font-semibold">Outage Events Dashboard</h1>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <OutagesList outages={outages} onOutageSelect={handleOutageSelect} selectedOutageId={selectedOutage?.id} />
            {selectedOutage ? (
              <OutageDetail
                outage={selectedOutage}
                technicians={technicians}
                onClose={() => setSelectedOutage(null)}
                onAppointmentScheduled={handleAppointmentScheduled}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-2">Select an outage event</h2>
                  <p className="text-muted-foreground">
                    Click on an outage event to view details, chat with AI support, or schedule a technician
                    appointment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

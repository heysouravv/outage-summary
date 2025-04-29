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
    service: "Pump System",
    startTime: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    status: "active",
    description: "Main circulation pump failure in Building B. Pressure drop detected in primary cooling loop.",
    affectedAreas: ["Building B", "Production Line 3"],
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 2),
        message: "Issue identified: Pump failure detected with abnormal vibration patterns",
      },
      {
        time: new Date(Date.now() - 3600000),
        message: "Maintenance team dispatched to assess mechanical failure",
      },
    ],
  },
  {
    id: "out-2",
    service: "Actuator Control",
    startTime: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    status: "investigating",
    description: "Pneumatic actuator not responding to control signals on valve assembly V-103",
    affectedAreas: ["Chemical Processing Unit", "Valve Station 4"],
    estimatedResolution: new Date(Date.now() + 3600000), // 1 hour from now
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 5),
        message: "Actuator failure reported by operations team",
      },
      {
        time: new Date(Date.now() - 3600000 * 3),
        message: "Initial diagnosis indicates possible air supply issue or solenoid failure",
      },
      {
        time: new Date(Date.now() - 3600000 * 1),
        message: "Testing replacement solenoid valve and checking for air leaks",
      },
    ],
  },
  {
    id: "out-3",
    service: "Oil Containment",
    startTime: new Date(Date.now() - 3600000 * 8), // 8 hours ago
    status: "active",
    description: "Hydraulic oil leak detected at connection point on press machine P-201",
    affectedAreas: ["Manufacturing Floor", "Hydraulic System"],
    updates: [
      {
        time: new Date(Date.now() - 3600000 * 8),
        message: "Oil leak detected during routine inspection",
      },
      {
        time: new Date(Date.now() - 3600000 * 6),
        message: "Containment measures implemented, spill contained to immediate area",
      },
      {
        time: new Date(Date.now() - 3600000 * 4),
        message: "Maintenance team identified failed seal as source of leak",
      },
      {
        time: new Date(Date.now() - 3600000 * 2),
        message: "Replacement parts ordered, temporary repairs in place",
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
          <div className="flex-1 flex overflow-hidden w-full">
            <OutagesList outages={outages} onOutageSelect={handleOutageSelect} selectedOutageId={selectedOutage?.id} />
            {selectedOutage ? (
              <div className="flex-1 flex overflow-hidden">
                <OutageDetail
                  outage={selectedOutage}
                  technicians={technicians}
                  onClose={() => setSelectedOutage(null)}
                  onAppointmentScheduled={handleAppointmentScheduled}
                />
              </div>
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

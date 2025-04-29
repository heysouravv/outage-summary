"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Outage, Technician } from "@/components/outage-dashboard"
import { Calendar, CheckCircle, MapPin } from "lucide-react"

interface AppointmentSchedulerProps {
  outage: Outage
  technicians: Technician[]
  onAppointmentScheduled: (technicianId: string, date: Date, timeSlot: string) => void
}

export function AppointmentScheduler({ outage, technicians, onAppointmentScheduled }: AppointmentSchedulerProps) {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const handleSelectTechnician = (technician: Technician) => {
    setSelectedTechnician(technician)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
  }

  const handleSelectTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleScheduleAppointment = () => {
    if (selectedTechnician && selectedDate && selectedTimeSlot) {
      onAppointmentScheduled(selectedTechnician.id, selectedDate, selectedTimeSlot)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-border bg-background w-full">
        <h2 className="font-semibold">Schedule a Technician</h2>
        <p className="text-sm text-muted-foreground">Find available technicians near you to help resolve the issue</p>
      </div>

      <ScrollArea className="flex-1 p-4 w-full">
        <div className="w-full max-w-5xl mx-auto">
          <Tabs defaultValue="technicians" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technicians">Select Technician</TabsTrigger>
              <TabsTrigger value="date" disabled={!selectedTechnician}>
                Select Date
              </TabsTrigger>
              <TabsTrigger value="time" disabled={!selectedTechnician || !selectedDate}>
                Select Time
              </TabsTrigger>
            </TabsList>

            <TabsContent value="technicians" className="mt-4 w-full">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                {technicians.map((technician) => (
                  <Card
                    key={technician.id}
                    className={`cursor-pointer transition-all w-full ${
                      selectedTechnician?.id === technician.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleSelectTechnician(technician)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{technician.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {technician.distance.toFixed(1)} miles away
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        Available for {technician.availability.reduce((total, day) => total + day.slots.length, 0)} time
                        slots
                      </p>
                    </CardContent>
                    <CardFooter>
                      {selectedTechnician?.id === technician.id && (
                        <div className="text-sm text-primary flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Selected
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="date" className="mt-4 w-full">
              {selectedTechnician && (
                <div className="grid gap-4 md:grid-cols-2 w-full">
                  {selectedTechnician.availability.map((availDay, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all w-full ${
                        selectedDate?.toDateString() === availDay.date.toDateString()
                          ? "ring-2 ring-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleSelectDate(availDay.date)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(availDay.date)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{availDay.slots.length} available time slots</p>
                      </CardContent>
                      <CardFooter>
                        {selectedDate?.toDateString() === availDay.date.toDateString() && (
                          <div className="text-sm text-primary flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Selected
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="time" className="mt-4 w-full">
              {selectedTechnician && selectedDate && (
                <>
                  <Card className="mb-4 w-full">
                    <CardHeader>
                      <CardTitle>Select a Time Slot</CardTitle>
                      <CardDescription>
                        {formatDate(selectedDate)} with {selectedTechnician.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {selectedTechnician.availability
                          .find((a) => a.date.toDateString() === selectedDate.toDateString())
                          ?.slots.map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTimeSlot === slot ? "default" : "outline"}
                              className="justify-center"
                              onClick={() => handleSelectTimeSlot(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedTimeSlot && (
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>Appointment Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="font-medium">{outage.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Technician:</span>
                          <span className="font-medium">{selectedTechnician.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{selectedTimeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">
                            Your location ({selectedTechnician.distance.toFixed(1)} miles away)
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={handleScheduleAppointment}>
                          Confirm Appointment
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}

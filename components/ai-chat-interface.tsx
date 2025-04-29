"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { Outage } from "@/components/outage-dashboard"
import { Bot, Send, User } from "lucide-react"

interface AIChatInterfaceProps {
  outage: Outage
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatInterface({ outage }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your AI assistant for the "${outage.service}" outage. How can I help you today? You can ask about the current status, affected areas, or estimated resolution time.`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, outage)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-background">
        <h2 className="font-semibold">AI Support Chat</h2>
        <p className="text-sm text-muted-foreground">Ask questions about the outage and get immediate assistance</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant" ? "bg-primary/10 text-primary" : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className="flex-shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate AI responses based on user input
function generateAIResponse(input: string, outage: Outage): string {
  const inputLower = input.toLowerCase()

  if (inputLower.includes("status") || inputLower.includes("what's happening")) {
    return `The ${outage.service} is currently ${outage.status}. ${outage.updates[outage.updates.length - 1].message}`
  }

  if (inputLower.includes("affected") || inputLower.includes("impact") || inputLower.includes("area")) {
    return `This issue is affecting the following areas: ${outage.affectedAreas.join(", ")}. Operations in these areas may be disrupted until the issue is resolved.`
  }

  if (inputLower.includes("fix") || inputLower.includes("resolve") || inputLower.includes("when")) {
    if (outage.estimatedResolution) {
      return `We estimate the issue will be resolved by ${outage.estimatedResolution.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}. Our maintenance team is working diligently to restore normal operation as quickly as possible.`
    } else {
      return "Our maintenance team is actively working on resolving this issue. We don't have an estimated resolution time yet, but we'll update you as soon as we have more information."
    }
  }

  if (inputLower.includes("cause") || inputLower.includes("reason") || inputLower.includes("why")) {
    return `Based on our investigation, ${outage.updates.find((u) => u.message.toLowerCase().includes("identified"))?.message || "we're still investigating the root cause of this issue. Our technical team is performing diagnostics and working to identify the failure mode."}`
  }

  if (inputLower.includes("part") || inputLower.includes("replacement") || inputLower.includes("repair")) {
    if (outage.service.includes("Pump")) {
      return "The pump system may require replacement of the mechanical seal, bearings, or impeller depending on the exact nature of the failure. Our technicians will determine the necessary parts after their inspection."
    } else if (outage.service.includes("Actuator")) {
      return "The actuator issue may be related to the solenoid valve, air supply, or control signal. We're currently testing components to determine which parts need replacement."
    } else if (outage.service.includes("Oil")) {
      return "The oil leak appears to be caused by a failed seal. Replacement parts have been ordered and temporary containment measures are in place."
    }
    return "Our maintenance team will determine which parts need replacement after completing their diagnostic assessment."
  }

  if (inputLower.includes("update") || inputLower.includes("latest")) {
    const latestUpdate = outage.updates[outage.updates.length - 1]
    return `The latest update from our maintenance team (${latestUpdate.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}): ${latestUpdate.message}`
  }

  if (inputLower.includes("technician") || inputLower.includes("appointment") || inputLower.includes("schedule")) {
    return "You can schedule an appointment with a maintenance technician by clicking on the 'Schedule Technician' tab above. This will allow you to select from available technicians based on their location and availability."
  }

  if (inputLower.includes("safety") || inputLower.includes("hazard") || inputLower.includes("danger")) {
    if (outage.service.includes("Oil")) {
      return "The oil leak has been contained and does not present an immediate safety hazard. Standard safety protocols for working around hydraulic fluids should be observed in the affected area."
    }
    return "Our team has implemented appropriate safety measures for this issue. Always follow site safety protocols when in the affected areas."
  }

  return "I'm here to help with information about this equipment issue. You can ask about the current status, affected areas, estimated resolution time, or the latest updates. If you need hands-on assistance, you can also schedule an appointment with a technician."
}

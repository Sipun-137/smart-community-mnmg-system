/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface EventFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "18:00",
    location: "",
    eventType: "PUBLIC",
    maxParticipants: 50,
  })

  useEffect(() => {
    if (initialData) {
      const dateTime = new Date(initialData.dateTime)
      setFormData({
        title: initialData.title,
        description: initialData.description,
        date: dateTime,
        time: format(dateTime, "HH:mm"),
        location: initialData.location,
        eventType: initialData.eventType,
        maxParticipants: initialData.maxParticipants,
      })
    }
  }, [initialData])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Combine date and time into a single dateTime
    const [hours, minutes] = formData.time.split(":").map(Number)
    const dateTime = new Date(formData.date)
    dateTime.setHours(hours, minutes)

    onSubmit({
      title: formData.title,
      description: formData.description,
      dateTime: dateTime.toISOString(),
      location: formData.location,
      eventType: formData.eventType,
      maxParticipants: Number(formData.maxParticipants),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => handleChange("date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Event Type</Label>
        <RadioGroup
          value={formData.eventType}
          onValueChange={(value) => handleChange("eventType", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PUBLIC" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PRIVATE" id="private" />
            <Label htmlFor="private">Private</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="maxParticipants">Maximum Participants</Label>
        <Input
          id="maxParticipants"
          type="number"
          min="1"
          value={formData.maxParticipants}
          onChange={(e) => handleChange("maxParticipants", e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update Event" : "Create Event"}</Button>
      </div>
    </form>
  )
}


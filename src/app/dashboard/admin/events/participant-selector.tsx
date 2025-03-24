"use client"

import { useState } from "react"
import { Check, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface User {
  _id: string
  name: string
  email: string
}

interface ParticipantSelectorProps {
  users: User[]
  selectedUserIds: string[]
  maxParticipants: number
  isPrivate: boolean
  onSave: (selectedUserIds: string[]) => void
  onCancel: () => void
}

export function ParticipantSelector({
  users,
  selectedUserIds,
  maxParticipants,
  isPrivate,
  onSave,
  onCancel,
}: ParticipantSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedUserIds)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleUser = (userId: string) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter((id) => id !== userId))
    } else {
      if (selected.length < maxParticipants) {
        setSelected([...selected, userId])
      }
    }
  }

  const handleSave = () => {
    onSave(selected)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="px-2 py-1">
          {selected.length} / {maxParticipants} participants
        </Badge>
        {isPrivate && <Badge className="bg-purple-500 px-2 py-1">Private Event</Badge>}
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4 space-y-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer",
                  selected.includes(user._id) ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted",
                )}
                onClick={() => toggleUser(user._id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div>
                  {selected.includes(user._id) ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}


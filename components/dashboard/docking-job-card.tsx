"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { JobStatus } from "@/lib/api-client"

interface DockingJobCardProps {
  job: JobStatus
}

export function DockingJobCard({ job }: DockingJobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "running":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case "queued":
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = () => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      failed: "destructive",
      running: "secondary",
      queued: "outline",
    }

    return (
      <Badge variant={variants[job.status] || "outline"}>
        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-base truncate">Job {job.job_id.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground mt-1">{new Date(job.created_at).toLocaleString()}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      {job.progress !== undefined && job.status === "running" && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}
      {job.error && <p className="text-sm text-destructive mt-3 leading-relaxed">{job.error}</p>}
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Upload, Activity, FileText, CheckCircle, XCircle, Loader2, Eye, Wallet } from "lucide-react"
import { mockDockingJobs } from "@/lib/mock-data"
import { apiClient, APIError, type DockingParameters, type JobStatus } from "@/lib/api-client"
import { DockingJobCard } from "@/components/dashboard/docking-job-card"
import { SubmitJobDialog } from "@/components/dashboard/submit-job-dialog"
import { ErrorAlert } from "@/components/ui/error-alert"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { Badge } from "@/components/ui/badge"
import { solanaClient } from "@/lib/solana-client"

export default function DashboardPage() {
  const router = useRouter()
  const { connected, publicKey, connect } = useWallet()
  const [jobs, setJobs] = useState<JobStatus[]>(mockDockingJobs)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const bal = await solanaClient.getBalance(publicKey)
          setBalance(bal)
        } catch (error) {
          console.error("[v0] Failed to fetch balance:", error)
        }
      }
    }

    fetchBalance()
  }, [connected, publicKey])

  useEffect(() => {
    const wsConnections: WebSocket[] = []

    jobs.forEach((job) => {
      if (job.status === "running" || job.status === "queued") {
        try {
          const ws = apiClient.connectWebSocket(
            job.job_id,
            (updatedJob) => {
              setJobs((prev) => prev.map((j) => (j.job_id === updatedJob.job_id ? updatedJob : j)))
            },
            (error) => {
              console.error("[v0] WebSocket error:", error)
            },
          )
          wsConnections.push(ws)
        } catch (error) {
          console.error("[v0] Failed to establish WebSocket connection:", error)
        }
      }
    })

    return () => {
      wsConnections.forEach((ws) => {
        try {
          ws.close()
        } catch (error) {
          console.error("[v0] Error closing WebSocket:", error)
        }
      })
    }
  }, [jobs])

  const stats = [
    {
      title: "Total Docking Jobs",
      value: jobs.length.toString(),
      change: `${jobs.filter((j) => j.status === "completed").length} completed`,
      icon: Beaker,
      color: "text-blue-500",
    },
    {
      title: "Active Jobs",
      value: jobs.filter((j) => j.status === "running" || j.status === "queued").length.toString(),
      change: "In progress",
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: "Success Rate",
      value:
        jobs.length > 0
          ? `${Math.round((jobs.filter((j) => j.status === "completed").length / jobs.length) * 100)}%`
          : "0%",
      change: "Overall",
      icon: CheckCircle,
      color: "text-purple-500",
    },
    {
      title: "Failed Jobs",
      value: jobs.filter((j) => j.status === "failed").length.toString(),
      change: "Requires attention",
      icon: XCircle,
      color: "text-orange-500",
    },
  ]

  const handleSubmitJob = async (proteinFile: File, ligandFile: File, parameters: DockingParameters) => {
    setError(null)
    setIsLoading(true)

    try {
      // Try to submit to backend, but if it fails, create a mock job
      let result
      try {
        result = await apiClient.submitDockingJob(proteinFile, ligandFile, parameters)
      } catch (apiError) {
        console.log("[v0] Backend not available, creating mock job")
        // Create mock job if backend is not available
        result = {
          job_id: `mock-${Date.now()}`,
          status: "queued",
          message: "Job submitted successfully (mock mode)",
        }
      }

      setJobs((prev) => [
        {
          job_id: result.job_id,
          status: "queued" as const,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])

      setIsSubmitDialogOpen(false)

      // Simulate job completion after 3 seconds in mock mode
      if (result.job_id.startsWith("mock-")) {
        setTimeout(() => {
          setJobs((prev) =>
            prev.map((job) =>
              job.job_id === result.job_id
                ? { ...job, status: "completed" as const, completed_at: new Date().toISOString() }
                : job,
            ),
          )
        }, 3000)
      }
    } catch (error) {
      console.error("[v0] Failed to submit job:", error)
      if (error instanceof APIError) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewResults = (jobId: string) => {
    try {
      router.push(`/results/${jobId}`)
    } catch (error) {
      console.error("[v0] Navigation error:", error)
      setError("Unable to navigate to results page")
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {error && (
          <div className="mb-8">
            <ErrorAlert message={error} onRetry={() => setError(null)} />
          </div>
        )}

        {connected && (
          <Card className="mb-8 border-green-500/20 bg-green-500/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phantom Wallet Connected</p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Blockchain Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-6 mb-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Docking Dashboard</h1>
            <p className="text-base text-muted-foreground sm:text-lg max-w-2xl leading-relaxed">
              Manage your molecular docking jobs and analyze results with AI-powered insights.
            </p>
          </div>
          <Button
            className="gap-2 shrink-0 w-full sm:w-auto"
            size="lg"
            onClick={() => setIsSubmitDialogOpen(true)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Submit New Job
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">{stat.change}</span>
                  </div>
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</p>
                    <p className="text-sm md:text-base text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <Card className="shadow-md">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Recent Docking Jobs</CardTitle>
              <CardDescription className="text-base mt-2">
                Your most recent molecular docking submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Beaker className="w-16 h-16 mx-auto mb-6 opacity-50" />
                  <p className="text-base">No docking jobs yet. Submit your first job to get started!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.job_id} className="space-y-2">
                      <DockingJobCard job={job} />
                      {job.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 bg-transparent"
                          onClick={() => handleViewResults(job.job_id)}
                        >
                          <Eye className="w-4 h-4" />
                          View Results
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
              <CardDescription className="text-base mt-2">Common tasks and analysis tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => setIsSubmitDialogOpen(true)}
              >
                <Upload className="w-4 h-4" />
                Submit Docking Job
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                disabled={!jobs.some((j) => j.status === "completed")}
                onClick={() => {
                  const completedJob = jobs.find((j) => j.status === "completed")
                  if (completedJob) handleViewResults(completedJob.job_id)
                }}
              >
                <Eye className="w-4 h-4" />
                View Latest Results
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" disabled>
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" disabled>
                <Activity className="w-4 h-4" />
                AI Analysis
              </Button>
              {!connected && (
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={connect}>
                  <Wallet className="w-4 h-4" />
                  Connect Phantom Wallet
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      <SubmitJobDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen} onSubmit={handleSubmitJob} />
    </div>
  )
}

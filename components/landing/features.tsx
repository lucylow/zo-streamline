import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Experience blazing fast performance with our optimized infrastructure. Process thousands of tasks in seconds.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together seamlessly with real-time updates, shared workspaces, and integrated communication tools.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with industry standards. Your data is always protected.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get actionable insights with comprehensive analytics and customizable reporting dashboards.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 md:py-40">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 sm:mb-6 text-balance">
            Everything you need to succeed
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-2xl mx-auto text-pretty leading-relaxed">
            Powerful features designed to help your team work smarter, not harder
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

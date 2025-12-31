import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { StatsCounter } from "@/components/landing/stats-counter"
import { InteractiveDemo } from "@/components/landing/interactive-demo"
import { AIDemo } from "@/components/landing/ai-demo"
import { BlockchainDemo } from "@/components/landing/blockchain-demo"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PlayCircle, Brain, Eye, Shield, CheckCircle, Upload, Cpu, FileText } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  <StatsCounter end={1247} duration={2} />+
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">Docking Jobs Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-500 mb-2">
                  <StatsCounter end={892} duration={2} />+
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">Research Papers Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-500 mb-2">
                  <StatsCounter end={563} duration={2} />+
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">Active Researchers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">
                  <StatsCounter end={99.7} duration={2} decimals={1} />%
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        <Features />

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">How It Works</h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Simple three-step process from upload to insights
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              <Card className="text-center border-border">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">1. Upload Structures</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Upload your protein (PDB) and ligand (SDF) files. Our system validates and prepares structures
                    automatically.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">2. Run Docking & AI Analysis</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    GPU-accelerated docking followed by AI-powered analysis of results, binding interactions, and
                    drug-likeness.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">3. Generate Reports</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Create comprehensive reports with 3D visualizations and store verified results on the Solana
                    blockchain.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4 sm:mb-6">Interactive Demo</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Experience StreamLine in Action
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Try our platform with sample data. No registration required.
              </p>
            </div>

            <Tabs defaultValue="interactive" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                <TabsTrigger value="interactive" className="gap-2 text-sm sm:text-base">
                  <PlayCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Interactive</span> Demo
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2 text-sm sm:text-base">
                  <Brain className="w-4 h-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger value="visualization" className="gap-2 text-sm sm:text-base">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">3D</span> Viz
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="gap-2 text-sm sm:text-base">
                  <Shield className="w-4 h-4" />
                  Blockchain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interactive">
                <InteractiveDemo />
              </TabsContent>

              <TabsContent value="ai">
                <AIDemo />
              </TabsContent>

              <TabsContent value="visualization">
                <Card className="border-border">
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-4">3D Molecular Viewer</h3>
                        <p className="text-muted-foreground mb-6">
                          Explore protein-ligand interactions in real-time with our interactive 3D viewer.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base">Real-time rotation and zoom</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base">Interaction highlighting</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base">Multiple rendering styles</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base">Export high-resolution images</span>
                          </li>
                        </ul>
                      </div>

                      <div className="h-64 sm:h-80 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Eye className="w-12 h-12 text-primary mx-auto mb-4" />
                          <p className="text-muted-foreground">Interactive 3D visualization</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain">
                <BlockchainDemo />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

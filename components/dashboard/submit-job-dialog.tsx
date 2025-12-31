"use client"

import type React from "react"

import { useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { DockingParameters } from "@/lib/api-client"

interface SubmitJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (proteinFile: File, ligandFile: File, parameters: DockingParameters) => Promise<void>
}

export function SubmitJobDialog({ open, onOpenChange, onSubmit }: SubmitJobDialogProps) {
  const [proteinFile, setProteinFile] = useState<File | null>(null)
  const [ligandFile, setLigandFile] = useState<File | null>(null)
  const [exhaustiveness, setExhaustiveness] = useState([8])
  const [numModes, setNumModes] = useState([9])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateFile = (file: File, type: "protein" | "ligand"): boolean => {
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setValidationError(`${type === "protein" ? "Protein" : "Ligand"} file is too large (max 50MB)`)
      return false
    }

    if (type === "protein" && !file.name.endsWith(".pdb")) {
      setValidationError("Protein file must be in PDB format (.pdb)")
      return false
    }

    if (type === "ligand" && !file.name.match(/\.(sdf|mol2)$/i)) {
      setValidationError("Ligand file must be in SDF or MOL2 format")
      return false
    }

    return true
  }

  const handleProteinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && validateFile(file, "protein")) {
      setProteinFile(file)
      setValidationError(null)
    }
  }

  const handleLigandFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && validateFile(file, "ligand")) {
      setLigandFile(file)
      setValidationError(null)
    }
  }

  const handleSubmit = async () => {
    setValidationError(null)

    if (!proteinFile || !ligandFile) {
      setValidationError("Please select both protein and ligand files")
      return
    }

    const parameters: DockingParameters = {
      grid_center_x: 0,
      grid_center_y: 0,
      grid_center_z: 0,
      grid_size_x: 20,
      grid_size_y: 20,
      grid_size_z: 20,
      exhaustiveness: exhaustiveness[0],
      energy_range: 3,
      num_modes: numModes[0],
      use_gpu: false,
    }

    setIsSubmitting(true)
    try {
      await onSubmit(proteinFile, ligandFile, parameters)
      // Reset form
      setProteinFile(null)
      setLigandFile(null)
      setExhaustiveness([8])
      setNumModes([9])
      setValidationError(null)
    } catch (error) {
      console.error("[v0] Submit error:", error)
      setValidationError(error instanceof Error ? error.message : "Failed to submit job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Docking Job</DialogTitle>
          <DialogDescription>Upload your protein and ligand files and configure docking parameters.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Protein File Upload */}
          <div className="space-y-2">
            <Label htmlFor="protein">Protein File (PDB)</Label>
            <div className="flex items-center gap-2">
              <Input id="protein" type="file" accept=".pdb" onChange={handleProteinFileChange} />
              {proteinFile && <span className="text-sm text-muted-foreground">{proteinFile.name}</span>}
            </div>
          </div>

          {/* Ligand File Upload */}
          <div className="space-y-2">
            <Label htmlFor="ligand">Ligand File (SDF/MOL2)</Label>
            <div className="flex items-center gap-2">
              <Input id="ligand" type="file" accept=".sdf,.mol2" onChange={handleLigandFileChange} />
              {ligandFile && <span className="text-sm text-muted-foreground">{ligandFile.name}</span>}
            </div>
          </div>

          {/* Docking Parameters */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Docking Parameters</h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="exhaustiveness">Exhaustiveness</Label>
                <span className="text-sm text-muted-foreground">{exhaustiveness[0]}</span>
              </div>
              <Slider
                id="exhaustiveness"
                min={1}
                max={20}
                step={1}
                value={exhaustiveness}
                onValueChange={setExhaustiveness}
              />
              <p className="text-xs text-muted-foreground">
                Higher values provide more thorough search but take longer
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="modes">Number of Modes</Label>
                <span className="text-sm text-muted-foreground">{numModes[0]}</span>
              </div>
              <Slider id="modes" min={1} max={20} step={1} value={numModes} onValueChange={setNumModes} />
              <p className="text-xs text-muted-foreground">Number of binding modes to generate</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!proteinFile || !ligandFile || isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit Job
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

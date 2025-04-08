"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormData {
  nume: string
  prenume: string
  facultate: string
  motivatie: string
}

export default function StudentForm() {
  const [formData, setFormData] = useState<FormData>({
    nume: "",
    prenume: "",
    facultate: "",
    motivatie: "",
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.nume.trim()) {
      newErrors.nume = "Numele este obligatoriu"
    }

    if (!formData.prenume.trim()) {
      newErrors.prenume = "Prenumele este obligatoriu"
    }

    if (!formData.facultate.trim()) {
      newErrors.facultate = "Facultatea este obligatorie"
    }

    if (!formData.motivatie.trim()) {
      newErrors.motivatie = "Motivația este obligatorie"
    } else if (formData.motivatie.length < 100) {
      newErrors.motivatie = "Motivația trebuie să conțină minim 100 caractere"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Eroare la trimiterea formularului")
      }

      // Get the PDF as a blob
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `fisa-student-${formData.nume}-${formData.prenume}.pdf`)

      // Append to the document
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSubmitStatus("success")

      // Reset form after successful submission
      setFormData({
        nume: "",
        prenume: "",
        facultate: "",
        motivatie: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(error instanceof Error ? error.message : "A apărut o eroare la trimiterea formularului")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fișa Studentului</CardTitle>
        <CardDescription>Completează formularul pentru a genera fișa ta de student</CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Succes!</AlertTitle>
            <AlertDescription>Formularul a fost trimis cu succes și PDF-ul a fost descărcat.</AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Eroare</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nume">Nume</Label>
            <Input
              id="nume"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              placeholder="Introduceți numele"
              className={errors.nume ? "border-red-500" : ""}
            />
            {errors.nume && <p className="text-red-500 text-sm">{errors.nume}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenume">Prenume</Label>
            <Input
              id="prenume"
              name="prenume"
              value={formData.prenume}
              onChange={handleChange}
              placeholder="Introduceți prenumele"
              className={errors.prenume ? "border-red-500" : ""}
            />
            {errors.prenume && <p className="text-red-500 text-sm">{errors.prenume}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultate">Facultate</Label>
            <Input
              id="facultate"
              name="facultate"
              value={formData.facultate}
              onChange={handleChange}
              placeholder="Introduceți facultatea"
              className={errors.facultate ? "border-red-500" : ""}
            />
            {errors.facultate && <p className="text-red-500 text-sm">{errors.facultate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivatie">Motivație participare</Label>
            <Textarea
              id="motivatie"
              name="motivatie"
              value={formData.motivatie}
              onChange={handleChange}
              placeholder="Introduceți motivația (minim 100 caractere)"
              className={errors.motivatie ? "border-red-500" : ""}
              rows={5}
            />
            <div className="flex justify-between">
              {errors.motivatie && <p className="text-red-500 text-sm">{errors.motivatie}</p>}
              <p className={`text-sm ${formData.motivatie.length < 100 ? "text-red-500" : "text-green-500"}`}>
                {formData.motivatie.length}/100 caractere
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Se trimite..." : "Trimite formularul"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


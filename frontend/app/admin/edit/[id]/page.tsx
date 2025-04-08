"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface FormData {
  nume: string
  prenume: string
  facultate: string
  motivatie: string
}

export default function EditForm() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [formData, setFormData] = useState<FormData>({
    nume: "",
    prenume: "",
    facultate: "",
    motivatie: "",
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/forms/${id}`, {
          headers: {
            // 'Authorization': `Bearer ${token}`
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch form")
        }

        const data = await response.json()
        setFormData({
          nume: data.nume,
          prenume: data.prenume,
          facultate: data.facultate,
          motivatie: data.motivatie,
        })
      } catch (err) {
        console.error("Error fetching form:", err)
        setErrorMessage("Failed to load form. Please try again later.")
        setSubmitStatus("error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [id])

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/forms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Eroare la actualizarea formularului")
      }

      setSubmitStatus("success")

      // Redirect back to admin page after successful update
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error) {
      console.error("Error updating form:", error)
      setErrorMessage(error instanceof Error ? error.message : "A apărut o eroare la actualizarea formularului")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-10">Se încarcă...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Editare Formular</CardTitle>
              <CardDescription>Actualizează datele formularului</CardDescription>
            </div>
            <Link href="/admin">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {submitStatus === "success" && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Succes!</AlertTitle>
              <AlertDescription>
                Formularul a fost actualizat cu succes. Veți fi redirecționat în curând.
              </AlertDescription>
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
              {isSubmitting ? "Se actualizează..." : "Actualizează formularul"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


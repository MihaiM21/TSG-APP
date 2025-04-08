"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface StudentForm {
  id: number
  nume: string
  prenume: string
  facultate: string
  motivatie: string
  dataSubmisiei: string
}

export default function ViewForm() {
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState<StudentForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setForm(data)
      } catch (err) {
        setError("Failed to load form. Please try again later.")
        console.error("Error fetching form:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [id])

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/forms/${id}/pdf`,
        {
          headers: {
            // 'Authorization': `Bearer ${token}`
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to download PDF")
      }

      // Get the PDF as a blob
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", form ? `fisa-student-${form.nume}-${form.prenume}.pdf` : `fisa-student-${id}.pdf`)

      // Append to the document
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading PDF:", err)
      alert("Failed to download PDF. Please try again.")
    }
  }

  if (loading) {
    return <div className="container mx-auto py-10">Se încarcă...</div>
  }

  if (error || !form) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">{error || "Form not found"}</p>
        <Link href="/admin">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Panel
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Detalii Formular</CardTitle>
              <CardDescription>Vizualizare formular student</CardDescription>
            </div>
            <Link href="/admin">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">ID</h3>
              <p>{form.id}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Data Submisiei</h3>
              <p>{new Date(form.dataSubmisiei).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Nume</h3>
            <p>{form.nume}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Prenume</h3>
            <p>{form.prenume}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Facultate</h3>
            <p>{form.facultate}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Motivație</h3>
            <p className="whitespace-pre-wrap">{form.motivatie}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Descarcă PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface StudentForm {
  id: number
  nume: string
  prenume: string
  facultate: string
  motivatie: string
  dataSubmisiei: string
}

export default function AdminPage() {
  const [forms, setForms] = useState<StudentForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/forms`, {
          headers: {
            // 'Authorization': `Bearer ${token}`
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch forms")
        }

        const data = await response.json()
        setForms(data)
      } catch (err) {
        setError("Failed to load forms. Please try again later.")
        console.error("Error fetching forms:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this form?")) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/forms/${id}`, {
        method: "DELETE",
        headers: {
          // 'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete form")
      }

      // Remove the deleted form from the state
      setForms(forms.filter((form) => form.id !== id))
    } catch (err) {
      console.error("Error deleting form:", err)
      alert("Failed to delete form. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Gestionează formularele studenților</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Se încarcă...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : forms.length === 0 ? (
            <p>Nu există formulare înregistrate.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nume</TableHead>
                  <TableHead>Prenume</TableHead>
                  <TableHead>Facultate</TableHead>
                  <TableHead>Data Submisiei</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>{form.id}</TableCell>
                    <TableCell>{form.nume}</TableCell>
                    <TableCell>{form.prenume}</TableCell>
                    <TableCell>{form.facultate}</TableCell>
                    <TableCell>{new Date(form.dataSubmisiei).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/${form.id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/edit/${form.id}`}>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(form.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


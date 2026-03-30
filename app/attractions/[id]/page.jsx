"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation'
import Link from "next/link";

export default function Page() {

  const { id } = useParams()
  const [attractions, setAttractions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteing, setDeleteing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter

  async function onDelete() {
    if (!confirm('Delete this attractions?')) return 
    setDeleteing(true)
    setError("")
    try {
      const res = await fetch('/api/attractions/' + id, { method: 'DELETE' })
      const data = await res.json()
    if (!res.ok) throw new Error(data?.error || data?.message || "Delete Failed")
    router.push('attractions')
    } catch (error) {
      setError(error.message)
    } finally {
      setDeleteing(false)
    }
  }

  useEffect(() => {

    if (!id) return

    async function fetchAttractions() {

      const res = await fetch('/api/attractions/' + id)

      const data = await res.json()

      setAttractions(data)
      setLoading(false)

      console.log(data)
    }

    fetchAttractions()

  }, [id])

  if (loading) return <h1>Loading...</h1>

  return (
    <div>
      <h1>id : {id}</h1>

      <img src={attractions.coverimage} width="300" />
      <p>{attractions.detail}</p>
      <p>Latitude: {attractions.latitude}</p>
      <p>Longitude: {attractions.longtitude}</p>
      <div style={{display: "flex", gap: 12, marginTop: 12}}>
        <Link href={`/attractions/${id}/edit`}>Edit</Link>
        <button onClick={onDelete} disabled={deleteing}>
          {deleteing ? "Deleting...":"Delete"}
        </button>
      </div>
      <a href="/attractions">Back</a>
    </div>
  )
}
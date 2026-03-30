"use client"
import React, { useEffect, useState } from 'react'

export default function page() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttractions() {
      const res = await fetch(`/api/attractions`);
      const data = await res.json();
      setAttractions(data);
      setLoading(false);
    }
    fetchAttractions();
  }, []);

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Attractions</h1>
      <ul>
        {attractions.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <img src={item.coverimage} height={200} />
            <p>{item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

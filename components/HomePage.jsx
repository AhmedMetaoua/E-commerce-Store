"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import NewProducts from "./NewProducts"
import CategoriesDisplay from "./CategoriesDisplay"

const HomeContainer = styled.div`
  margin: 20px 0;
`

export default function HomePage({ products , categories }) {
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    // Get all products from the last 7 days for the NewProducts component
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recent = products.filter((product) => {
      const createdAt = new Date(product.createdAt)
      return createdAt >= sevenDaysAgo
    })

    // Sort by creation date (newest first)
    recent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setRecentProducts(recent)
  }, [products])

  return (
    <HomeContainer>
      {/* Display newest products across all categories */}
      <NewProducts products={recentProducts} />

      {/* Display products by category */}
      <CategoriesDisplay products={products} categories={categories} />
    </HomeContainer>
  )
}

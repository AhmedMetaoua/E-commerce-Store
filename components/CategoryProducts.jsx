"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import ProductBox from "./ProductBox"
import { ArrowRight } from "lucide-react"

const CategorySection = styled.section`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin: 30px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${(props) => props.$color || "linear-gradient(to right, #4f46e5, #8b5cf6)"};
    border-radius: 5px 5px 0 0;
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #111;
  margin: 0;
  position: relative;
  display: inline-block;
  
  @media screen and (min-width: 768px) {
    font-size: 1.8rem;
  }
`

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4f46e5;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: #8b5cf6;
    transform: translateX(3px);
  }
  
  svg {
    margin-left: 6px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  
  @media screen and (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Animation for grid items */
  & > div {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s forwards;
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Staggered animation delay for each product */
  & > div:nth-child(1) { animation-delay: 0.1s; }
  & > div:nth-child(2) { animation-delay: 0.2s; }
  & > div:nth-child(3) { animation-delay: 0.3s; }
  & > div:nth-child(4) { animation-delay: 0.4s; }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 20px;
  grid-column: 1 / -1;
  color: #666;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #333;
  }
  
  p {
    font-size: 0.9rem;
  }
`

const SubcategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`

const SubcategoryTag = styled(Link)`
  background: #f1f5f9;
  color: #4f46e5;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e0e7ff;
    transform: translateY(-2px);
  }
`

// Array of gradient colors for different categories
const categoryColors = [
  "linear-gradient(to right, #4f46e5, #8b5cf6)", // Purple
  "linear-gradient(to right, #0ea5e9, #38bdf8)", // Blue
  "linear-gradient(to right, #10b981, #34d399)", // Green
  "linear-gradient(to right, #f59e0b, #fbbf24)", // Yellow
  "linear-gradient(to right, #ef4444, #f87171)", // Red
  "linear-gradient(to right, #ec4899, #f472b6)", // Pink
]

export default function CategoryProducts({ category, products = [], allCategories = [] }) {
  const [recentProducts, setRecentProducts] = useState([])
  const [subcategories, setSubcategories] = useState([])

  // Get a color based on category ID to ensure consistent colors
  const getCategoryColor = (categoryId) => {
    if (!categoryId) return categoryColors[0]
    // Use the last character of the ID to determine the color index
    const lastChar = categoryId.toString().slice(-1)
    const colorIndex = Number.parseInt(lastChar, 16) % categoryColors.length
    return categoryColors[colorIndex]
  }

  useEffect(() => {
    // Find subcategories of this category
    if (allCategories.length > 0 && category) {
      const childCategories = allCategories.filter(
        (cat) => cat.parent && cat.parent.toString() === category._id.toString(),
      )
      setSubcategories(childCategories)
    }

    // Filter products that were created in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const filtered = products.filter((product) => {
      const createdAt = new Date(product.createdAt)
      return createdAt >= sevenDaysAgo
    })

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setRecentProducts(filtered)
  }, [products, category, allCategories])

  if (!category) return null

  return (
    <CategorySection $color={getCategoryColor(category._id)}>
      <TitleContainer>
        <Title>{category.name}</Title>
        <ViewAllLink href={`/categories/${category._id}`}>
          View all {category.name}
          <ArrowRight size={16} />
        </ViewAllLink>
      </TitleContainer>

      {subcategories.length > 0 && (
        <SubcategoriesList>
          {subcategories.map((subcat) => (
            <SubcategoryTag key={subcat._id} href={`/categories/${subcat._id}`}>
              {subcat.name}
            </SubcategoryTag>
          ))}
        </SubcategoriesList>
      )}

      {recentProducts.length > 0 ? (
        <ProductsContainer>
          {recentProducts.slice(0, 4).map((product) => (
            <ProductBox key={product._id} {...product} />
          ))}
        </ProductsContainer>
      ) : (
        <EmptyState>
          <h3>No new products in {category.name}</h3>
          <p>Check back soon for new arrivals in this category!</p>
        </EmptyState>
      )}
    </CategorySection>
  )
}

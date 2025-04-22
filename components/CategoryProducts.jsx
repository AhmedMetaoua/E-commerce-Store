"use client"

import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import Link from "next/link"
import ProductBox from "./ProductBox"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

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

const ProductsScrollContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`

const ProductsRow = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 5px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* Animation for items */
  & > div {
    flex: 0 0 auto;
    width: 280px;
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
  & > div:nth-child(5) { animation-delay: 0.5s; }
  & > div:nth-child(6) { animation-delay: 0.6s; }
`

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.left {
    left: 10px;
  }
  
  &.right {
    right: 10px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 20px;
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

const SubcategoryTag = styled.button`
  background: ${(props) => (props.$active ? "#e0e7ff" : "#f1f5f9")};
  color: #4f46e5;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
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
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [activeSubcategory, setActiveSubcategory] = useState(null)
  const scrollContainerRef = useRef(null)

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

    // Sort products by creation date (newest first)
    const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setDisplayedProducts(sortedProducts)
  }, [products, category, allCategories])

  const handleSubcategoryClick = (subcategoryId) => {
    if (activeSubcategory === subcategoryId) {
      // If clicking the active subcategory, show all products
      setActiveSubcategory(null)
      setDisplayedProducts([...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } else {
      // Filter products by subcategory
      setActiveSubcategory(subcategoryId)
      const filtered = products.filter((product) => {
        const productCategoryId =
          typeof product.category === "object" ? product.category._id.toString() : product.category.toString()
        return productCategoryId === subcategoryId
      })
      setDisplayedProducts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -600, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: "smooth" })
    }
  }

  if (!category) return null

  return (
    <CategorySection $color={getCategoryColor(category._id)}>
      <TitleContainer>
        <Title>{category.name}</Title>
        {/* Updated to link to products page with category filter */}
        <ViewAllLink href={`/products?category=${category._id}`}>
          View all {category.name}
          <ArrowRight size={16} />
        </ViewAllLink>
      </TitleContainer>

      {subcategories.length > 0 && (
        <SubcategoriesList>
          {subcategories.map((subcat) => (
            <SubcategoryTag
              key={subcat._id}
              $active={activeSubcategory === subcat._id}
              onClick={() => handleSubcategoryClick(subcat._id)}
            >
              {subcat.name}
            </SubcategoryTag>
          ))}
        </SubcategoriesList>
      )}

      {displayedProducts.length > 0 ? (
        <ProductsScrollContainer>
          <ScrollButton className="left" onClick={scrollLeft}>
            <ChevronLeft size={20} />
          </ScrollButton>

          <ProductsRow ref={scrollContainerRef}>
            {displayedProducts.map((product) => (
              <ProductBox key={product._id} {...product} />
            ))}
          </ProductsRow>

          <ScrollButton className="right" onClick={scrollRight}>
            <ChevronRight size={20} />
          </ScrollButton>
        </ProductsScrollContainer>
      ) : (
        <EmptyState>
          <h3>
            No products in{" "}
            {activeSubcategory ? subcategories.find((s) => s._id === activeSubcategory)?.name : category.name}
          </h3>
          <p>Check back soon for new products in this category!</p>
        </EmptyState>
      )}
    </CategorySection>
  )
}

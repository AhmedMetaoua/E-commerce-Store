"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import Center from "./Center"
import Link from "next/link"
import { ArrowRight, Star, TrendingUp } from "lucide-react"

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const SectionWrapper = styled.section`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 60px 30px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  margin: 60px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899);
    border-radius: 8px 8px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 70%);
    z-index: 0;
    border-radius: 50%;
  }
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
`

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111;
  margin: 0;
  position: relative;
  display: inline-block;
  
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
  
  span {
    background: linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(to right, rgba(79, 70, 229, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
      border-radius: 3px;
      z-index: -1;
    }
  }
`

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #4f46e5;
  text-decoration: none;
  transition: all 0.3s ease;
  background: white;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  
  &:hover {
    color: #8b5cf6;
    transform: translateX(3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`

const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  margin: -20px 0 40px;
  max-width: 700px;
  line-height: 1.6;
  animation: ${fadeIn} 0.8s ease-out;
`

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  position: relative;
  z-index: 1;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto auto;
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto auto;
  }
`

const ProductCard = styled(Link)`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  animation: ${fadeIn} 0.6s ease-out;
  animation-fill-mode: both;
  animation-delay: ${(props) => props.$delay || "0s"};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.7) 100%);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  @media screen and (min-width: 768px) {
    ${(props) =>
      props.$featured &&
      `
      grid-column: span 2;
      grid-row: span 2;
    `}
  }
  
  @media screen and (min-width: 1024px) {
    ${(props) =>
      props.$featured &&
      `
      grid-column: span 2;
      grid-row: span 2;
    `}
  }
`

const ProductImage = styled.div`
  width: 100%;
  height: ${(props) => (props.$featured ? "400px" : "220px")};
  position: relative;
  overflow: hidden;
  
  @media screen and (max-width: 768px) {
    height: 220px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.1);
  }
`

const NewBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: linear-gradient(to right, #4f46e5, #8b5cf6);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${(props) =>
    props.$featured &&
    `
    font-size: 0.9rem;
    padding: 8px 16px;
  `}
`

const FeaturedBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(to right, #f59e0b, #ef4444);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
  animation: ${float} 3s ease-in-out infinite;
`

const ProductInfo = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 2;
`

const ProductTitle = styled.h3`
  font-size: ${(props) => (props.$featured ? "1.5rem" : "1.1rem")};
  font-weight: 600;
  color: #111;
  margin: 0 0 10px;
  transition: color 0.3s ease;
  
  ${ProductCard}:hover & {
    color: #4f46e5;
  }
`

const ProductPrice = styled.div`
  font-size: ${(props) => (props.$featured ? "1.5rem" : "1.2rem")};
  font-weight: 700;
  color: #111;
  margin-top: auto;
  padding-top: 15px;
  
  span {
    font-size: 0.85rem;
    font-weight: 500;
    color: #666;
    margin-left: 4px;
  }
`

const ProductCategory = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
`

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 0 0 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
`

const ShimmerEffect = styled.div`
  position: absolute;
  top: -10%;
  left: -100%;
  width: 50%;
  height: 120%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  animation: ${shimmer} 3s infinite;
  z-index: 2;
  pointer-events: none;
`

export default function NewProducts({ products }) {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      // Get a diverse selection of products for the featured section
      // We'll select up to 5 products (1 featured + 4 regular)

      // Sort by newest first
      const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      // Try to get products from different categories if possible
      const categoriesMap = new Map()
      const selectedProducts = []

      // First, group products by category
      sortedProducts.forEach((product) => {
        const categoryId = product.category?._id || product.category || "uncategorized"
        if (!categoriesMap.has(categoryId)) {
          categoriesMap.set(categoryId, [])
        }
        categoriesMap.get(categoryId).push(product)
      })

      // Select one product from each category until we have 5 or run out of categories
      const categories = Array.from(categoriesMap.keys())
      for (let i = 0; i < Math.min(5, categories.length); i++) {
        const category = categories[i]
        const productsInCategory = categoriesMap.get(category)
        if (productsInCategory && productsInCategory.length > 0) {
          selectedProducts.push(productsInCategory[0])
          // Remove the selected product
          categoriesMap.set(category, productsInCategory.slice(1))
        }
      }

      // If we don't have 5 products yet, add more from categories with multiple products
      if (selectedProducts.length < 5) {
        for (const [_, productsInCategory] of categoriesMap.entries()) {
          if (selectedProducts.length >= 5) break
          if (productsInCategory && productsInCategory.length > 0) {
            selectedProducts.push(productsInCategory[0])
          }
        }
      }

      // If we still don't have 5, just add from the sorted list
      if (selectedProducts.length < 5 && sortedProducts.length > 0) {
        const remaining = 5 - selectedProducts.length
        const additionalProducts = sortedProducts.filter((p) => !selectedProducts.includes(p)).slice(0, remaining)
        selectedProducts.push(...additionalProducts)
      }

      setFeaturedProducts(selectedProducts.slice(0, 5))
    }
  }, [products])

  if (!featuredProducts.length) return null

  // The first product will be the featured one (larger)
  const featuredProduct = featuredProducts[0]
  const regularProducts = featuredProducts.slice(1)

  return (
    <Center>
      <SectionWrapper>
        <HeaderContainer>
          <Title>
            <span>New</span> Arrivals
          </Title>
          <ViewAllLink href="/products">
            View all products
            <ArrowRight size={18} />
          </ViewAllLink>
        </HeaderContainer>
        <Subtitle>
          Discover our latest collection of products, carefully selected to match your style and needs.
        </Subtitle>

        <FeaturedGrid>
          {/* Featured product (larger) */}
          {featuredProduct && (
            <ProductCard href={`/product/${featuredProduct._id}`} $featured={true} $delay="0.1s">
              <ProductImage $featured={true}>
                <img src={featuredProduct.images?.[0] || "/placeholder.svg"} alt={featuredProduct.title} />
                <ShimmerEffect />
              </ProductImage>
              <NewBadge $featured={true}>
                <TrendingUp size={16} />
                Just Arrived
              </NewBadge>
              <FeaturedBadge>
                <Star size={16} fill="currentColor" />
                Featured
              </FeaturedBadge>
              <ProductInfo>
                <ProductCategory>
                  {typeof featuredProduct.category === "object" ? featuredProduct.category?.name : "New Collection"}
                </ProductCategory>
                <ProductTitle $featured={true}>{featuredProduct.title}</ProductTitle>
                <ProductDescription>{featuredProduct.description}</ProductDescription>
                <RatingContainer>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </RatingContainer>
                <ProductPrice $featured={true}>
                  {featuredProduct.price} <span>DT</span>
                </ProductPrice>
              </ProductInfo>
            </ProductCard>
          )}

          {/* Regular products */}
          {regularProducts.map((product, index) => (
            <ProductCard key={product._id} href={`/product/${product._id}`} $delay={`${0.2 + index * 0.1}s`}>
              <ProductImage>
                <img src={product.images?.[0] || "/placeholder.svg"} alt={product.title} />
                <ShimmerEffect />
              </ProductImage>
              <NewBadge>
                <TrendingUp size={14} />
                New
              </NewBadge>
              <ProductInfo>
                <ProductCategory>
                  {typeof product.category === "object" ? product.category?.name : "New Collection"}
                </ProductCategory>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>
                  {product.price} <span>DT</span>
                </ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </FeaturedGrid>
      </SectionWrapper>
    </Center>
  )
}

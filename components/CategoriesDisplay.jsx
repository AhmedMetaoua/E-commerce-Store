"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Center from "./ui/Center"
import CategoryProducts from "./CategoryProducts"

const CategoriesWrapper = styled.div`
  margin: 40px 0;
`

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 40px;
  text-align: center;
  
  span {
    background: linear-gradient(to right, #4f46e5, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`

export default function CategoriesDisplay({ products = [], categories = [] }) {
  const [parentCategories, setParentCategories] = useState([])
  const [categoryProductMap, setCategoryProductMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categories.length > 0 && products.length > 0) {
      // Find all parent categories (categories with no parent)
      const parents = categories.filter(cat => !cat.parent)
      
      // Create a map of child categories to their parent IDs
      const childToParentMap = {}
      categories.forEach(cat => {
        if (cat.parent) {
          childToParentMap[cat._id] = cat.parent.toString()
        }
      })
      
      // Create a map of parent categories to their children
      const parentToChildrenMap = {}
      parents.forEach(parent => {
        parentToChildrenMap[parent._id] = [parent._id] // Include the parent's own ID
        
        // Find all children of this parent
        categories.forEach(cat => {
          if (cat.parent && cat.parent.toString() === parent._id.toString()) {
            parentToChildrenMap[parent._id].push(cat._id)
          }
        })
      })
      
      // Group products by parent category
      const groupedProducts = {}
      
      products.forEach(product => {
        if (!product.category) return
        
        const productCategoryId = typeof product.category === 'object' 
          ? product.category._id.toString() 
          : product.category.toString()
        
        // Check if this product's category is a parent
        if (parentToChildrenMap[productCategoryId]) {
          // This product belongs directly to a parent category
          if (!groupedProducts[productCategoryId]) {
            groupedProducts[productCategoryId] = []
          }
          groupedProducts[productCategoryId].push(product)
        } 
        // Check if this product's category is a child
        else if (childToParentMap[productCategoryId]) {
          const parentId = childToParentMap[productCategoryId]
          if (!groupedProducts[parentId]) {
            groupedProducts[parentId] = []
          }
          groupedProducts[parentId].push(product)
        }
      })
      
      // Sort products by creation date (newest first) for each category
      Object.keys(groupedProducts).forEach(categoryId => {
        groupedProducts[categoryId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      })
      
      setParentCategories(parents)
      setCategoryProductMap(groupedProducts)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [products, categories])

  if (loading) {
    return (
      <Center>
        <LoadingState>Loading categories...</LoadingState>
      </Center>
    )
  }

  return (
    <Center>
      <CategoriesWrapper>
        <Title>
          Shop by <span>Category</span>
        </Title>

        {parentCategories.length > 0 ? (
          parentCategories.map((category) => (
            <CategoryProducts
              key={category._id}
              category={category}
              products={categoryProductMap[category._id] || []}
              allCategories={categories}
            />
          ))
        ) : (
          <LoadingState>No categories found</LoadingState>
        )}
      </CategoriesWrapper>
    </Center>
  )
}

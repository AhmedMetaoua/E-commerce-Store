"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Center from "@/components/Center"
import Header from "@/components/Header"
import ProductsGrid from "@/components/ProductsGrid"
import Footer from "@/components/Footer"
import dbConnect from "@/lib/mongoose"
import { Category } from "@/models/Category"
import Product from "@/models/Product"
import styled from "styled-components"
import FilterSidebar from "@/components/FilterSidebar"
import { Filter, X, ChevronDown, ChevronUp, Grid3X3, Grid2X2, FilterIcon } from "lucide-react"
import Head from "next/head"

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (min-width: 768px) {
    flex-direction: row;
    gap: 30px;
  }
`

const ProductsContainer = styled.div`
  flex-grow: 1;
  width: 100%;
`

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  
  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111;
  margin: 0;
  
  @media screen and (min-width: 768px) {
    font-size: 2.2rem;
  }
`

const ResultCount = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.95rem;
`

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
  justify-content: space-between;
`

const SortContainer = styled.div`
  position: relative;
  min-width: 200px;
`

const SortButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 15px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #cbd5e1;
  }
`

const SortDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 5px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
`

const SortOption = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 15px;
  border: none;
  background: ${(props) => (props.$active ? "#f1f5f9" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  &:hover {
    background: #f8fafc;
  }
`

const MobileFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
  
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const MobileFilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`

const MobileFilterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1001;
  padding: 20px;
  transform: translateY(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  max-height: 80vh;
  overflow-y: auto;
`

const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  
  &:hover {
    background: #f1f5f9;
  }
`

const ViewToggle = styled.div`
  display: flex;
  gap: 5px;
`

const ViewButton = styled.button`
  background: ${(props) => (props.$active ? "#f1f5f9" : "white")};
  border: 1px solid #e2e8f0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#4f46e5" : "#64748b")};
  transition: all 0.2s;
  
  &:hover {
    border-color: #cbd5e1;
    color: #4f46e5;
  }
`

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  
  button {
    background: transparent;
    border: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    padding: 0;
    
    &:hover {
      color: #ef4444;
    }
  }
`

const ClearAllButton = styled.button`
  background: transparent;
  border: none;
  font-size: 0.85rem;
  color: #4f46e5;
  cursor: pointer;
  padding: 6px 12px;
  
  &:hover {
    text-decoration: underline;
  }
`

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #f8fafc;
  border-radius: 12px;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    color: #64748b;
    margin-bottom: 20px;
  }
  
  button {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #4338ca;
    }
  }
`

export default function ProductsPage({ products, categories }) {
  const router = useRouter()
  const { query } = router
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    properties: {},
    priceRange: { min: "", max: "" },
  })
  const [sortOption, setSortOption] = useState("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [gridView, setGridView] = useState("grid4") // grid4 or grid2
  const [pageTitle, setPageTitle] = useState("All Products")

  // Get all unique properties across all categories
  const allProperties = {}
  categories.forEach((category) => {
    if (category.properties) {
      category.properties.forEach((property) => {
        if (!allProperties[property.name]) {
          allProperties[property.name] = new Set()
        }

        property.values.forEach((value) => {
          allProperties[property.name].add(value)
        })
      })
    }
  })

  // Convert Sets to Arrays
  Object.keys(allProperties).forEach((key) => {
    allProperties[key] = Array.from(allProperties[key])
  })

  // Build category hierarchy
  const categoryHierarchy = {}
  const topLevelCategories = []
  const childToParentMap = {}

  categories.forEach((category) => {
    if (!category.parent) {
      topLevelCategories.push(category)
      categoryHierarchy[category._id] = []
    }
  })

  categories.forEach((category) => {
    if (category.parent) {
      const parentId = typeof category.parent === "object" ? category.parent._id : category.parent
      if (categoryHierarchy[parentId]) {
        categoryHierarchy[parentId].push(category)
        childToParentMap[category._id] = parentId
      }
    }
  })

  // Check URL for category parameter on initial load - ONLY RUNS ONCE
  useEffect(() => {
    if (query.category) {
      const categoryId = query.category
      const category = categories.find((c) => c._id === categoryId)

      if (category) {
        // Check if this is a child category
        const newCategories = [categoryId]

        // If it's a child category, also select its parent
        if (category.parent) {
          const parentId = typeof category.parent === "object" ? category.parent._id : category.parent
          newCategories.push(parentId)
        }

        // Set the active category filter
        setActiveFilters((prev) => ({
          ...prev,
          categories: newCategories,
        }))

        // Update page title
        setPageTitle(`${category.name} Products`)
      }
    }
  }, []) // Empty dependency array means this only runs once on mount

  // Helper function to identify child categories that are selected
  const getSelectedChildCategories = () => {
    const selectedChildCats = []

    activeFilters.categories.forEach((catId) => {
      // Check if this is a child category with its parent also selected
      const category = categories.find((c) => c._id === catId)
      if (category && category.parent) {
        const parentId = typeof category.parent === "object" ? category.parent._id : category.parent
        if (activeFilters.categories.includes(parentId)) {
          selectedChildCats.push(catId)
        }
      }
    })

    return selectedChildCats
  }

  // Apply filters and sorting with proper dependency tracking
  useEffect(() => {
    let result = [...products]

    // Filter by categories
    if (activeFilters.categories.length > 0) {
      // Check if we have any child categories with their parents also selected
      const selectedChildCats = getSelectedChildCategories()

      if (selectedChildCats.length > 0) {
        // If we have child categories with their parents selected,
        // only show products from the child categories
        result = result.filter((product) => {
          const productCatId = typeof product.category === "object" ? product.category._id : product.category
          return selectedChildCats.includes(productCatId)
        })
      } else {
        // Otherwise, show products from all selected categories and their children
        const allCategoryIds = new Set()

        // Add all selected categories
        activeFilters.categories.forEach((catId) => {
          allCategoryIds.add(catId)

          // If this is a parent category, also add all its children
          if (categoryHierarchy[catId]) {
            categoryHierarchy[catId].forEach((childCat) => {
              allCategoryIds.add(childCat._id)
            })
          }
        })

        // Filter products based on the complete set of categories
        result = result.filter((product) => {
          const productCatId = typeof product.category === "object" ? product.category._id : product.category
          return allCategoryIds.has(productCatId)
        })
      }
    }

    // Filter by properties
    const activePropertyFilters = Object.entries(activeFilters.properties).filter(([_, values]) => values.length > 0)

    if (activePropertyFilters.length > 0) {
      result = result.filter((product) => {
        if (!product.properties) return false

        return activePropertyFilters.every(([property, values]) => {
          return values.includes(product.properties[property])
        })
      })
    }

    // Filter by price range
    if (activeFilters.priceRange.min !== "") {
      result = result.filter((product) => product.price >= Number(activeFilters.priceRange.min))
    }

    if (activeFilters.priceRange.max !== "") {
      result = result.filter((product) => product.price <= Number(activeFilters.priceRange.max))
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [ activeFilters.categories, JSON.stringify(activeFilters.properties), activeFilters.priceRange.min, activeFilters.priceRange.max, sortOption])

  const handleCategoryFilter = (categoryId) => {
    setActiveFilters((prev) => {
      // Check if we're adding or removing this category
      const isAdding = !prev.categories.includes(categoryId)

      let newCategories = [...prev.categories]

      if (isAdding) {
        // Adding a category
        newCategories.push(categoryId)

        // If it's a child category, also add its parent if not already selected
        const category = categories.find((c) => c._id === categoryId)
        if (category && category.parent) {
          const parentId = typeof category.parent === "object" ? category.parent._id : category.parent
          if (!newCategories.includes(parentId)) {
            newCategories.push(parentId)
          }
        }
      } else {
        // Removing a category
        newCategories = newCategories.filter((id) => id !== categoryId)

        // If it's a parent category, also remove all its children
        if (categoryHierarchy[categoryId]) {
          const childIds = categoryHierarchy[categoryId].map((child) => child._id)
          newCategories = newCategories.filter((id) => !childIds.includes(id))
        }
      }

      // Update URL with the selected category - MOVED OUTSIDE THE STATE SETTER
      if (newCategories.length === 1) {
        const category = categories.find((c) => c._id === newCategories[0])
        if (category) {
          // We'll handle the URL update and title change in the useEffect below
          setPageTitle(`${category.name} Products`)
        }
      } else if (newCategories.length === 0) {
        // We'll handle the URL update and title change in the useEffect below
        setPageTitle("All Products")
      }

      return {
        ...prev,
        categories: newCategories,
      }
    })
  }

  // Handle URL updates after state changes
  useEffect(() => {
    if (activeFilters.categories.length === 1) {
      router.push(
        {
          pathname: router.pathname,
          query: { category: activeFilters.categories[0] },
        },
        undefined,
        { shallow: true }
      )
    } else if (activeFilters.categories.length === 0) {
      router.push(
        {
          pathname: router.pathname,
        },
        undefined,
        { shallow: true }
      )
    }
  }, [activeFilters.categories, router.pathname])

  const handlePropertyFilter = (property, value) => {
    setActiveFilters((prev) => {
      const currentValues = prev.properties[property] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        properties: {
          ...prev.properties,
          [property]: newValues,
        },
      }
    })
  }

  const handlePriceFilter = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value,
      },
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      properties: {},
      priceRange: { min: "", max: "" },
    })
    setPageTitle("All Products")
    // URL update handled by the effect watching activeFilters.categories
  }

  const removeFilter = (type, value) => {
    if (type === "category") {
      setActiveFilters((prev) => {
        let newCategories = prev.categories.filter((id) => id !== value)

        // If it's a parent category, also remove all its children
        if (categoryHierarchy[value]) {
          const childIds = categoryHierarchy[value].map((child) => child._id)
          newCategories = newCategories.filter((id) => !childIds.includes(id))
        }

        // If it's a child category and its parent is still selected, keep the parent
        const category = categories.find((c) => c._id === value)
        if (category && category.parent) {
          const parentId = typeof category.parent === "object" ? category.parent._id : category.parent
          if (newCategories.includes(parentId) && !newCategories.some((id) => childToParentMap[id] === parentId)) {
            // If no other children of this parent are selected, keep the parent
          }
        }

        // Update page title - URL updates handled by the effect watching activeFilters.categories
        if (newCategories.length === 1) {
          const category = categories.find((c) => c._id === newCategories[0])
          if (category) {
            setPageTitle(`${category.name} Products`)
          }
        } else if (newCategories.length === 0) {
          setPageTitle("All Products")
        }

        return {
          ...prev,
          categories: newCategories,
        }
      })
    } else if (type === "price") {
      setActiveFilters((prev) => ({
        ...prev,
        priceRange: { ...prev.priceRange, [value]: "" },
      }))
    } else {
      // Property filter
      setActiveFilters((prev) => ({
        ...prev,
        properties: {
          ...prev.properties,
          [type]: prev.properties[type].filter((v) => v !== value),
        },
      }))
    }
  }

  // Check if any filters are active
  const hasActiveFilters =
    activeFilters.categories.length > 0 ||
    Object.values(activeFilters.properties).some((values) => values.length > 0) ||
    activeFilters.priceRange.min !== "" ||
    activeFilters.priceRange.max !== ""

  // Get active filter tags for display
  const getActiveFilterTags = () => {
    const tags = []

    // Category filters
    activeFilters.categories.forEach((catId) => {
      const category = categories.find((c) => c._id === catId)
      if (category) {
        tags.push({
          type: "category",
          value: catId,
          label: category.name,
        })
      }
    })

    // Property filters
    Object.entries(activeFilters.properties).forEach(([property, values]) => {
      values.forEach((value) => {
        tags.push({
          type: property,
          value,
          label: `${property}: ${value}`,
        })
      })
    })

    // Price filters
    if (activeFilters.priceRange.min !== "") {
      tags.push({
        type: "price",
        value: "min",
        label: `Min: ${activeFilters.priceRange.min} DT`,
      })
    }

    if (activeFilters.priceRange.max !== "") {
      tags.push({
        type: "price",
        value: "max",
        label: `Max: ${activeFilters.priceRange.max} DT`,
      })
    }

    return tags
  }

  const getSortLabel = () => {
    switch (sortOption) {
      case "price-asc":
        return "Price: Low to High"
      case "price-desc":
        return "Price: High to Low"
      case "newest":
        return "Newest First"
      case "oldest":
        return "Oldest First"
      case "name-asc":
        return "Name: A to Z"
      case "name-desc":
        return "Name: Z to A"
      default:
        return "Sort by"
    }
  }

  return (
    <PageContainer>
      <Head>
        <title>{pageTitle} | E-Commerce</title>
        <meta name="description" content={`Browse our collection of ${pageTitle.toLowerCase()}`} />
      </Head>

      <Header />

      <Center>
        <PageHeader>
          <div>
            <Title>{pageTitle}</Title>
            <ResultCount>{filteredProducts.length} products found</ResultCount>
          </div>
        </PageHeader>

        <FiltersRow>
          <MobileFilterButton onClick={() => setShowMobileFilters(true)}>
            <Filter size={16} />
            Filters
          </MobileFilterButton>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <FilterIcon size={16} />
            <SortContainer>
              <SortButton onClick={() => setShowSortDropdown(!showSortDropdown)}>
                <span>{getSortLabel()}</span>
                {showSortDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </SortButton>

              {showSortDropdown && (
                <SortDropdown>
                  <SortOption
                    $active={sortOption === "newest"}
                    onClick={() => {
                      setSortOption("newest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Newest First
                  </SortOption>
                  <SortOption
                    $active={sortOption === "oldest"}
                    onClick={() => {
                      setSortOption("oldest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Oldest First
                  </SortOption>
                  <SortOption
                    $active={sortOption === "price-asc"}
                    onClick={() => {
                      setSortOption("price-asc")
                      setShowSortDropdown(false)
                    }}
                  >
                    Price: Low to High
                  </SortOption>
                  <SortOption
                    $active={sortOption === "price-desc"}
                    onClick={() => {
                      setSortOption("price-desc")
                      setShowSortDropdown(false)
                    }}
                  >
                    Price: High to Low
                  </SortOption>
                  <SortOption
                    $active={sortOption === "name-asc"}
                    onClick={() => {
                      setSortOption("name-asc")
                      setShowSortDropdown(false)
                    }}
                  >
                    Name: A to Z
                  </SortOption>
                  <SortOption
                    $active={sortOption === "name-desc"}
                    onClick={() => {
                      setSortOption("name-desc")
                      setShowSortDropdown(false)
                    }}
                  >
                    Name: Z to A
                  </SortOption>
                </SortDropdown>
              )}
            </SortContainer>

            {/* <ViewToggle>
              <ViewButton $active={gridView === "grid4"} onClick={() => setGridView("grid4")} title="Grid view">
                <Grid3X3 size={16} />
              </ViewButton>
              <ViewButton $active={gridView === "grid2"} onClick={() => setGridView("grid2")} title="List view">
                <Grid2X2 size={16} />
              </ViewButton>
            </ViewToggle> */}
          </div>
        </FiltersRow>

        {hasActiveFilters && (
          <ActiveFilters>
            {getActiveFilterTags().map((tag, index) => (
              <FilterTag key={index}>
                {tag.label}
                <button onClick={() => removeFilter(tag.type, tag.value)}>
                  <X size={12} />
                </button>
              </FilterTag>
            ))}

            {getActiveFilterTags().length > 1 && <ClearAllButton onClick={clearAllFilters}>Clear all</ClearAllButton>}
          </ActiveFilters>
        )}

        <MainContent>
          <FilterSidebar
            categories={categories}
            categoryHierarchy={categoryHierarchy}
            topLevelCategories={topLevelCategories}
            properties={allProperties}
            activeFilters={activeFilters}
            onCategoryFilter={handleCategoryFilter}
            onPropertyFilter={handlePropertyFilter}
            onPriceFilter={handlePriceFilter}
            onClearAll={clearAllFilters}
          />

          <ProductsContainer>
            {filteredProducts.length > 0 ? (
              <ProductsGrid products={filteredProducts} view={gridView} />
            ) : (
              <NoResults>
                <h3>No products found</h3>
                <p>Try adjusting your filters or browse all products</p>
                <button onClick={clearAllFilters}>Clear all filters</button>
              </NoResults>
            )}
          </ProductsContainer>
        </MainContent>
      </Center>

      <MobileFilterOverlay $isOpen={showMobileFilters} onClick={() => setShowMobileFilters(false)} />

      <MobileFilterContainer $isOpen={showMobileFilters}>
        <MobileFilterHeader>
          <h3>Filters</h3>
          <CloseButton onClick={() => setShowMobileFilters(false)}>
            <X size={20} />
          </CloseButton>
        </MobileFilterHeader>

        <FilterSidebar
          categories={categories}
          categoryHierarchy={categoryHierarchy}
          topLevelCategories={topLevelCategories}
          properties={allProperties}
          activeFilters={activeFilters}
          onCategoryFilter={handleCategoryFilter}
          onPropertyFilter={handlePropertyFilter}
          onPriceFilter={handlePriceFilter}
          onClearAll={clearAllFilters}
          isMobile={true}
        />
      </MobileFilterContainer>

      <Footer />
    </PageContainer>
  )
}

export async function getServerSideProps() {
  await dbConnect()
  const products = await Product.find({}, null, { sort: { _id: -1 } })
  const categories = await Category.find({})

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  }
}

// Below this would be your styled components declarations
// PageContainer, Title, ResultCount, etc.
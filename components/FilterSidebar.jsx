"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { ChevronDown, ChevronUp, Sliders } from "lucide-react"

const SidebarContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 20px;
  
  @media screen and (min-width: 768px) {
    width: 300px;
    flex-shrink: 0;
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
`

const SidebarTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #4f46e5;
  }
`

const FilterSection = styled.div`
  margin-bottom: 25px;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 15px;
  transition: all 0.2s;
  
  &:hover {
    color: #4f46e5;
  }
`

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 5px;
`

const CategoryItem = styled.div`
  margin-left: ${(props) => (props.$isChild ? "20px" : "0")};
  position: relative;
  
  ${(props) =>
    props.$isChild &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 10px;
      width: 8px;
      height: 1px;
      background: #cbd5e1;
    }
  `}
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 4px 0;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    color: #4f46e5;
  }
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
  border-radius: 4px;
`

const PropertyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PropertyGroup = styled.div`
  animation: fadeIn 0.3s ease-in-out;
  animation-fill-mode: both;
  
  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.15s; }
  &:nth-child(4) { animation-delay: 0.2s; }
  &:nth-child(5) { animation-delay: 0.25s; }
`

const PropertyName = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background: #e2e8f0;
    margin-left: 8px;
  }
`

const PropertyValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const PropertyValue = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${(props) => (props.$active ? "#e0e7ff" : "#f1f5f9")};
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${(props) => (props.$active ? "#c7d2fe" : "#e2e8f0")};
    transform: translateY(-2px);
  }
  
  ${(props) =>
    props.$active &&
    `
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
  `}
`

const PriceFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const PriceInputs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const PriceInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`

const PriceSeparator = styled.span`
  color: #94a3b8;
`

const PriceSlider = styled.div`
  padding: 0 5px;
  margin-top: 10px;
`

const RangeSlider = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.1);
    }
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.1);
    }
  }
`

const ApplyButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ClearButton = styled.button`
  background: transparent;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`

const NoPropertiesMessage = styled.div`
  color: #64748b;
  font-size: 0.9rem;
  padding: 10px 0;
  font-style: italic;
`

const Badge = styled.span`
  background: #e0e7ff;
  color: #4f46e5;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
`

export default function FilterSidebar({
  categories,
  categoryHierarchy,
  topLevelCategories,
  properties,
  activeFilters,
  onCategoryFilter,
  onPropertyFilter,
  onPriceFilter,
  onClearAll,
  isMobile = false,
}) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    properties: true,
    price: true,
  })

  const [tempPriceRange, setTempPriceRange] = useState({
    min: activeFilters.priceRange.min || "",
    max: activeFilters.priceRange.max || "",
  })

  const [relevantProperties, setRelevantProperties] = useState({})

  // Update temp price range when active filters change
  useEffect(() => {
    setTempPriceRange({
      min: activeFilters.priceRange.min || "",
      max: activeFilters.priceRange.max || "",
    })
  }, [activeFilters.priceRange])

  // Filter properties based on selected categories
  useEffect(() => {
    if (activeFilters.categories.length === 0) {
      // Show empty properties object if no category is selected
      setRelevantProperties({})
      return
    }

    // Get all selected categories
    const selectedCategoryIds = [...activeFilters.categories]

    // Find all relevant properties for the selected categories
    const relevantProps = {}

    categories.forEach((category) => {
      // Only include properties from categories that are directly selected
      // (not from parent categories when a child is selected)
      if (selectedCategoryIds.includes(category._id)) {
        if (category.properties) {
          category.properties.forEach((property) => {
            if (!relevantProps[property.name]) {
              relevantProps[property.name] = new Set()
            }

            property.values.forEach((value) => {
              relevantProps[property.name].add(value)
            })
          })
        }
      }
    })

    // Convert Sets to Arrays
    Object.keys(relevantProps).forEach((key) => {
      relevantProps[key] = Array.from(relevantProps[key])
    })

    setRelevantProperties(relevantProps)
  }, [activeFilters.categories, categories])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleApplyPrice = () => {
    onPriceFilter("min", tempPriceRange.min)
    onPriceFilter("max", tempPriceRange.max)
  }

  const handleClearPrice = () => {
    setTempPriceRange({ min: "", max: "" })
    onPriceFilter("min", "")
    onPriceFilter("max", "")
  }

  const renderCategories = () => {
    return (
      <CategoryList>
        {topLevelCategories.map((category) => (
          <div key={category._id}>
            <CategoryItem>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={activeFilters.categories.includes(category._id)}
                  onChange={() => onCategoryFilter(category._id)}
                />
                {category.name}
                {categoryHierarchy[category._id]?.length > 0 && <Badge>{categoryHierarchy[category._id].length}</Badge>}
              </CheckboxLabel>
            </CategoryItem>

            {/* Render child categories */}
            {categoryHierarchy[category._id]?.map((childCategory) => (
              <CategoryItem key={childCategory._id} $isChild={true}>
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    checked={activeFilters.categories.includes(childCategory._id)}
                    onChange={() => onCategoryFilter(childCategory._id)}
                  />
                  {childCategory.name}
                </CheckboxLabel>
              </CategoryItem>
            ))}
          </div>
        ))}
      </CategoryList>
    )
  }

  const renderProperties = () => {
    if (activeFilters.categories.length === 0) {
      return <NoPropertiesMessage>Select a category to see relevant properties</NoPropertiesMessage>
    }

    const propertyEntries = Object.entries(relevantProperties)

    if (propertyEntries.length === 0) {
      return <NoPropertiesMessage>No properties available for the selected categories</NoPropertiesMessage>
    }

    return (
      <PropertyList>
        {propertyEntries.map(([propertyName, values]) => (
          <PropertyGroup key={propertyName}>
            <PropertyName>{propertyName}</PropertyName>
            <PropertyValues>
              {values.map((value) => (
                <PropertyValue key={value} $active={activeFilters.properties[propertyName]?.includes(value)}>
                  <Checkbox
                    type="checkbox"
                    checked={activeFilters.properties[propertyName]?.includes(value) || false}
                    onChange={() => onPropertyFilter(propertyName, value)}
                  />
                  {value}
                </PropertyValue>
              ))}
            </PropertyValues>
          </PropertyGroup>
        ))}
      </PropertyList>
    )
  }

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>
          <Sliders size={18} />
          Filters
        </SidebarTitle>
      </SidebarHeader>

      <FilterSection>
        <FilterHeader onClick={() => toggleSection("categories")}>
          <FilterTitle>Categories</FilterTitle>
          {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </FilterHeader>
        {expandedSections.categories && renderCategories()}
      </FilterSection>

      <FilterSection>
        <FilterHeader onClick={() => toggleSection("properties")}>
          <FilterTitle>Properties</FilterTitle>
          {expandedSections.properties ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </FilterHeader>
        {expandedSections.properties && renderProperties()}
      </FilterSection>

      <FilterSection>
        <FilterHeader onClick={() => toggleSection("price")}>
          <FilterTitle>Price Range</FilterTitle>
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </FilterHeader>
        {expandedSections.price && (
          <PriceFilterContainer>
            <PriceInputs>
              <PriceInput
                type="number"
                placeholder="Min"
                value={tempPriceRange.min}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })}
              />
              <PriceSeparator>-</PriceSeparator>
              <PriceInput
                type="number"
                placeholder="Max"
                value={tempPriceRange.max}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })}
              />
            </PriceInputs>
            <ButtonGroup>
              <ApplyButton onClick={handleApplyPrice}>Apply</ApplyButton>
              <ClearButton onClick={handleClearPrice}>Clear</ClearButton>
            </ButtonGroup>
          </PriceFilterContainer>
        )}
      </FilterSection>

      {(activeFilters.categories.length > 0 ||
        Object.values(activeFilters.properties).some((values) => values.length > 0) ||
        activeFilters.priceRange.min !== "" ||
        activeFilters.priceRange.max !== "") && (
        <ClearButton onClick={onClearAll} style={{ width: "100%" }}>
          Clear All Filters
        </ClearButton>
      )}
    </SidebarContainer>
  )
}

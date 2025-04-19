"use client"

import { useState } from "react"
import styled from "styled-components"
import { ChevronDown, ChevronUp } from "lucide-react"

const SidebarContainer = styled.div`
  width: 100%;
  
  @media screen and (min-width: 768px) {
    width: 280px;
    flex-shrink: 0;
  }
`

const FilterSection = styled.div`
  margin-bottom: 25px;
`

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 15px;
`

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CategoryItem = styled.div`
  margin-left: ${(props) => (props.$isChild ? "15px" : "0")};
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  
  &:hover {
    color: #4f46e5;
  }
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
`

const PropertyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const PropertyGroup = styled.div``

const PropertyName = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 10px;
  color: #475569;
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
  }
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
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`

const PriceSeparator = styled.span`
  color: #94a3b8;
`

const ApplyButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4338ca;
  }
`

const ClearButton = styled.button`
  background: transparent;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
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
  margin-top: 10px;
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
    categories: false,
    properties: false,
    price: true,
  })

  const [tempPriceRange, setTempPriceRange] = useState({
    min: activeFilters.priceRange.min,
    max: activeFilters.priceRange.max,
  })

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
    return (
      <PropertyList>
        {Object.entries(properties).map(([propertyName, values]) => (
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

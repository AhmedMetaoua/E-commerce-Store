"use client"

import { useContext, useState, useEffect } from "react"
import styled, { keyframes, css } from "styled-components"
import { CartContext } from "@/components/CartContext"
import Header from "@/components/Header"
import CartIcon from "@/components/icons/CartIcon"
import { Heart, ChevronLeft, ChevronRight, Check, Star, Truck, RefreshCw, Shield } from "lucide-react"
import Center from "@/components/Center"
import dbConnect from "@/lib/mongoose"
import Product from "@/models/Product"

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

// Main container with a light background
const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
  min-height: 100vh;
  padding-bottom: 80px;
`

// Product layout
const ProductWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: ${fadeIn} 0.6s ease-out;
`

const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  font-size: 0.9rem;
  color: #64748b;
`

const BreadcrumbLink = styled.a`
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #334155;
  }
`

const BreadcrumbSeparator = styled.span`
  color: #cbd5e1;
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 60px;
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: 1.1fr 1fr;
    gap: 80px;
  }
`

// Image gallery section
const GallerySection = styled.div`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
`

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  
  @media screen and (min-width: 768px) {
    height: 600px;
  }
`

const MainImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.03);
  }
`

const ThumbnailsTrack = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px;
  overflow-x: auto;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  background: #f8fafc;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
`

const ThumbnailButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid ${(props) => (props.active ? "#7c3aed" : "transparent")};
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
  background: white;
  padding: 0;
  box-shadow: ${(props) => (props.active ? "0 5px 15px rgba(124, 58, 237, 0.2)" : "0 5px 15px rgba(0, 0, 0, 0.05)")};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 2;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8fafc;
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
  
  svg {
    color: #334155;
    width: 20px;
    height: 20px;
  }
`

// Product info section
const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  animation: ${slideIn} 0.6s ease-out;
`

const ProductCategory = styled.div`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #7c3aed;
  margin-bottom: 12px;
  font-weight: 600;
`

const ProductTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 700;
  background: linear-gradient(to right, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  line-height: 1.2;
  
  @media screen and (max-width: 768px) {
    font-size: 2.25rem;
  }
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`

const Stars = styled.div`
  display: flex;
  align-items: center;
`

const ReviewCount = styled.span`
  color: #64748b;
  font-size: 0.95rem;
  
  a {
    color: #7c3aed;
    text-decoration: none;
    margin-left: 5px;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const ProductDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 32px;
`

const PriceContainer = styled.div`
  margin: 24px 0;
  display: flex;
  align-items: baseline;
  gap: 16px;
`

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  
  &::before {
    content: "$";
    font-size: 1.8rem;
    vertical-align: top;
    margin-right: 2px;
    font-weight: 500;
  }
`

const OriginalPrice = styled.span`
  font-size: 1.3rem;
  color: #94a3b8;
  text-decoration: line-through;
  
  &::before {
    content: "$";
    font-size: 1rem;
    vertical-align: top;
    margin-right: 1px;
  }
`

const Discount = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  padding: 6px 12px;
  border-radius: 20px;
`

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0 32px;
`

// Color selector
const ColorSection = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
`

const ColorOptions = styled.div`
  display: flex;
  gap: 12px;
`

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.selected ? "#7c3aed" : "transparent")};
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
  
  ${(props) =>
    props.selected &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: white;
      }
    `}
`

// Size selector
const SizeSection = styled.div`
  margin-bottom: 32px;
`

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

const SizeOption = styled.button`
  min-width: 60px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.selected ? "#7c3aed" : "#e2e8f0")};
  background-color: ${(props) => (props.selected ? "#f5f3ff" : "white")};
  color: ${(props) => (props.selected ? "#7c3aed" : "#475569")};
  font-weight: ${(props) => (props.selected ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7c3aed;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #e2e8f0;
    background-color: #f8fafc;
    color: #94a3b8;
    transform: none;
    box-shadow: none;
  }
`

// Quantity selector
const QuantitySection = styled.div`
  margin-bottom: 32px;
`

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  max-width: 160px;
`

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #334155;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityValue = styled.div`
  flex: 1;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
`

const ActionSection = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #16a34a;
  margin-bottom: 8px;
  
  svg {
    width: 18px;
    height: 18px;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
  
  @media screen and (max-width: 640px) {
    flex-direction: row;
  }
`

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(to right, #7c3aed, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 35px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(124, 58, 237, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`

const WishlistButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    transition: all 0.3s ease;
    color: ${(props) => (props.active ? "#ef4444" : "#334155")};
    fill: ${(props) => (props.active ? "#ef4444" : "none")};
  }
  
  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`

// Features section
const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;
`

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`

const FeatureIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: #7c3aed;
    width: 24px;
    height: 24px;
  }
`

const FeatureContent = styled.div`
  flex: 1;
`

const FeatureTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 4px 0;
`

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`

// Tabs section
const TabsContainer = styled.div`
  margin-top: 60px;
`

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const TabButton = styled.button`
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "#7c3aed" : "#64748b")};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? "#7c3aed" : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${(props) => (props.active ? "#7c3aed" : "#334155")};
  }
`

const TabContent = styled.div`
  padding: 32px 0;
  display: ${(props) => (props.active ? "block" : "none")};
  animation: ${fadeIn} 0.4s ease-out;
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media screen and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  
  span:first-child {
    color: #64748b;
  }
  
  span:last-child {
    font-weight: 500;
    color: #334155;
  }
`

const AddedToCartNotification = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: white;
  color: #334155;
  padding: 20px 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out, ${pulse} 0.5s ease-out 0.3s;
  border: 1px solid #f1f5f9;
  
  svg {
    color: #16a34a;
    background: #f0fdf4;
    padding: 8px;
    border-radius: 50%;
  }
`

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 1.05rem;
`

const NotificationMessage = styled.div`
  font-size: 0.9rem;
  color: #64748b;
`

const NotificationButton = styled.button`
  margin-left: auto;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
`

// Shimmer effect for loading state
const ShimmerEffect = styled.div`
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [activeTab, setActiveTab] = useState("shipping")
  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)

  // Sample data - in a real app, this would come from your product data
  const category = "Premium Collection"
  const rating = 4.8
  const reviewCount = 156
  const originalPrice = product.price * 1.2
  const discountPercentage = 20
  const inStock = true

  // Available colors and sizes
  const colors = [
    { id: "black", value: "#1e1e1e" },
    { id: "white", value: "#ffffff" },
    { id: "blue", value: "#3b82f6" },
    { id: "purple", value: "#8b5cf6" },
  ]

  const sizes = [
    { id: "XS", available: true },
    { id: "S", available: true },
    { id: "M", available: true },
    { id: "L", available: true },
    { id: "XL", available: true },
    { id: "XXL", available: false },
  ]

  const handleAddToCart = () => {
    addProduct(product._id, quantity, {
      color: selectedColor,
      size: selectedSize,
    })
    setShowNotification(true)

    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
  }

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <PageWrapper>
      <Header />
      <Center>
        <ProductWrapper>
          <BreadcrumbNav>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbLink href="/products">{category}</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <span>{product.title}</span>
          </BreadcrumbNav>

          <ProductGrid>
            {/* Image Gallery */}
            <GallerySection>
              <MainImageContainer>
                <MainImage src={product.images?.[currentImageIndex] || "/placeholder.svg"} alt={product.title} />

                {product.images && product.images.length > 1 && (
                  <>
                    <NavButton className="prev" onClick={prevImage} aria-label="Previous image">
                      <ChevronLeft />
                    </NavButton>
                    <NavButton className="next" onClick={nextImage} aria-label="Next image">
                      <ChevronRight />
                    </NavButton>
                  </>
                )}
              </MainImageContainer>

              {product.images && product.images.length > 1 && (
                <ThumbnailsTrack>
                  {product.images.map((image, index) => (
                    <ThumbnailButton
                      key={index}
                      active={currentImageIndex === index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img src={image || "/placeholder.svg"} alt={`${product.title} thumbnail ${index + 1}`} />
                    </ThumbnailButton>
                  ))}
                </ThumbnailsTrack>
              )}
            </GallerySection>

            {/* Product Information */}
            <ProductInfo>
              <ProductCategory>{category}</ProductCategory>
              <ProductTitle>{product.title}</ProductTitle>

              <RatingContainer>
                <Stars>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(rating) ? "#f59e0b" : "none"}
                      color={i < Math.floor(rating) ? "#f59e0b" : "#d1d5db"}
                    />
                  ))}
                </Stars>
                <ReviewCount>
                  {rating} · {reviewCount} reviews <a href="#reviews">See all</a>
                </ReviewCount>
              </RatingContainer>

              <ProductDescription>{product.description}</ProductDescription>

              <PriceContainer>
                <Price>{product.price.toFixed(2)}</Price>
                <OriginalPrice>{originalPrice.toFixed(2)}</OriginalPrice>
                <Discount>{discountPercentage}% OFF</Discount>
              </PriceContainer>

              <Divider />

              <ActionSection>
                {inStock ? (
                  <StockInfo>
                    <Check />
                    In Stock & Ready to Ship
                  </StockInfo>
                ) : (
                  <StockInfo style={{ color: "#ef4444" }}>Out of Stock</StockInfo>
                )}

                <ButtonsContainer>
                  <AddToCartButton onClick={handleAddToCart} disabled={!inStock}>
                    <CartIcon />
                    Add to Cart
                  </AddToCartButton>

                  <WishlistButton onClick={toggleWishlist} active={isInWishlist}>
                    <Heart size={20} />
                    {isInWishlist ? "Saved" : "Save"}
                  </WishlistButton>
                </ButtonsContainer>
              </ActionSection>

              {/* Features */}
              <FeaturesSection>
                <FeatureItem>
                  <FeatureIconWrapper>
                    <Truck />
                  </FeatureIconWrapper>
                  <FeatureContent>
                    <FeatureTitle>Free Shipping</FeatureTitle>
                    <FeatureDescription>
                      Free shipping on all orders over $50. Fast delivery within 3-5 business days.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>

                <FeatureItem>
                  <FeatureIconWrapper>
                    <RefreshCw />
                  </FeatureIconWrapper>
                  <FeatureContent>
                    <FeatureTitle>Easy Returns</FeatureTitle>
                    <FeatureDescription>
                      30-day hassle-free returns. No questions asked refund policy.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>

                <FeatureItem>
                  <FeatureIconWrapper>
                    <Shield />
                  </FeatureIconWrapper>
                  <FeatureContent>
                    <FeatureTitle>Secure Checkout</FeatureTitle>
                    <FeatureDescription>
                      Your payment information is processed securely. We do not store credit card details.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              </FeaturesSection>

              <TabsContainer>
                <TabsHeader>
                  <TabButton active={activeTab === "shipping"} onClick={() => setActiveTab("shipping")}>
                    Shipping & Delivery
                  </TabButton>
                  <TabButton active={activeTab === "returns"} onClick={() => setActiveTab("returns")}>
                    Returns & Refunds
                  </TabButton>
                </TabsHeader>

                <TabContent active={activeTab === "shipping"}>
                  <h3>Shipping Information</h3>
                  <p>
                    We ship worldwide! Orders are processed within 1-2 business days. Delivery times vary based on
                    location.
                  </p>
                  <ul>
                    <li>USA: 3-5 business days</li>
                    <li>Canada: 5-7 business days</li>
                    <li>International: 7-14 business days</li>
                  </ul>
                </TabContent>

                <TabContent active={activeTab === "returns"}>
                  <h3>Returns & Refunds</h3>
                  <p>
                    We offer a 30-day return policy. If you&apos;re not satisfied with your purchase, contact us to initiate
                    a return.
                  </p>
                  <p>Refunds are processed within 7-10 business days after we receive the returned item.</p>
                </TabContent>
              </TabsContainer>
            </ProductInfo>
          </ProductGrid>
        </ProductWrapper>
      </Center>

      {/* Added to cart notification */}
      {showNotification && (
        <AddedToCartNotification>
          <Check size={24} />
          <NotificationContent>
            <NotificationTitle>Added to cart!</NotificationTitle>
            <NotificationMessage>{quantity} item(s) added to your cart</NotificationMessage>
          </NotificationContent>
          <NotificationButton onClick={() => setShowNotification(false)}>Continue Shopping</NotificationButton>
        </AddedToCartNotification>
      )}
    </PageWrapper>
  )
}

export async function getServerSideProps(context) {
  await dbConnect()
  const { id } = context.query
  const product = await Product.findById(id)
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  }
}

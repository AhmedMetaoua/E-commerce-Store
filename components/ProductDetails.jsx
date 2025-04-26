"use client"

import { useState, useContext } from "react"
import Image from "next/image"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { CartContext } from "@/components/CartContext"
import Header from "@/components/Header"
import { Button } from "@/components/ui/Button"
import { WishlistContext } from "./WishlistContext"

export default function ProductDetails({ product }) {
  const { addProduct } = useContext(CartContext)
  const { addToWishlist, removeFromWishlist, wishlistProducts} = useContext(WishlistContext)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleAddToCart = () => {
    addProduct(product._id)
  }
  const isInWishlist = wishlistProducts?.includes(_id);
  const toggleWishlist = () => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
        removeFromWishlist(product._id)
    }else {
        addToWishlist(product._id)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images Section */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative aspect-square">
              <Image
                src={product.images?.[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

            <div className="text-2xl font-bold text-gray-900 mb-6">${product.price}</div>

            <div className="prose prose-sm text-gray-500 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button onClick={handleAddToCart} className="flex items-center justify-center gap-2 py-6" size="lg">
                <ShoppingCart className="w-5 h-5" />
                Add to cart
              </Button>

              <Button
                onClick={toggleWishlist}
                variant="outline"
                className="flex items-center justify-center gap-2 py-6"
                size="lg"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
                {isInWishlist ? "In wishlist" : "Add to wishlist"}
              </Button>
            </div>

            {/* Additional product details */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Material</span>
                    <span className="font-medium">Premium</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Availability</span>
                    <span className="font-medium text-green-600">In Stock</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">SKU</span>
                    <span className="font-medium">{product._id.substring(0, 8)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { createContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

export const WishlistContext = createContext({})

export function WishlistContextProvider({ children }) {
  const [wishlistProducts, setWishlistProducts] = useState([])
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      // Load wishlist from server when user is authenticated
      axios.get('/api/wishlist')
        .then(response => {
          setWishlistProducts(response.data)
        })
        .catch(error => {
          console.error('Error loading wishlist:', error)
        })
    } else if (status === "unauthenticated") {
      // Load wishlist from localStorage when user is not authenticated
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        setWishlistProducts(JSON.parse(savedWishlist))
      }
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      // Save wishlist to server when user is authenticated
      axios.post('/api/wishlist', { products: wishlistProducts })
        .catch(error => {
          console.error('Error saving wishlist:', error)
        })
    } else if (status === "unauthenticated") {
      // Save wishlist to localStorage when user is not authenticated
      localStorage.setItem('wishlist', JSON.stringify(wishlistProducts))
    }
  }, [wishlistProducts, status])

  const addToWishlist = (productId) => {
    if (status !== "authenticated") {
      // Redirect to login if user is not authenticated
      window.location.href = '/login'
      return
    }
    setWishlistProducts(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId]
      }
      return prev
    })
  }

  const removeFromWishlist = (productId) => {
    if (status !== "authenticated") return
    setWishlistProducts(prev => prev.filter(id => id !== productId))
  }

  const clearWishlist = () => {
    if (status !== "authenticated") return
    setWishlistProducts([])
  }

  const isInWishlist = (productId) => {
    return wishlistProducts.includes(productId)
  }

  return (
    <WishlistContext.Provider value={{
      wishlistProducts,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      isAuthenticated: status === "authenticated"
    }}>
      {children}
    </WishlistContext.Provider>
  )
} 
"use client"

import { createContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

export const CartContext = createContext({})

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([])
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      // Load cart from server when user is authenticated
      axios.get('/api/cart')
        .then(response => {
          setCartProducts(response.data)
        })
        .catch(error => {
          console.error('Error loading cart:', error)
        })
    } else if (status === "unauthenticated") {
      // Load cart from localStorage when user is not authenticated
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartProducts(JSON.parse(savedCart))
      }
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      // Save cart to server when user is authenticated
      axios.post('/api/cart', { products: cartProducts })
        .catch(error => {
          console.error('Error saving cart:', error)
        })
    } else if (status === "unauthenticated") {
      // Save cart to localStorage when user is not authenticated
      localStorage.setItem('cart', JSON.stringify(cartProducts))
    }
  }, [cartProducts, status])

  const addProduct = (productId) => {
    if (status !== "authenticated") {
      // Redirect to login if user is not authenticated
      window.location.href = '/login'
      return
    }
    setCartProducts(prev => [...prev, productId])
  }

  const removeProduct = (productId) => {
    if (status !== "authenticated") return
    setCartProducts(prev => {
      const pos = prev.indexOf(productId)
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos)
      }
      return prev
    })
  }

  const clearCart = () => {
    if (status !== "authenticated") return
    setCartProducts([])
  }

  return (
    <CartContext.Provider value={{
      cartProducts,
      addProduct,
      removeProduct,
      clearCart,
      isAuthenticated: status === "authenticated"
    }}>
      {children}
    </CartContext.Provider>
  )
}
"use client"

import Link from "next/link"
import { useContext, useState, useRef, useEffect } from "react"
import styled, { css } from "styled-components"
import Center from "./ui/Center"
import { CartContext } from "./CartContext"
import BarsIcon from "./icons/Bars"
import { ChevronDown } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

const StyledHeader = styled.header`
  background-color: #111;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled(Link)`
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  position: relative;
  z-index: 4;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`

const NavOverlay = styled.div`
  display: ${({ $active }) => ($active ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2;
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const StyledNav = styled.nav`
  ${({ $mobileNavActive }) =>
    $mobileNavActive
      ? css`
          transform: translateY(0%);
          opacity: 1;
          pointer-events: all;
        `
      : css`
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        `}
  transition: all 0.4s ease;
  gap: 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 80px 24px 40px;
  background: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(8px);
  z-index: 3;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    position: static;
    padding: 0;
    transform: none;
    background-color: transparent;
    opacity: 1;
    pointer-events: auto;
  }
`

const NavLink = styled(Link)`
  display: block;
  color: #ccc;
  font-weight: 500;
  text-decoration: none;
  padding: 14px 0;
  font-size: 1.1rem;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }

  @media screen and (min-width: 768px) {
    padding: 0;
    font-size: 1rem;
  }
`

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  cursor: pointer;
  position: relative;
  z-index: 4;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.9);
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`

const DropdownContainer = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: #ccc;
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 14px 0;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }

  @media screen and (min-width: 768px) {
    padding: 0;
    font-size: 1rem;
  }
`

const DropdownContent = styled.div`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  background-color: #222;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 5;
  border-radius: 4px;
  overflow: hidden;
  
  @media screen and (max-width: 767px) {
    position: relative;
    box-shadow: none;
    background-color: #333;
    margin: 5px 0;
  }
`

const DropdownItem = styled(Link)`
  color: #ccc;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: #333;
    color: #fff;
  }
`

export default function Header() {
  const [mobileNavActive, setMobileNavActive] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { cartProducts } = useContext(CartContext)
  const { data: session, status } = useSession()

  const categoriesRef = useRef(null)
  const accountRef = useRef(null)


  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">E-Commerce</Logo>
          <StyledNav $mobileNavActive={mobileNavActive}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All Products</NavLink>

            {/* <DropdownContainer ref={categoriesRef}>
              <DropdownButton onClick={() => setCategoriesOpen(!categoriesOpen)}>
                Categories <ChevronDown size={16} />
              </DropdownButton>
              <DropdownContent $isOpen={categoriesOpen}>
                {categories.map((category) => (
                  <DropdownItem
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category.name}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </DropdownContainer> */}

            {session ? (
              <DropdownContainer ref={accountRef}>
                <DropdownButton onClick={() => setAccountOpen(!accountOpen)}>
                  Account ({session?.user?.name}) <ChevronDown size={16} />
                </DropdownButton>
                <DropdownContent $isOpen={accountOpen}>
                  <DropdownItem href="/account/settings" onClick={() => setAccountOpen(false)}>
                    Settings
                  </DropdownItem>
                  <DropdownItem href="/wishlist" onClick={() => setAccountOpen(false)}>
                    Favorites
                  </DropdownItem>
                  <DropdownItem href="/" onClick={ async () => {
                    await signOut();
                    setAccountOpen(false)
                    }}>
                    Logout
                  </DropdownItem>
                </DropdownContent>
              </DropdownContainer>
            ) : (
              <NavLink href="/login">Login</NavLink>
            )}

            <NavLink href="/card">Cart ({cartProducts.length})</NavLink>
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive(true)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
      <NavOverlay $active={mobileNavActive} onClick={() => setMobileNavActive(false)} />
    </StyledHeader>
  )
}

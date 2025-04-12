import Link from 'next/link';
import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import Center from './Center';
import { CartContext } from './CartContext';
import BarsIcon from './icons/Bars';

const StyledHeader = styled.header`
  background-color: #111;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  position: relative;
  z-index: 4;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const NavOverlay = styled.div`
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

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
`;

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
`;

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
`;

export default function Header() {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const { cartProducts } = useContext(CartContext);

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">E-Commerce</Logo>
          <StyledNav $mobileNavActive={mobileNavActive}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All Products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/cart">Cart ({cartProducts.length})</NavLink>
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
      <NavOverlay $active={mobileNavActive} onClick={() => setMobileNavActive(false)} />
    </StyledHeader>
  );
}

"use client"
import styled from "styled-components"
import Link from "next/link"
import Center from "./ui/Center"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const StyledFooter = styled.footer`
  background-color: #111;
  color: #ccc;
  padding: 60px 0 30px;
  margin-top: 80px;
`

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const FooterTitle = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 600;
`

const FooterLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s;
  
  &:hover {
    color: #fff;
  }
`

const FooterText = styled.p`
  color: #aaa;
  margin-bottom: 20px;
  line-height: 1.6;
`

const SocialIcons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
`

const SocialIcon = styled.a`
  color: #aaa;
  transition: color 0.3s;
  
  &:hover {
    color: #fff;
  }
`

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`

const NewsletterInput = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: none;
  background-color: #222;
  color: #fff;
  
  &:focus {
    outline: 1px solid #444;
  }
`

const SubscribeButton = styled.button`
  padding: 12px;
  border-radius: 4px;
  border: none;
  background-color: #444;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #555;
  }
`

const Copyright = styled.div`
  text-align: center;
  padding-top: 30px;
  margin-top: 40px;
  border-top: 1px solid #333;
  color: #777;
  font-size: 0.9rem;
`

const PaymentMethods = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`

const PaymentIcon = styled.div`
  background-color: #222;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.8rem;
  color: #aaa;
`

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    alert("Thank you for subscribing to our newsletter!")
  }

  return (
    <StyledFooter>
      <Center>
        <FooterGrid>
          <FooterColumn>
            <FooterTitle>About E-Commerce</FooterTitle>
            <FooterText>
              We are dedicated to providing the best shopping experience with high-quality products and exceptional
              customer service. Shop with confidence and discover why our customers love us.
            </FooterText>
            <SocialIcons>
              <SocialIcon href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Facebook size={20} />
              </SocialIcon>
              <SocialIcon href="https://instagram.com" target="_blank" aria-label="Instagram">
                <Instagram size={20} />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" aria-label="Twitter">
                <Twitter size={20} />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" target="_blank" aria-label="YouTube">
                <Youtube size={20} />
              </SocialIcon>
            </SocialIcons>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Customer Service</FooterTitle>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/shipping">Shipping & Delivery</FooterLink>
            <FooterLink href="/returns">Returns & Exchanges</FooterLink>
            <FooterLink href="/terms">Terms & Conditions</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>My Account</FooterTitle>
            <FooterLink href="/account/login">Sign In</FooterLink>
            <FooterLink href="/account/register">Register</FooterLink>
            <FooterLink href="/account/orders">Order History</FooterLink>
            <FooterLink href="/account/favorites">My Wishlist</FooterLink>
            <FooterLink href="/cart">View Cart</FooterLink>
            <FooterLink href="/track-order">Track My Order</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Newsletter</FooterTitle>
            <FooterText>
              Subscribe to our newsletter to receive updates on new arrivals, special offers, and other discount
              information.
            </FooterText>
            <NewsletterForm onSubmit={handleSubmit}>
              <NewsletterInput type="email" placeholder="Your email address" required />
              <SubscribeButton type="submit">Subscribe</SubscribeButton>
            </NewsletterForm>
          </FooterColumn>
        </FooterGrid>

        <PaymentMethods>
          <PaymentIcon>Visa</PaymentIcon>
          <PaymentIcon>Mastercard</PaymentIcon>
          <PaymentIcon>PayPal</PaymentIcon>
          <PaymentIcon>Apple Pay</PaymentIcon>
          <PaymentIcon>Google Pay</PaymentIcon>
        </PaymentMethods>

        <Copyright>
          <p>© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
        </Copyright>
      </Center>
    </StyledFooter>
  )
}

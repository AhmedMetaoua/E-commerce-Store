'use client';

import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Link from "next/link"
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

import { primary } from '@/lib/colors';
import Button from '@/components/ui/Button';
import { CartContext } from '@/components/CartContext';
import Center from '@/components/ui/Center';
import Header from '@/components/Header';
import Input from '@/components/ui/Input';
import LoginPage from './login';
import { useSession } from 'next-auth/react';

const PageContainer = styled.div`
  min-height: 80vh;
  background-color: #f9fafb;
  padding-bottom: 60px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #111827;

  @media screen and (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  margin: 0 0 30px 0;
  font-size: 1rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-top: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 25px;
  transition: all 0.2s ease-in-out;

  @media screen and (min-width: 768px) {
    padding: 30px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${primary};
  }
`;

const CartItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CartItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  background-color: #f9fafb;
  position: relative;

  @media screen and (min-width: 768px) {
    grid-template-columns: 100px 1fr auto;
    padding: 20px;
  }
`;

const ProductImageBox = styled.div`
  width: 80px;
  height: 80px;
  padding: 8px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @media screen and (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #111827;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin-top: 5px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;

  @media screen and (min-width: 768px) {
    margin-top: 0;
  }
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  color: ${primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    background-color: ${primary};
    color: #fff;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const QuantityLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s;

  &:hover {
    color: #ef4444;
  }
`;

const CartSummary = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #6b7280;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const StyledInput = styled(Input)`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    border-color: ${primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CheckoutButton = styled(Button)`
  background-color: ${primary};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyCartIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    color: #9ca3af;
    width: 40px;
    height: 40px;
  }
`;

const EmptyCartTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #111827;
`;

const EmptyCartText = styled.p`
  color: #6b7280;
  margin: 0 0 20px 0;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ecfdf5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    color: #10b981;
    width: 40px;
    height: 40px;
  }
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #111827;
`;

const SuccessText = styled.p`
  color: #6b7280;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
`;

const ContinueShoppingButton = styled(Link)`
  background-color: #f9fafb;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
`;

export default function CartPage() {
  const { data: session, status } = useSession()
  
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.href.includes('success')
    ) {
      clearCart();
      setIsSuccess(true);
      axios.get('/api/cart').then((response) => {
        setProducts(response.data);
      });
    }
  }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);


  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  function removeItemCompletely(id) {
    // Remove all instances of this product
    const quantity = cartProducts.filter(
      (productId) => productId === id
    ).length;
    for (let i = 0; i < quantity; i++) {
      removeProduct(id);
    }
  }

  // Calculate subtotal
  let subtotal = 0;
  for (const productId of cartProducts) {
    const price = products?.find((p) => p._id === productId)?.price || 0;
    subtotal += price;
  }

  // Calculate shipping (example: free shipping over 100, otherwise 10)
  const shipping = subtotal > 100 ? 0 : 10;

  // Calculate total
  const total = subtotal + shipping;

  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });

    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <PageContainer>
          <Center>
            <SuccessContainer>
              <SuccessIcon>
                <CheckCircle />
              </SuccessIcon>
              <SuccessTitle>Thank you for your order!</SuccessTitle>
              <SuccessText>We'll email you when your order ships.</SuccessText>
              <ContinueShoppingButton href="/">
                <ShoppingBag size={18} />
                Continue Shopping
              </ContinueShoppingButton>
            </SuccessContainer>
          </Center>
        </PageContainer>
      </>
    );
  }

  if (!session) {
    return <LoginPage/>
  }
  return (
    <>
      <Header />
      <PageContainer>
        <Center>
          <PageTitle>Your Cart</PageTitle>
          <PageSubtitle>Review your items and proceed to checkout</PageSubtitle>

          <ColumnsWrapper>
            <Card>
              <CardTitle>
                <ShoppingCart size={22} />
                Shopping Cart
              </CardTitle>

              {!cartProducts?.length && (
                <EmptyCartContainer>
                  <EmptyCartIcon>
                    <ShoppingCart />
                  </EmptyCartIcon>
                  <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
                  <EmptyCartText>
                    Looks like you haven't added anything to your cart yet.
                  </EmptyCartText>
                  <ContinueShoppingButton href="/">
                    <ShoppingBag size={18} />
                    Start Shopping
                  </ContinueShoppingButton>
                </EmptyCartContainer>
              )}

              {products?.length > 0 && (
                <>
                  <CartItemsList>
                    <AnimatePresence>
                      {products.map((product) => {
                        const quantity = cartProducts.filter(
                          (id) => id === product._id
                        ).length;
                        if (quantity === 0) return null;

                        return (
                          <CartItem
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ProductImageBox>
                              <img
                                src={product.images[0] || '/placeholder.svg'}
                                alt={product.title}
                              />
                            </ProductImageBox>

                            <ProductInfo>
                              <div>
                                <ProductTitle>{product.title}</ProductTitle>
                                <ProductPrice>{product.price} DT</ProductPrice>
                              </div>

                              <QuantityControl>
                                <QuantityButton
                                  onClick={() => lessOfThisProduct(product._id)}
                                >
                                  <Minus size={16} />
                                </QuantityButton>
                                <QuantityLabel>{quantity}</QuantityLabel>
                                <QuantityButton
                                  onClick={() => moreOfThisProduct(product._id)}
                                >
                                  <Plus size={16} />
                                </QuantityButton>
                              </QuantityControl>
                            </ProductInfo>

                            <RemoveButton
                              onClick={() => removeItemCompletely(product._id)}
                            >
                              <Trash2 size={18} />
                            </RemoveButton>
                          </CartItem>
                        );
                      })}
                    </AnimatePresence>
                  </CartItemsList>

                  <CartSummary>
                    <SummaryRow>
                      <span>Subtotal</span>
                      <span>{subtotal} DT</span>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `${shipping} DT`}</span>
                    </SummaryRow>
                    <SummaryTotal>
                      <span>Total</span>
                      <span>{total} DT</span>
                    </SummaryTotal>
                  </CartSummary>
                </>
              )}
            </Card>

            {!!cartProducts?.length && (
              <Card>
                <CardTitle>Checkout Information</CardTitle>
                <FormGrid>
                  <StyledInput
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <StyledInput
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormRow>
                    <StyledInput
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <StyledInput
                      type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </FormRow>
                  <StyledInput
                    type="text"
                    placeholder="Street Address"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                  <StyledInput
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </FormGrid>
                <CheckoutButton onClick={goToPayment}>
                  Proceed to Payment
                  <ArrowRight size={18} />
                </CheckoutButton>
              </Card>
            )}
          </ColumnsWrapper>
        </Center>
      </PageContainer>
    </>
  );
}

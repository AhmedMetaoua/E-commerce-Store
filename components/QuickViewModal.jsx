'use client';

import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { X, ShoppingCart, Heart } from 'lucide-react';
import Button from './ui/Button';
import { CartContext } from './CartContext';
import { WishlistContext } from './WishlistContext';
import { primary } from '@/lib/colors';
import { createPortal } from 'react-dom';

// Update the ModalOverlay component to ensure it's positioned correctly and has a high enough z-index
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100; // Increased z-index to ensure it appears above all other elements
  padding: 20px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

// Update the ModalContent to ensure it's properly sized and positioned
const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transform: ${(props) =>
    props.$isOpen ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.3s ease;
  position: relative; // Ensure position is relative for absolute positioning of children

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  color: #555;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: #f3f4f6;
    transform: scale(1.1);
  }
`;

const ImageSection = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  position: relative;
  border-radius: 16px 16px 0 0;

  @media screen and (min-width: 768px) {
    border-radius: 16px 0 0 16px;
  }

  img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px 0;
`;

const ProductPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
  margin: 10px 0;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    margin-left: 4px;
  }
`;

const ProductDescription = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 15px 0;
`;

const StockInfo = styled.div`
  font-size: 0.9rem;
  color: ${(props) => (props.$inStock ? '#10b981' : '#ef4444')};
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const WishlistButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${(props) => (props.$active ? primary : 'inherit')};
    fill: ${(props) => (props.$active ? primary : 'none')};
  }
`;

export default function QuickViewModal({ isOpen, onClose, product }) {
  const { addProduct } = useContext(CartContext);
  const { wishlistProducts, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (product && wishlistProducts) {
      setIsInWishlist(wishlistProducts.includes(product._id));
    }
  }, [product, wishlistProducts]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Update the useEffect for preventing body scroll to handle cleanup properly
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';

      // Cleanup function to restore original style
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!product) return null;

  const isOutOfStock = product.quantity <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addProduct(product._id);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return createPortal(
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ImageSection>
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.title}
          />
        </ImageSection>

        <InfoSection>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice>
            {product.price} <span>DT</span>
          </ProductPrice>

          <StockInfo $inStock={!isOutOfStock}>
            {isOutOfStock ? 'Out of stock' : `In stock`}
          </StockInfo>

          <ProductDescription>{product.description}</ProductDescription>

          <ActionButtons>
            <Button primary onClick={handleAddToCart} disabled={isOutOfStock}>
              <ShoppingCart size={18} />
              {isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>

            <WishlistButton
              outline
              onClick={toggleWishlist}
              $active={isInWishlist}
            >
              <Heart size={18} />
              {isInWishlist ? 'In wishlist' : 'Add to wishlist'}
            </WishlistButton>
          </ActionButtons>
        </InfoSection>
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root') || document.body
  );
}

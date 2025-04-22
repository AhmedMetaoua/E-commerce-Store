'use client';

import { useContext, useState } from 'react';
import styled from 'styled-components';
import Button from './ui/Button';
import CartIcon from './icons/CartIcon';
import Link from 'next/link';
import { CartContext } from './CartContext';
import { WishlistContext } from './WishlistContext';
import { Heart, Eye, AlertCircle } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import { primary } from '@/lib/colors';

const ProductWrapper = styled.div`
  position: relative;
  transition: all 0.4s ease;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const NewBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(to right, #4f46e5, #8b5cf6);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  top: 12px;
  left: ${(props) => (props.$hasNewBadge ? '90px' : '12px')};
  background: linear-gradient(to right, #ef4444, #f97316);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WhiteBox = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 25px;
  height: 200px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.03);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  img {
    max-width: 100%;
    max-height: 160px;
    object-fit: contain;
    transition: transform 0.5s ease;
    ${(props) => (props.$outOfStock ? 'opacity: 0.7;' : '')}
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const OutOfStockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const OutOfStockText = styled.div`
  background: rgba(239, 68, 68, 0.9);
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  transform: rotate(-10deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const QuickActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 3;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;

  ${ProductWrapper}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ActionButton = styled.button`
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

  &:hover {
    background: ${(props) => (props.$active ? primary : '#f0f0f0')};
    color: ${(props) => (props.$active ? 'white' : '#555')};
    transform: scale(1.1);

    svg {
      color: ${(props) => (props.$active ? 'white' : primary)};
      fill: ${(props) => (props.$active ? 'white' : primary)};
    }
  }

  svg {
    color: ${(props) => (props.$active ? primary : '#555')};
    fill: ${(props) => (props.$active ? primary : 'none')};
    transition: color 0.2s ease, fill 0.2s ease;
  }
`;

const ProductInfoBox = styled.div`
  padding: 20px;
`;

const Title = styled(Link)`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
  }
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;

  span {
    font-size: 0.85rem;
    font-weight: 500;
    color: #666;
    margin-left: 4px;
  }
`;

const StockInfo = styled.div`
  font-size: 0.8rem;
  color: ${(props) => (props.$inStock ? '#10b981' : '#ef4444')};
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AddToCartButton = styled(Button)`
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    transform: ${(props) => (props.$disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${(props) =>
      props.$disabled ? 'none' : '0 5px 15px rgba(79, 70, 229, 0.3)'};
  }

  svg {
    margin-right: ${(props) => (props.$hasText ? '6px' : '0')};
  }
`;

export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
  quantity,
  createdAt,
  ...restProps
}) {
  const { addProduct } = useContext(CartContext);
  const { wishlistProducts, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [showFullButton, setShowFullButton] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const url = '/product/' + _id;

  const isOutOfStock = quantity <= 0;
  const isNew =
    new Date(createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isInWishlist = wishlistProducts?.includes(_id);

  // Truncate description if it's too long
  const shortDescription =
    description && description.length > 60
      ? description.substring(0, 60) + '...'
      : description;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addProduct(_id);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist(_id);
    } else {
      addToWishlist(_id);
    }
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // document.body.style.overflow = "hidden" // Ensure body doesn't scroll when modal opens
    setShowQuickView(true);
  };

  // Combine all product data for the quick view modal
  const productData = {
    _id,
    title,
    description,
    price,
    images,
    quantity,
    ...restProps,
  };

  return (
    <>
      <ProductWrapper
        onMouseEnter={() => setShowFullButton(true)}
        onMouseLeave={() => setShowFullButton(false)}
      >
        {isNew && <NewBadge>New</NewBadge>}
        {isOutOfStock && (
          <OutOfStockBadge $hasNewBadge={isNew}>
            <AlertCircle size={12} />
            Out of stock
          </OutOfStockBadge>
        )}

        <WhiteBox href={url} $outOfStock={isOutOfStock}>
          <img src={images?.[0] || '/placeholder.svg'} alt={title} />
        </WhiteBox>

        <QuickActions>
          <ActionButton
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={toggleWishlist}
            $active={isInWishlist}
          >
            <Heart size={16} />
          </ActionButton>
          <ActionButton title="Quick view" onClick={openQuickView}>
            <Eye size={16} />
          </ActionButton>
        </QuickActions>

        <ProductInfoBox>
          <Title href={url}>{title}</Title>
          {shortDescription && <Description>{shortDescription}</Description>}

          <StockInfo $inStock={!isOutOfStock}>
            {isOutOfStock ? 'Out of stock' : `Available`}
          </StockInfo>

          <PriceRow>
            <Price>
              {price} <span>DT</span>
            </Price>
            <AddToCartButton
              primary
              outline={!showFullButton}
              $hasText={showFullButton}
              onClick={handleAddToCart}
              $disabled={isOutOfStock}
              disabled={isOutOfStock}
            >
              <CartIcon />
              {showFullButton && (isOutOfStock ? 'Unavailable' : 'Add to cart')}
            </AddToCartButton>
          </PriceRow>
        </ProductInfoBox>
      </ProductWrapper>

      {/* Move the modal outside of ProductWrapper to ensure it's not affected by parent styling */}
      {showQuickView && (
        <QuickViewModal
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            // document.body.style.overflow = "auto" // Restore scrolling when modal closes
          }}
          product={productData}
        />
      )}
    </>
  );
}

import React, { useContext } from 'react';
import styled from 'styled-components';
import Button from './Button';
import CartIcon from './icons/CartIcon';
import Link from 'next/link';
import { CartContext } from './CartContext';

const ProductWrapper = styled.div`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 5px 2px 8px rgba(0,0,0,0.06);
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;

const WhiteBox = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:rgb(255, 255, 255);
  padding: 20px;
  height: 140px;
  img {
    max-width: 100%;
    max-height: 140px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

const ProductInfoBox = styled.div`
  padding: 15px 20px;
`;

const Title = styled(Link)`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  &:hover {
    color:rgb(42, 0, 209);
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #222;
`;

export default function ProductBox({ _id, title, description, price, images }) {
  const { addProduct } = useContext(CartContext);
  const url = '/product/' + _id;

  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <img src={images?.[0]} alt={title} />
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>{price} DT</Price>
          <Button primary outline onClick={() => addProduct(_id)}>
            <CartIcon />
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}

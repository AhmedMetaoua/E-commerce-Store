import React from 'react'
import styled from 'styled-components'
import Center from './Center'
import ProductsGrid from '@/components/ProductsGrid'


const SectionWrapper = styled.section`
  background:rgb(225, 225, 225);
  padding: 20px 20px;
  border-radius: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  margin: 30px 0;
`;
const Title = styled.h2`
    font-size: 2rem;
    margin: 30px 0 20px;
    font-weight: normal;
`
export default function NewProducts({ products }) {
  return (
    <Center>
      <SectionWrapper>
        <Title>🆕 New Arrivals</Title>
        <ProductsGrid products={products} />
      </SectionWrapper>
    </Center>
  );
}

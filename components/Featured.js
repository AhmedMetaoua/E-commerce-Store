import React, { useContext } from 'react'
import Center from './Center'
import styled from 'styled-components'
import Button from './Button';
import ButtonLink from './ButtonLink';
import CartIcon from './icons/CartIcon';
import { CartContext } from './CartContext';

const Bg = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  padding: 80px 0;
`;

const Title = styled.h1`
    font-weight: normal;
    margin: 0;
    font-size: 1.5rem;
    @media screen and (min-width: 768px) {
        font-size: 3rem;
    }
`;
const Desc = styled.p`
    color: #aaa;
    font-size: .8rem;
`
const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;

    gap: 40px;
    img {
        max-width: 100%;
        amx-height: 200px;
        display: block;
        amrgin: 0 auto;
    }
    
    div:nth-child(1) {
        order: 2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 1.2fr;
        div:nth-child(1) {
            order: 0;
        }
            gap: 40px;
        img {
            max-width: 100%;
        }
    }
`
const Column = styled.div`
    display: flex;
    align-items: center;
`
const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`

export default function Featured({product}) {
    console.log(product)
    const {addProduct} = useContext(CartContext);
    function addFeatureToCart() {
        addProduct(product._id)
    }
  return (
    <div>
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description}</Desc>
                            <ButtonsWrapper>
                                <ButtonLink href={'/product/'+product._id} outline={1} white={1} >Read More</ButtonLink>
                                <Button white={1} onClick={() => addFeatureToCart()} >
                                    <CartIcon/>
                                    Add To Cart
                                </Button>
                            </ButtonsWrapper>
                        </div>
                    </Column>
                    <Column>
                        <img src={product.images[0]} alt=''/>
                    </Column>
                </ColumnsWrapper>
            </Center>
        </Bg>
    </div>
  )
}

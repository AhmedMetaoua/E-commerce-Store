import Button from '@/components/Button'
import { CartContext } from '@/components/CartContext'
import Center from '@/components/Center'
import Header from '@/components/Header'
import Input from '@/components/Input'
import Table from '@/components/Table'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .7fr;
    }
    gap: 40px;
    margin-top: 40px;
` 
const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`
const ProductInfoCell = styled.td`
    padding: 10px 0;
`
const ProductImageBox = styled.div`
    width: 70px;
    height: 90px;
    padding: 2px;
    border : 2px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 70px;
        max-height: 70px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        width: 50px;
        height: 50px;
        img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`
const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;

    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`
const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`


export default function CartPage() {

    const {cartProducts, addProduct, removeProduct, clearCart} =useContext(CartContext);
    const [products,setProducts] = useState([])
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [city,setCity] = useState('')
    const [postalCode,setPostalCode] = useState('')
    const [streetAddress,setStreetAddress] = useState('')
    const [country,setCountry] = useState('')

    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (cartProducts.length > 0) {  
            axios.post('/api/cart',{ids: cartProducts}).then(response => {
                setProducts(response.data)
            })
        }else {
            setProducts([])
        }
    },[cartProducts])
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.href.includes('success')) {
            clearCart();
            setIsSuccess(true);
        }
    }, []);

    function moreOfThisProduct(id) {
        addProduct(id);
    }
    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    async function goToPayment() {
        const response = await axios.post('/api/checkout', {name, email, city, postalCode, streetAddress, country, cartProducts})
        if (response.data.url) {
            window.location = response.data.url
        }
    }

    if (isSuccess) {
        return (
            <>
                <Header/>
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>we will email you when your order will be sent.</p>
                        </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        )
    }
  return (
    <>
        <Header/>

        <Center>
        <ColumnsWrapper>
            <Box>
                <h2>Cart</h2>
                {!cartProducts?.length && (
                    <div>Your cart is empty</div>
                )}
                {products?.length > 0 && (
                    <Table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantité</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product,index) => 
                                <tr key={index}>
                                    <ProductInfoCell>
                                        {product.title}
                                        <ProductImageBox>
                                            <img src={product.images[0]} alt='' />
                                        </ProductImageBox>
                                    </ProductInfoCell>
                                    <td>
                                        <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                        <QuantityLabel>
                                            {cartProducts.filter(id => id === product._id).length}
                                        </QuantityLabel>
                                        <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                    </td>
                                    <td>{cartProducts.filter(id => id === product._id).length * product.price} DT</td>
                                </tr>
                            )}
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{total} DT</td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </Box>
            {!!cartProducts?.length && (
            <Box>
                <h2>Order Information</h2>
                <Input type='text' placeholder='Name' value={name} name='name' onChange={e => setName(e.target.value)} />
                <Input type='text' placeholder='Email' value={email} name='email' onChange={e => setEmail(e.target.value)}/>
                <CityHolder>
                    <Input type='text' placeholder='City' value={city} name='city' onChange={e => setCity(e.target.value)}/>
                    <Input type='text' placeholder='Postal Code' value={postalCode} name='postalCode' onChange={e => setPostalCode(e.target.value)}/>
                </CityHolder>
                <Input type='text' placeholder='Street Address' value={streetAddress} name='streetAddress' onChange={e => setStreetAddress(e.target.value)}/>
                <Input type='text' placeholder='Country' value={country} name='country' onChange={e => setCountry(e.target.value)}/>
                <input type='hidden' name='products' value={cartProducts.join(',')}/>
                <Button black block onClick={goToPayment}>Continue to payment</Button>

            </Box>
            )}
        </ColumnsWrapper>
        </Center>
    </>
  )
}

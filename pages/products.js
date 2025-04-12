import Center from '@/components/Center'
import Header from '@/components/Header'
import ProductsGrid from '@/components/ProductsGrid'
import Title from '@/components/Title'
import dbConnect from '@/lib/mongoose'
import Product from '@/models/Product'
import React from 'react'


export default function ProductsPage({products}) {
  return (
    <>
        <Header/>

        <Center>
            <Title>All Products</Title>
            <ProductsGrid products={products}/>

        </Center>
    </>
    
  )
}


export async function getServerSideProps() {
    await dbConnect()
    const products = await Product.find({}, null, {sort:{'_id':-1}})
    return {
        props:{
            products: JSON.parse(JSON.stringify(products)),
        }}
}
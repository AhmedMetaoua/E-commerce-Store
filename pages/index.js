import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import dbConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import Product from "@/models/Product";
import Setting from "@/models/Setting";
import styled from "styled-components";

const PageContainer = styled.div`
  background-color: #f8f8f8;
  font-family: 'Poppins', sans-serif;
`

export default function Home({ featuredProduct, newProducts, categories }) {
  return (
    <PageContainer>
      <Header />
      <Featured product={featuredProduct} />
      <HomePage products={newProducts} categories={categories}/>
      <Footer/>
    </PageContainer>
  )
}

export async function getServerSideProps() {
  await dbConnect();
  const newProducts = await Product.find({}, null, { sort: { '_id': -1 } });
  const categories = await Category.find({});
  const product = await Setting.findOne({}, { featuredProduct: 1 }).populate('featuredProduct');

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(product.featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}

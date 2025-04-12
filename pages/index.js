import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import styled from "styled-components";

const PageContainer = styled.div`
  background-color: #f8f8f8;
  font-family: 'Poppins', sans-serif;
`;

export default function Home({ featuredProduct, newProducts }) {
  return (
    <PageContainer>
      <Header />
      <Featured product={featuredProduct[0]} />
      <NewProducts products={newProducts} />
    </PageContainer>
  );
}

export async function getServerSideProps() {
  const featuredProductId = '67ef040d7dee371813faafa4';
  await dbConnect();
  const featuredProduct = await Product.find({}, null, { sort: { '_id': -1 }, limit: 1 });
  const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 8 });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}

import styled from "styled-components"
import ProductBox from "./ProductBox"

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  
  @media screen and (min-width: 500px) {
    grid-template-columns: ${(props) => (props.$view === "grid2" ? "1fr" : "1fr 1fr")};
  }
  
  @media screen and (min-width: 768px) {
    grid-template-columns: ${(props) => (props.$view === "grid2" ? "1fr" : "repeat(3, 1fr)")};
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: ${(props) => (props.$view === "grid2" ? "1fr 1fr" : "repeat(4, 1fr)")};
  }
`

const ProductListItem = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (min-width: 640px) {
    flex-direction: row;
    gap: 20px;
  }
`

const ProductImageContainer = styled.div`
  width: 100%;
  
  @media screen and (min-width: 640px) {
    width: 250px;
    flex-shrink: 0;
  }
`

const ProductInfoContainer = styled.div`
  flex-grow: 1;
  padding: 20px 0;
  
  @media screen and (min-width: 640px) {
    padding: 0;
  }
`

export default function ProductsGrid({ products, view = "grid4" }) {
  if (view === "grid2") {
    return (
      <StyledProductsGrid $view={view}>
        {products?.length > 0 &&
          products.map((product) => (
            <ProductListItem key={product._id}>
              <ProductImageContainer>
                <ProductBox {...product} listView={true} />
              </ProductImageContainer>
              <ProductInfoContainer>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div>
                  <strong>{product.price} DT</strong>
                </div>
              </ProductInfoContainer>
            </ProductListItem>
          ))}
      </StyledProductsGrid>
    )
  }

  return (
    <StyledProductsGrid $view={view}>
      {products?.length > 0 && products.map((product) => <ProductBox key={product._id} {...product} />)}
    </StyledProductsGrid>
  )
}

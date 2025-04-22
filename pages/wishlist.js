'use client';

import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { WishlistContext } from '@/components/WishlistContext';
import { useSession } from 'next-auth/react';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductBox from '@/components/ProductBox';
import { Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const PageContainer = styled.div`
  min-height: 80vh;
  background-color: #f9fafb;
  padding-bottom: 60px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #ef4444;
  }

  @media screen and (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  margin: 0 0 30px 0;
  font-size: 1rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  @media screen and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const EmptyWishlist = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  svg {
    width: 60px;
    height: 60px;
    color: #d1d5db;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #111827;
  }

  p {
    color: #6b7280;
    margin-bottom: 30px;
  }
`;

export default function WishlistPage() {
  const { wishlistProducts, clearWishlist } = useContext(WishlistContext);
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistProducts?.length > 0) {
        try {
          setLoading(true);
          const response = await axios.post('/api/products', { ids: wishlistProducts });
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching wishlist products:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [wishlistProducts]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <>
        <Header />
        <PageContainer>
          <Center>
            <EmptyWishlist>
              <Heart size={60} />
              <h2>Please sign in</h2>
              <p>You need to be signed in to view your wishlist.</p>
              <Link href="/login">
                <Button primary>Sign In</Button>
              </Link>
            </EmptyWishlist>
          </Center>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <Center>
          <PageTitle>
            <Heart />
            My Favorites
          </PageTitle>
          <PageSubtitle>
            {products.length > 0
              ? `You have ${products.length} item${
                  products.length > 1 ? 's' : ''
                } in your wishlist`
              : 'Your wishlist is empty'}
          </PageSubtitle>

          {loading ? (
            <div>Loading...</div>
          ) : products.length > 0 ? (
            <>
              <ProductsGrid>
                {products.map((product) => (
                  <ProductBox key={product._id} {...product} />
                ))}
              </ProductsGrid>

              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <Button onClick={clearWishlist}>Clear Wishlist</Button>
              </div>
            </>
          ) : (
            <EmptyWishlist>
              <Heart size={60} />
              <h2>Your wishlist is empty</h2>
              <p>
                Add items you love to your wishlist. Review them anytime and
                easily move them to the cart.
              </p>
              <Link href="/products">
                <Button primary>Continue Shopping</Button>
              </Link>
            </EmptyWishlist>
          )}
        </Center>
      </PageContainer>
    </>
  );
}

import { CartContextProvider } from "@/components/CartContext"
import { WishlistContextProvider } from "@/components/WishlistContext"
import { SessionProvider } from "next-auth/react"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
  
  /* Ensure modals are properly displayed */
  #modal-root {
    position: fixed;
    z-index: 1100;
  }
`

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <WishlistContextProvider>
          <CartContextProvider>
            <Component {...pageProps} />
            <div id="modal-root"></div>
          </CartContextProvider>
        </WishlistContextProvider>
      </SessionProvider>
    </>
  )
}

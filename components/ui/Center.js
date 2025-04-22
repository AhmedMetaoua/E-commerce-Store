"use client"

import styled from "styled-components"

const StyledCenter = styled.div`
  max-width: ${(props) => (props.$fullWidth ? "100%" : "1400px")};
  margin: 0 auto; 
  padding: ${(props) => (props.$fullWidth ? "0" : "0 20px")};
  
  @media screen and (min-width: 768px) {
    padding: ${(props) => (props.$fullWidth ? "0" : "0 40px")};
  }
`

export default function Center({ children, fullWidth = false }) {
  return <StyledCenter $fullWidth={fullWidth}>{children}</StyledCenter>
}

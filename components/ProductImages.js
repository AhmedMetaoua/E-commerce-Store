import React, { useState } from 'react'
import styled from 'styled-components'

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
`
const BigImage = styled.img`
    max-width: 100%;
    max-height: 200%;
`
const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-grow: 0;
    margin-top: 10px;
`
const ImageButton = styled.div`
    ${props => props.active ? `
        border-color: #ccc;` : `
        border-color: transport;
        opacity: .7;
        `}
    border: 1px solid #ccc;
    height: 40px;
    padding: 2px;
    cursor: pointer;
    border-radius: 5px;
    `
const BigImagesWrapper = styled.div`
    text-align: center;
`

export default function ProductImages({images}) {
    
    const [activeImage,setActiveImage] = useState(images?.[0])    
    return (
    <>
        <BigImage src={activeImage} alt=''/>
        <ImageButtons>
            {images.map((image,index) => (
                <ImageButton key={index} active={image === activeImage} onClick={() => setActiveImage(image)}>
                    <Image alt='' src={image} />
                </ImageButton>
            ))}
        </ImageButtons>
    </>
  )
}

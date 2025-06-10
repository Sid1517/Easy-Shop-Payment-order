import React from 'react'
import logoImage from '../assest/images.png'

const Logo = ({w,h}) => {
  return (
    <img src={logoImage} width={w} height={h} alt="Logo" />
  )
}

export default Logo

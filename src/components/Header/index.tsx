import React from 'react'

import { Timer, Scroll } from 'phosphor-react'

import Logo from '../../assets/Logo.svg'

import { HeaderContainer } from './styles'
import { NavLink } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <img src={Logo} alt="Logo" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="History">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}

export default Header

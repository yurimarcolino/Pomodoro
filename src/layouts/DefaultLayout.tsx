import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

// import { Container } from './styles';

const DefaultLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default DefaultLayout

import React from 'react'
import AppNav from "../components/AppNav"
import Footer from "../components/footer"

const Layout = ({children}) => {
  return (
    <>
        <AppNav />
        {children}
        <Footer />
    </>
  )
}

export default Layout
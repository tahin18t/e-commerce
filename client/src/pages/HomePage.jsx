import React from 'react'
import Layout from '../layout/Layout'
import CategoryList from '../components/CategoryList'
import BrandList from '../components/BrandList'
import ProductListPage from './ProductListPage'
import Slider from '../components/PtoductSlider'

const HomePage = () => {
  return (
    <>
      <Layout>
        <Slider />
        <hr className="h-[2px] border-0 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
        <CategoryList />
        <hr className="h-[2px] border-0 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
        <BrandList />
        <hr className="h-[2px] border-0 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
        <br />
        <ProductListPage />
      </Layout>
    </>
  )
}

export default HomePage
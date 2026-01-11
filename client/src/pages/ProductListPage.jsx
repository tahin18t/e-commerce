import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { useSearchParams } from 'react-router-dom'
import { ProductListByCategory, ProductListByBrand, ProductSearch, ProductListByFilter } from '../APIRequest/APIRequest'
import ProductList from '../components/ProductList'
import Layout from '../layout/Layout'

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);

    const location = useLocation();
    const isHome = location.pathname === "/products";

    useEffect(() => {
        const categoryID = searchParams.get('category');
        const brandID = searchParams.get('brand');
        const search = searchParams.get('search');

        let filter = {
            "minPrice": 0,
            "maxPrice": null,
            "minStar": 0,
            "maxStar": 5,
            "categoryID": null,
            "brandID": null,
            "remark": null,
        };

        (async () => {
            let data = null;
            if (categoryID) {
                data = await ProductListByCategory(categoryID);
            } else if (brandID) {
                data = await ProductListByBrand(brandID);
            } else if (search) {
                data = await ProductSearch(search);
            } else {
                data = await ProductListByFilter(filter)
            }

            if (data && Array.isArray(data)) {
                setProducts(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        })();
    }, [searchParams]);

    return isHome ? (
    <ProductList products={products} filter />
  ) : (
    <Layout>
      <ProductList products={products} />
    </Layout>
  );
}

export default ProductsPage
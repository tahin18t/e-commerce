import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { ProductListByCategory, ProductListByBrand, ProductSearch, ProductListByFilter } from '../APIRequest/APIRequest'
import ProductList from '../components/ProductList'
import Layout from '../layout/Layout'

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    const location = useLocation();
    const queryString = location.search;
    const queryParams = new URLSearchParams(queryString);
    const categoryID = queryParams.get('category');
    const brandID = queryParams.get('brand');
    const search = queryParams.get('search');
    const isHome = location.pathname === "/";

    useEffect(() => {
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
                // On homepage show a limited set to avoid listing everything
                setProducts(isHome ? data.slice(0, 12) : data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setProducts(isHome ? data.data.slice(0, 12) : data.data);
            } else {
                setProducts([]);
            }
        })();
    }, [categoryID, brandID, search, isHome]);

        return isHome ? (
        <ProductList key={queryString} products={products} filter />
  ) : (
    <Layout>
            <ProductList key={queryString} products={products} />
    </Layout>
  );
}

export default ProductsPage
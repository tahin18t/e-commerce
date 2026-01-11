import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductCategoryList, ProductBrandList, AddToCart, AddToWishList } from '../APIRequest/APIRequest';
import { readCookie } from '../helper/cookie';

const ProductList = ({ products }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedRemark, setSelectedRemark] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    let token = readCookie("token")


    //const [filter, setFilter] = useState(filterdata)

    useEffect(() => {
        (async () => {
            let catData = await ProductCategoryList();
            if (catData && Array.isArray(catData)) {
                setCategories(catData);
            } else if (catData && catData.data) {
                setCategories(catData.data);
            }

            let brandData = await ProductBrandList();
            if (brandData && Array.isArray(brandData)) {
                setBrands(brandData);
            } else if (brandData && brandData.data) {
                setBrands(brandData.data);
            }
        })();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = !selectedCategory || product.category?.categoryName === selectedCategory;
        const matchesBrand = !selectedBrand || product.brand?.brandName === selectedBrand;
        const matchesRemark = !selectedRemark || product.remark === selectedRemark;
        const matchesMinPrice = !minPrice || parseFloat(product.price) >= parseFloat(minPrice);
        const matchesMaxPrice = !maxPrice || parseFloat(product.price) <= parseFloat(maxPrice);
        return matchesCategory && matchesBrand && matchesRemark && matchesMinPrice && matchesMaxPrice;
    });

    const addToCart = async (productID, title, img) => {
        if (token) {
            let product = { productID, qty: 1, color: "red", size: "l" };
            let res = await AddToCart(product, token);
            console.log(res)
            if (res) {
                toast(
                    (t) => (
                        <div className="flex items-center gap-3">
                            <img src={img || '/vite.svg'} className="w-10 h-10 rounded" />
                            <p>{title} added to cart</p>
                            <button onClick={() => toast.dismiss(t.id)}>✖</button>
                        </div>
                    ),
                    { duration: 3000 }
                );
            } else {
                toast.error("Failed to add to cart");
            }
        } else {
            toast.error("Please Login");
        }
    };

    const addToWishList = async (productID, title, img) => {
        if (token) {
            let res = await AddToWishList(productID, token);
            if (res) {
                toast(
                    (t) => (
                        <div className="flex items-center gap-3">
                            <img src={img || '/vite.svg'} className="w-10 h-10 rounded" />
                            <p>{title} added to wish list</p>
                            <button onClick={() => toast.dismiss(t.id)}>✖</button>
                        </div>
                    ),
                    { duration: 3000 }
                );
            } else {
                toast.error("Failed to add to wishlist");
            }
        } else {
            toast.error("Please Login");
        }
    };

    return (
        <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen">
            <div className="flex flex-wrap gap-4 mb-20 justify-center">
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="px-3 py-2 border rounded bg-base-100 text-base-content">
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat['_id']} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedBrand(e.target.value)} value={selectedBrand} className="px-3 py-2 border rounded bg-base-100 text-base-content">
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                        <option key={brand['_id']} value={brand.brandName}>{brand.brandName}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedRemark(e.target.value)} value={selectedRemark} className="px-3 py-2 border rounded bg-base-100 text-base-content">
                    <option value="">All Remarks</option>
                    <option value="new">New</option>
                    <option value="old">Old</option>
                </select>
                <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="px-3 py-2 border rounded bg-base-100 text-base-content" />
                <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="px-3 py-2 border rounded bg-base-100 text-base-content" />
                <button className='btn  w-full'>Filter</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Link key={product['_id']} to={'/product/' + product['_id']} className="block cursor-default">
                            <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={product.image || '/vite.svg'} alt={product.title} className="h-75 w-full object-cover" />
                                <div className="p-4">
                                    <div className='flex justify-between'>
                                        <div className="flex items-center scale-120 ms-2.5">
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const starValue = i + 1;
                                                if (product.star >= starValue) {
                                                    // full star
                                                    return <span key={i} className="text-yellow-400">★</span>;
                                                } else if (product.star >= starValue - 0.5) {
                                                    // half star
                                                    return <span key={i} className="text-yellow-400">☆</span>; // You can replace with a half-star icon if using an icon library
                                                } else {
                                                    // empty star
                                                    return <span key={i} className="text-gray-300">★</span>;
                                                }
                                            })}
                                            <span className="ml-2 text-sm text-gray-600">{Number(product.star).toFixed(1)}</span>
                                        </div>
                                        <div className='flex'>
                                            <p className="text-sm text-gray-500 align-bottom pt-1 me-2 line-through"><i>${product.price}</i></p>
                                            <h3 className="text-lg font-semibold text-success align-middle">${product.discountPrice}</h3>
                                        </div>
                                    </div>
                                    <h4 className="text-md font-medium text-base-content">{product.title}</h4>
                                    {/* <p className="text-base-content text-sm">{product.shortDes}</p> */}
                                    <div className="flex justify-between gap-0">
                                        <button
                                            className="mt-2 bg-primary hover:bg-blue-600 text-primary-content py-1 px-3 rounded-s-box cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product["_id"], product.title, product.image);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                        <p className='flex text-center text-gray-600 border-y my-0 py-0 scale-75 align-bottom mt-1'>Stock<br />{product.stock}</p>
                                        <button
                                            className="mt-2 bg-primary hover:bg-blue-600 text-primary-content py-1 px-3 rounded-e-box cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToWishList(product["_id"], product.title, product.image);
                                            }}
                                        >
                                            Add to Wish List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center">
                        <h1 className="text-2xl">There are no products matching the filters</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductList
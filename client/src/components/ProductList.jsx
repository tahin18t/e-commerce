import React, { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ProductCategoryList, ProductBrandList, AddToCart, AddToWishList, checkToken } from '../APIRequest/APIRequest';
import toast from 'react-hot-toast';

const ProductList = ({ products, filter = false, compact = false }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedRemark, setSelectedRemark] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const productsPerPage = 12;
    const routeCategory = categories.find((category) => category['_id'] === searchParams.get('category'))?.categoryName || '';
    const routeBrand = brands.find((brand) => brand['_id'] === searchParams.get('brand'))?.brandName || '';
    const activeCategory = selectedCategory || routeCategory;
    const activeBrand = selectedBrand || routeBrand;

    const showFilter = filter || location.pathname === "/products" || location.pathname === "/";

    useEffect(() => {
        (async () => {
            const auth = await checkToken();
            setIsAuthenticated(Boolean(auth?.validation));

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
        const matchesCategory = !activeCategory || product.category?.categoryName === activeCategory;
        const matchesBrand = !activeBrand || product.brand?.brandName === activeBrand;
        const matchesRemark = !selectedRemark || product.remark === selectedRemark;
        const matchesMinPrice = !minPrice || parseFloat(product.price) >= parseFloat(minPrice);
        const matchesMaxPrice = !maxPrice || parseFloat(product.price) <= parseFloat(maxPrice);
        return matchesCategory && matchesBrand && matchesRemark && matchesMinPrice && matchesMaxPrice;
    });

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
    const pageProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const updateFilter = (value, setter) => {
        setter(value);
        setCurrentPage(1);
    };

    const addToCart = async (productID, title, img) => {
        if (!isAuthenticated) {
            toast.error("Please login");
            return;
        }
        let product = { productID, qty: 1, color: "red", size: "l" };
        let res = await AddToCart(product);
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
    };

    const addToWishList = async (productID, title, img) => {
        if (!isAuthenticated) {
            toast.error("Please login");
            return;
        }
        let res = await AddToWishList(productID);
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
    };

    return (
        <div className="container mx-auto px-4 py-10 bg-base-100 text-base-content min-h-screen">
            <div className={showFilter ? 'lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8' : ''}>
                {showFilter && (
                    <aside className="sticky top-20 self-start rounded-3xl border border-base-300 bg-base-200/95 shadow-lg p-6 h-fit mb-8 lg:mb-0">
                        <div className="mb-6 border-b border-base-300 pb-4">
                            <h2 className="text-2xl font-semibold">Filter Products</h2>
                            <p className="text-sm text-gray-500 mt-2">Use filters to narrow down the catalog.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select onChange={(e) => updateFilter(e.target.value, setSelectedCategory)} value={activeCategory} className="w-full px-4 py-3 border rounded-2xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat['_id']} value={cat.categoryName}>{cat.categoryName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Brand</label>
                                <select onChange={(e) => updateFilter(e.target.value, setSelectedBrand)} value={activeBrand} className="w-full px-4 py-3 border rounded-2xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">All Brands</option>
                                    {brands.map((brand) => (
                                        <option key={brand['_id']} value={brand.brandName}>{brand.brandName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Product Type</label>
                                <select onChange={(e) => updateFilter(e.target.value, setSelectedRemark)} value={selectedRemark} className="w-full px-4 py-3 border rounded-2xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">All Remarks</option>
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Min Price</label>
                                    <input type="number" placeholder="0" value={minPrice} onChange={(e) => updateFilter(e.target.value, setMinPrice)} className="w-full px-4 py-3 border rounded-2xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Max Price</label>
                                    <input type="number" placeholder="9999" value={maxPrice} onChange={(e) => updateFilter(e.target.value, setMaxPrice)} className="w-full px-4 py-3 border rounded-2xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                            </div>

                            <button className="w-full py-3 rounded-2xl bg-primary text-primary-content font-semibold hover:bg-primary-focus transition">Apply Filters</button>
                        </div>
                    </aside>
                )}

                <main className={showFilter ? '' : 'w-full'}>
                    {showFilter && (
                        <div className="lg:hidden mb-8">
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                                className="w-full rounded-2xl border border-base-300 bg-base-200 px-4 py-3 text-left font-semibold text-base-content shadow-sm"
                            >
                                {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            {mobileFilterOpen && (
                                <div className="mt-4 space-y-4 rounded-3xl border border-base-300 bg-base-100 p-4">
                                    <select onChange={(e) => updateFilter(e.target.value, setSelectedCategory)} value={activeCategory} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content">
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat['_id']} value={cat.categoryName}>{cat.categoryName}</option>
                                        ))}
                                    </select>
                                    <select onChange={(e) => updateFilter(e.target.value, setSelectedBrand)} value={activeBrand} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content">
                                        <option value="">All Brands</option>
                                        {brands.map((brand) => (
                                            <option key={brand['_id']} value={brand.brandName}>{brand.brandName}</option>
                                        ))}
                                    </select>
                                    <select onChange={(e) => updateFilter(e.target.value, setSelectedRemark)} value={selectedRemark} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content">
                                        <option value="">All Remarks</option>
                                        <option value="new">New</option>
                                        <option value="old">Old</option>
                                    </select>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => updateFilter(e.target.value, setMinPrice)} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                                        <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => updateFilter(e.target.value, setMaxPrice)} className="w-full px-3 py-2 border rounded bg-base-100 text-base-content" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-5`}>
                        {filteredProducts.length > 0 ? (
                            pageProducts.map((product) => (
                                <Link key={product['_id']} to={'/product/' + product['_id']} className="group block transform transition duration-300 hover:-translate-y-1">
                                    <div className="h-full rounded-2xl border border-base-300 bg-white shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                                        <div className="relative overflow-hidden bg-base-200">
                                            <img src={product.image || '/vite.svg'} alt={product.title} className="h-44 sm:h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                                            {product.discountPrice && product.discountPrice !== '00' && product.discountPrice !== 0 && (
                                                <span className="absolute top-3 left-3 bg-secondary text-secondary-content px-2.5 py-1 rounded-full text-xs font-semibold">Sale</span>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{product.title}</h3>
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{Number(product.star).toFixed(1)}</span>
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: 5 }, (_, i) => {
                                                                const starValue = i + 1;
                                                                if (product.star >= starValue) {
                                                                    return <span key={i} className="text-amber-400">★</span>;
                                                                } else if (product.star >= starValue - 0.5) {
                                                                    return <span key={i} className="text-amber-400">☆</span>;
                                                                }
                                                                return <span key={i} className="text-gray-300">★</span>;
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {product.discountPrice && product.discountPrice !== '00' && product.discountPrice !== 0 ? (
                                                        <>
                                                            <p className="text-lg font-bold text-primary">${product.discountPrice}</p>
                                                            <p className="text-xs line-through text-gray-400">${product.price}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-lg font-bold text-slate-900">${product.price}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    aria-label="Add to cart"
                                                    className="inline-flex items-center justify-center rounded-full bg-primary p-2.5 text-primary-content transition hover:bg-primary-focus"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(product["_id"], product.title, product.image);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5m5-5v5m6-5v5m-9 0a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    aria-label="Add to wishlist"
                                                    className="inline-flex items-center justify-center rounded-full border border-base-300 bg-base-100 p-2.5 text-primary transition hover:bg-base-200"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToWishList(product["_id"], product.title, product.image);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </button>

                                                <div className="ml-auto text-xs text-gray-500">Stock: {product.stock}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <h1 className="text-2xl font-semibold">No products match your filter settings</h1>
                                <p className="mt-3 text-gray-500">Try resetting the filters or selecting a different category.</p>
                            </div>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Product pages">
                            <button
                                type="button"
                                className="btn btn-sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    type="button"
                                    key={page}
                                    className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setCurrentPage(page)}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </main>
            </div>
        </div>
    )
}

export default ProductList

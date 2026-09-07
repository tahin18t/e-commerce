import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { WishList, RemoveFromWishList, checkToken } from '../APIRequest/APIRequest';
import Layout from '../layout/Layout';

const WishListPage = () => {
    const [wishList, setWishList] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        (async () => {
            const auth = await checkToken();
            if (auth?.validation) {
                setIsAuthenticated(true);
                let data = await WishList();
                if (data && data.data) {
                    setWishList(data.data);
                }
            } else {
                setIsAuthenticated(false);
            }
        })();
    }, []);

    const removeFromWishList = async (productID, title) => {
        if (isAuthenticated) {
            let res = await RemoveFromWishList(productID);
            if (res) {
                setWishList((items) => items.filter(product => product["_id"] !== productID));
                toast.success(title+" is removed from wishlist!");
            } else {
                toast.error("Failed to remove from wishlist");
            }
        }
    };

    if (isAuthenticated === null) {
        return (
            <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p className="text-base-content/60">Loading your wishlist...</p></div></Layout>
        );
    }

    if (!isAuthenticated) {
        return (
            <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p>Please login to view your wishlist.</p></div></Layout>
        );
    }

    return (
        <Layout>
        <main className="min-h-screen bg-base-100 text-base-content">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-widest text-primary">Saved for later</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">My wishlist</h1></div>
              <span className="rounded-full bg-base-200 px-4 py-2 text-sm text-base-content/70">{wishList.length} items</span>
            </div>
            {wishList.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishList.map((product) => (
                        <div key={product["_id"]} className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <Link to={'/product/' + product["_id"]} className="block">
                                <div className="aspect-[4/3] overflow-hidden bg-base-200"><img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center text-sm">
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const rating = Number(product.star) || 0;
                                                const starValue = i + 1;
                                                if (rating >= starValue) {
                                                    return <span key={i} className="text-yellow-400">★</span>;
                                                } else if (rating >= starValue - 0.5) {
                                                    return <span key={i} className="text-yellow-400">☆</span>;
                                                } else {
                                                    return <span key={i} className="text-gray-300">★</span>;
                                                }
                                            })}
                                            <span className="ml-2 text-sm text-base-content/60">{(Number(product.star) || 0).toFixed(1)}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">${product.discountPrice && product.discountPrice !== '00' ? product.discountPrice : product.price}</p>
                                            {product.discountPrice && product.discountPrice !== '00' && <p className="text-xs text-base-content/50 line-through">${product.price}</p>}
                                        </div>
                                    </div>
                                    <h2 className="mt-3 line-clamp-1 font-semibold">{product.title}</h2>
                                </div>
                            </Link>
                            <div className="border-t border-base-300 px-4 py-3"><button className="w-full rounded-lg border border-error/30 px-3 py-2 text-sm font-semibold text-error transition hover:bg-error hover:text-error-content" onClick={() => removeFromWishList(product["_id"], product.title)}>Remove from wishlist</button></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-20 text-center">
                    <h2 className="text-2xl font-semibold">Your wishlist is empty</h2><p className="mt-2 text-base-content/60">Save products here and come back when you are ready.</p>
                </div>
            )}
          </div>
        </main>
        </Layout>
    );
};

export default WishListPage;

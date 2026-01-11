import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { WishList, RemoveFromWishList } from '../APIRequest/APIRequest';
import { readCookie } from '../helper/cookie';

const WishListPage = () => {
    const [wishList, setWishList] = useState([]);
    const [loading, setLoading] = useState(true);
    let token = readCookie("token");

    useEffect(() => {
        if (token) {
            (async () => {
                let data = await WishList(token);
                if (data && data.data) {
                    setWishList(data.data);
                }
                setLoading(false);
            })();
        } else {
            setLoading(false);
        }
    }, [token]);

    const removeFromWishList = async (productID, title) => {
        if (token) {
            let res = await RemoveFromWishList(productID, token);
            if (res) {
                // Remove from local state
                setWishList(wishList.filter(product => product["_id"] !== productID));
                toast.success(title+" is removed from wishlist!");
            } else {
                toast.error("Failed to remove from wishlist");
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen flex justify-center items-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen flex justify-center items-center">
                <div>Please login to view your wishlist.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen">
            <h1 className="text-3xl font-bold text-center my-8">My Wish List</h1>
            {wishList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishList.map((product) => (
                        <Link key={product["_id"]} to={'/product/' + product["_id"]} className="block">
                            <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={product.image} alt={product.title} className="h-75 w-full object-cover" />
                                <div className="p-4">
                                    <div className='flex justify-between'>
                                        <div className="flex items-center scale-120 ms-2.5">
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const starValue = i + 1;
                                                if (product.star >= starValue) {
                                                    return <span key={i} className="text-yellow-400">★</span>;
                                                } else if (product.star >= starValue - 0.5) {
                                                    return <span key={i} className="text-yellow-400">☆</span>;
                                                } else {
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
                                    <div className="flex justify-center gap-0 mt-2">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeFromWishList(product["_id"], product.title);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-2xl">Your wish list is empty</h1>
                </div>
            )}
        </div>
    );
};

export default WishListPage;
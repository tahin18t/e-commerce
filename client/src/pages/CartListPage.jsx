import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartList, RemoveFromCart, CreateInvoice } from '../APIRequest/APIRequest';
import { readCookie } from '../helper/cookie';

const CartListPage = () => {
    const [cartList, setCartList] = useState([]);
    const [loading, setLoading] = useState(true);
    let token = readCookie("token");
    

    useEffect(() => {
        if (token) {
            (async () => {
                let data = await CartList(token);
                if (data && data.data) {
                    setCartList(data.data);
                }
                setLoading(false);
            })();
        } else {
            setLoading(false);
        }
    }, [token]);

    const removeFromCart = async (productID, title) => {
        if (token) {
            console.log("ProductID:", productID, "\ntitle:",title)
            let res = await RemoveFromCart(productID, token);
            console.log(res)
            if (res) {
                // Remove from local state
                setCartList(cartList.filter(item => item.Product._id !== productID));
                toast.success(title+" removed from cart!");
            } else {
                toast.error("Failed to remove from cart");
            }
        }
    };

    let checkout = async ()=>{
        try {
            let data = await CreateInvoice(token);
            if (data && data.status === "success") {
                // Redirect to SSLCommerz payment gateway
                window.location.href = data.data.GatewayPageURL;
            } else {
                toast.error("Failed to create invoice. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred during checkout. Please try again.");
            console.error("Checkout error:", error);
        }
    }

    const calculateTotal = () => {
        return cartList.reduce((total, item) => total + ((parseFloat(item.Product.discountPrice && item.Product.discountPrice !== "00" && item.Product.discountPrice !== 0 ? item.Product.discountPrice : item.Product.price)) * parseInt(item.qty)), 0).toFixed(2);
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
                <div>Please login to view your cart.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen">
            <h1 className="text-3xl font-bold text-center my-8">My Cart</h1>
            {cartList.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {cartList.map((item) => (
                            <Link key={item.Product._id} to={'/product/' + item.Product._id} className="block">
                                <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden hover:shadow-lg transition-shadow">
                                    <img src={item.Product.image} alt={item.Product.title} className="h-75 w-full object-cover" />
                                    <div className="p-4">
                                        <div className='flex justify-between'>
                                            <div className="flex items-center scale-120 ms-2.5">
                                                {Array.from({ length: 5 }, (_, i) => {
                                                    const starValue = i + 1;
                                                    if (item.Product.star >= starValue) {
                                                        return <span key={i} className="text-yellow-400">★</span>;
                                                    } else if (item.Product.star >= starValue - 0.5) {
                                                        return <span key={i} className="text-yellow-400">☆</span>;
                                                    } else {
                                                        return <span key={i} className="text-gray-300">★</span>;
                                                    }
                                                })}
                                                <span className="ml-2 text-sm text-gray-600">{Number(item.Product.star).toFixed(1)}</span>
                                            </div>
                                            <div className='flex'>
                                                <p className="text-sm text-gray-500 align-bottom pt-1 me-2 line-through">
                                                    {item.Product.discountPrice && item.Product.discountPrice !== "00" && item.Product.discountPrice !== 0 ? `$${item.Product.price}` : ""}
                                                </p>
                                                <h3 className="text-lg font-semibold text-success align-middle">
                                                    ${item.Product.discountPrice && item.Product.discountPrice !== "00" && item.Product.discountPrice !== 0 ? item.Product.discountPrice : item.Product.price}
                                                </h3>
                                            </div>
                                        </div>
                                        <h4 className="text-md font-medium text-base-content">{item.Product.title}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {parseInt(item.qty)}</p>
                                        <p className="text-sm text-gray-600">Subtotal: ${(parseFloat(item.Product.discountPrice && item.Product.discountPrice !== "00" && item.Product.discountPrice !== 0 ? item.Product.discountPrice : item.Product.price) * parseInt(item.qty)).toFixed(2)}</p>
                                        <div className="flex justify-center gap-0 mt-2">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeFromCart(item.Product._id, item.Product.title);
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
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Total: ${calculateTotal()}</h2>
                        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4" onClick={() => checkout()}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <h1 className="text-2xl">Your cart is empty</h1>
                </div>
            )}
        </div>
    );
};

export default CartListPage;
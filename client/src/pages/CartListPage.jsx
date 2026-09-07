import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartList, RemoveFromCart, UpdateCartQuantity, CreateInvoice, checkToken } from '../APIRequest/APIRequest';
import Layout from '../layout/Layout';

const CartListPage = () => {
    const [cartList, setCartList] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        (async () => {
            const auth = await checkToken();
            if (auth?.validation) {
                setIsAuthenticated(true);
                const data = await CartList();
                if (data && data.data) {
                    setCartList(data.data);
                }
            } else {
                setIsAuthenticated(false);
            }
        })();
    }, []);

    const [checkoutLoading, setCheckoutLoading] = useState(false)

    const removeFromCart = async (productID, title) => {
        if (isAuthenticated) {
            let res = await RemoveFromCart(productID);
            if (res) {
                setCartList((items) => items.filter(item => item.Product._id !== productID));
                toast.success(title+" removed from cart!");
            } else {
                toast.error("Failed to remove from cart");
            }
        }
    };

    const updateQuantity = async (item, nextQuantity) => {
        const quantity = Math.max(1, Math.min(Number(item.Product.stock) || 1, nextQuantity));
        if (quantity === Number(item.qty)) return;
        const result = await UpdateCartQuantity(item.Product._id, quantity, item.color, item.size);
        if (result?.status === 'success') {
            setCartList((items) => items.map((cartItem) => cartItem.Product._id === item.Product._id ? { ...cartItem, qty: String(quantity) } : cartItem));
        } else {
            toast.error('Unable to update quantity');
        }
    };

    let checkout = async ()=>{
        if (checkoutLoading) return
        setCheckoutLoading(true)
        try {
            let data = await CreateInvoice();
            if (data && data.status === "success" && data.data?.GatewayPageURL) {
                toast.success("Redirecting to payment gateway...")
                window.location.href = data.data.GatewayPageURL;
            } else if (data && data.status !== "success") {
                toast.error(data.message || "Failed to create invoice. Please try again.")
            } else {
                toast.error("Payment gateway could not be opened. Please try again.")
            }
        } catch (error) {
            toast.error("An error occurred during checkout. Please try again. " + (error.message || ''));
        } finally {
            setCheckoutLoading(false)
        }
    }

    const calculateTotal = () => {
        return cartList.reduce((total, item) => total + ((parseFloat(item.Product.discountPrice && item.Product.discountPrice !== "00" && item.Product.discountPrice !== 0 ? item.Product.discountPrice : item.Product.price)) * parseInt(item.qty)), 0).toFixed(2);
    };

    if (isAuthenticated === null) {
        return (
            <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p className="text-base-content/60">Loading your cart...</p></div></Layout>
        );
    }

    if (!isAuthenticated) {
        return (
            <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p>Please login to view your cart.</p></div></Layout>
        );
    }

    return (
        <Layout>
        <main className="min-h-screen bg-base-100 text-base-content">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-10"><p className="text-sm font-semibold uppercase tracking-widest text-primary">Ready to checkout</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your cart</h1><p className="mt-2 text-base-content/60">Review your items before placing the order.</p></div>
            {cartList.length > 0 ? (
                <>
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                        {cartList.map((item) => (
                            <div key={item.Product._id} className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:items-center">
                                <Link to={'/product/' + item.Product._id} className="flex min-w-0 flex-1 gap-4">
                                    <img src={item.Product.image} alt={item.Product.title} className="h-28 w-28 shrink-0 rounded-xl bg-base-200 object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h2 className="line-clamp-1 font-semibold">{item.Product.title}</h2>
                                                <div className="mt-1 flex items-center text-sm">
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
                                                    <span className="ml-2 text-xs text-base-content/60">{Number(item.Product.star).toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <p className="text-lg font-bold text-primary">${(parseFloat(item.Product.discountPrice && item.Product.discountPrice !== '00' && item.Product.discountPrice !== 0 ? item.Product.discountPrice : item.Product.price)).toFixed(2)}</p>
                                        </div>
                                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-base-content/60">
                                            <span className="inline-flex items-center gap-2">
                                                <span>Quantity:</span>
                                                <button type="button" className="h-7 w-7 rounded-md border border-base-300 hover:bg-base-200" onClick={(event) => { event.preventDefault(); event.stopPropagation(); updateQuantity(item, Number(item.qty) - 1); }} aria-label="Decrease quantity">-</button>
                                                <strong>{parseInt(item.qty)}</strong>
                                                <button type="button" className="h-7 w-7 rounded-md border border-base-300 hover:bg-base-200" onClick={(event) => { event.preventDefault(); event.stopPropagation(); updateQuantity(item, Number(item.qty) + 1); }} aria-label="Increase quantity">+</button>
                                            </span>
                                            <span>Subtotal: ${(parseFloat(item.Product.discountPrice && item.Product.discountPrice !== "00" && item.Product.discountPrice !== 0 ? item.Product.discountPrice : item.Product.price) * parseInt(item.qty)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>
                                <button className="rounded-lg border border-error/30 px-3 py-2 text-sm font-semibold text-error transition hover:bg-error hover:text-error-content" onClick={() => removeFromCart(item.Product._id, item.Product.title)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <aside className="h-fit rounded-2xl border border-base-300 bg-base-200 p-6 lg:sticky lg:top-24">
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Order summary</p>
                        <div className="mt-5 flex items-center justify-between border-b border-base-300 pb-4"><span className="text-base-content/60">Total</span><strong className="text-2xl">${calculateTotal()}</strong></div>
                        <button className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-content transition hover:brightness-110 disabled:opacity-60" onClick={() => checkout()} disabled={checkoutLoading}>
                            {checkoutLoading ? 'Starting Checkout...' : 'Proceed to Checkout'}
                        </button>
                    </aside>
                    </div>
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-20 text-center">
                    <h2 className="text-2xl font-semibold">Your cart is empty</h2><p className="mt-2 text-base-content/60">Add something you love and it will appear here.</p>
                </div>
            )}
          </div>
        </main>
        </Layout>
    );
};

export default CartListPage;

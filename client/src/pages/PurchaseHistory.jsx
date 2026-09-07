import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { InvoiceList, InvoiceProductList, checkToken } from '../APIRequest/APIRequest'
import toast from 'react-hot-toast';
import Layout from '../layout/Layout';

const PurchaseHistory = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedInvoiceID, setSelectedInvoiceID] = useState(null)
    const [invoiceDetails, setInvoiceDetails] = useState([])
    const [detailsLoading, setDetailsLoading] = useState(false)

    const fetchInvoiceDetails = async (invoiceID) => {
        if (selectedInvoiceID === invoiceID) {
            setSelectedInvoiceID(null)
            setInvoiceDetails([])
            return
        }
        setDetailsLoading(true)
        try {
            let data = await InvoiceProductList(invoiceID)
            data = data.data ? data.data : data
            setInvoiceDetails(data)
            setSelectedInvoiceID(invoiceID)
        } catch (error) {
            toast.error("Failed to load invoice details", error.message)
        } finally {
            setDetailsLoading(false)
        }
    }
    
    useEffect(() => {
        (async () => {
            const auth = await checkToken()
            if (!auth?.validation) {
                setIsAuthenticated(false)
                setLoading(false)
                return
            }
            setIsAuthenticated(true)
            try {
                let data = await InvoiceList()
                data = data.data ? data.data : data
                setInvoices([...data].sort((firstInvoice, secondInvoice) => {
                    const firstTime = new Date(firstInvoice.createdAt || Number(firstInvoice.trx_id) || 0).getTime()
                    const secondTime = new Date(secondInvoice.createdAt || Number(secondInvoice.trx_id) || 0).getTime()
                    return secondTime - firstTime
                }))
            } catch (error) {
                toast.error("Failed to load invoices", error.message)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading || isAuthenticated === null) {
        return (
            <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p className="text-base-content/60">Loading your orders...</p></div></Layout>
        )
    }

    if (!isAuthenticated) {
        return (
            <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex items-center justify-center"><p>Please login to view your purchase history.</p></div></Layout>
        )
    }

    return (
        <Layout>
        <main className="min-h-screen bg-base-100 text-base-content"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-10"><p className="text-sm font-semibold uppercase tracking-widest text-primary">Your orders</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Purchase history</h1><p className="mt-2 text-base-content/60">Track past payments and open an invoice for its products.</p></div>
            {invoices.length > 0 ? (
                <div className="space-y-4">
                    {invoices.map((invoice) => (
                        <div key={invoice._id} className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="p-5 sm:p-6">
                                    <div className="mb-4 flex flex-wrap items-center gap-3"><span className={`rounded-full ${invoice.payment_status?.toLowerCase() === "success" ? "bg-success/10 text-success" : invoice.payment_status?.toLowerCase() === "pending" ? "bg-warning/10 text-warning" : "bg-error/10 text-error"} px-3 py-1 text-xs font-semibold`}>{invoice.payment_status}</span><span className="text-sm text-base-content/60">{new Date(invoice.createdAt).toLocaleDateString()}</span></div>
                                    <p className="font-semibold">Transaction {invoice.trx_id}</p>
                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><span><small className="block text-base-content/50">Total</small><strong>${invoice.total}</strong></span><span><small className="block text-base-content/50">VAT</small><strong>${invoice.vat}</strong></span><span><small className="block text-base-content/50">Payable</small><strong>${invoice.Payable}</strong></span><span><small className="block text-base-content/50">Delivery</small><strong>{invoice.delivery_status}</strong></span></div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => fetchInvoiceDetails(invoice._id)}
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition hover:brightness-110"
                                        disabled={detailsLoading}
                                    >
                                        {selectedInvoiceID === invoice._id ? "Hide Details" : "Show Details"}
                                    </button>
                                    {invoice.payment_status?.toLowerCase() === 'success' ? (
                                        <a
                                            href={`/api/v1/InvoiceDownload/${invoice._id}`}
                                            className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold transition hover:bg-base-200"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Download Invoice
                                        </a>
                                    ) : (
                                        <Link
                                            to="/cart"
                                            className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-2 text-sm font-semibold text-warning transition hover:bg-warning/20"
                                        >
                                            {invoice.payment_status?.toLowerCase() === 'pending' ? 'Complete Payment' : 'Try Payment Again'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {selectedInvoiceID === invoice._id && (
                                <div className="border-t border-base-300 bg-base-200/50 p-5 sm:p-6">
                                    {detailsLoading ? (
                                        <div>Loading details...</div>
                                    ) : (
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Invoice Details</h3>
                                            {invoiceDetails.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {invoiceDetails.map((item, index) => (
                                                        <Link key={index} to={`/product/${item.productID}`} className="block rounded-xl border border-base-300 bg-base-100 p-3 transition hover:border-primary">
                                                            <div className="flex items-center space-x-4">
                                                                <img src={item.product.image || '/vite.svg'} alt={item.product.title} className="w-1/3  object-cover rounded" />
                                                                <div>
                                                                    <p><strong>Title:</strong> {item.product.title}</p>
                                                                    <p><strong>Quantity:</strong> {item.qty}</p>
                                                                    <p><strong>Price:</strong> ${item.price}</p>
                                                                    <p><strong>Color:</strong> {item.color}</p>
                                                                    <p><strong>Size:</strong> {item.size}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>No details available.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-2xl">No purchase history found.</h1>
                </div>
            )}
        </div></main>
        </Layout>
    )
}

export default PurchaseHistory

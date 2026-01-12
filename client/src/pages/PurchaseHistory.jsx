import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { InvoiceList, InvoiceProductList } from '../APIRequest/APIRequest'
import { readCookie } from '../helper/cookie'
import toast from 'react-hot-toast';

const PurchaseHistory = () => {
    let token = readCookie("token")
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedInvoiceID, setSelectedInvoiceID] = useState(null)
    const [invoiceDetails, setInvoiceDetails] = useState([])
    const [detailsLoading, setDetailsLoading] = useState(false)

    useEffect(() => {
        if (token) {
            fetchInvoices()
        } else {
            setLoading(false)
        }
    }, [token])

    const fetchInvoices = async () => {
        try {
            let data = await InvoiceList(token)
            data = data.data ? data.data : data
            setInvoices(data)
        } catch (error) {
            toast.error("Failed to load invoices")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchInvoiceDetails = async (invoiceID) => {
        if (selectedInvoiceID === invoiceID) {
            setSelectedInvoiceID(null)
            setInvoiceDetails([])
            return
        }
        setDetailsLoading(true)
        try {
            let data = await InvoiceProductList(token, invoiceID)
            data = data.data ? data.data : data
            setInvoiceDetails(data)
            setSelectedInvoiceID(invoiceID)
        } catch (error) {
            toast.error("Failed to load invoice details")
            console.error(error)
        } finally {
            setDetailsLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen flex justify-center items-center">
                <div>Loading...</div>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen flex justify-center items-center">
                <div>Please login to view your purchase history.</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 bg-base-100 text-base-content min-h-screen py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Purchase History</h1>
            {invoices.length > 0 ? (
                <div className="space-y-4">
                    {invoices.map((invoice) => (
                        <div key={invoice._id} className="bg-base-200 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p><strong>Transaction ID:</strong> {invoice.trx_id}</p>
                                    <p><strong>Total:</strong> ${invoice.total}</p>
                                    <p><strong>VAT:</strong> ${invoice.vat}</p>
                                    <p><strong>Payable:</strong> ${invoice.Payable}</p>
                                    <p><strong>Payment Status:</strong> {invoice.payment_status}</p>
                                    <p><strong>Delivery Status:</strong> {invoice.delivery_status}</p>
                                    <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => fetchInvoiceDetails(invoice._id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    disabled={detailsLoading}
                                >
                                    {selectedInvoiceID === invoice._id ? "Hide Details" : "Show Details"}
                                </button>
                            </div>
                            {selectedInvoiceID === invoice._id && (
                                <div className="mt-4">
                                    {detailsLoading ? (
                                        <div>Loading details...</div>
                                    ) : (
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Invoice Details</h3>
                                            {invoiceDetails.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                    {invoiceDetails.map((item, index) => (
                                                        <Link key={index} to={`/product/${item.productID}`} className="block bg-base-100 p-2 rounded hover:bg-base-300 transition">
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
        </div>
    )
}

export default PurchaseHistory
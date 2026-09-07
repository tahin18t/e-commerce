import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { InvoiceDetailByTrx, checkToken } from '../APIRequest/APIRequest'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'

const OrderConfirmedPage = () => {
  const { trxID } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.classList.add('print-order-page')
    return () => document.body.classList.remove('print-order-page')
  }, [])

  useEffect(() => {
    const loadInvoice = async () => {
      const auth = await checkToken()
      if (!auth?.validation) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }
      setIsAuthenticated(true)

      if (!trxID) {
        setLoading(false)
        return
      }

      const data = await InvoiceDetailByTrx(trxID)
      if (data?.status === 'success') {
        setInvoice(data.data.invoice)
      } else {
        toast.error(data?.message || 'Unable to load order details.')
      }
      setLoading(false)
    }

    loadInvoice()
  }, [trxID])

  if (loading || isAuthenticated === null) {
    return (
      <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex justify-center items-center">
        <div>Loading order confirmation...</div>
      </div></Layout>
    )
  }

  if (!isAuthenticated) {
    return (
      <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to view your order confirmation.</p>
          <Link to="/login" className="rounded-lg bg-primary px-4 py-2 text-primary-content">Login</Link>
        </div>
      </div></Layout>
    )
  }

  if (!invoice) {
    return (
      <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex justify-center items-center">
        <div>No order found for this transaction.</div>
      </div></Layout>
    )
  }

  return (
    <Layout><main className="print-confirmation min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-4xl mx-auto rounded-2xl border border-base-300 bg-base-100 shadow-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Order Confirmed</h1>
            <p className="text-base-content/70">Your order is on its way. Thanks for shopping with us!</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
            {invoice.payment_status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-base-300 bg-base-200 p-5">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p><strong>Transaction ID:</strong> {invoice.trx_id}</p>
            <p><strong>Order Total:</strong> ${invoice.total}</p>
            <p><strong>VAT:</strong> ${invoice.vat}</p>
            <p><strong>Payable:</strong> ${invoice.Payable}</p>
            <p><strong>Placed On:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-200 p-5">
            <h2 className="text-xl font-semibold mb-4">Delivery & Billing</h2>
            <p className="mb-2 text-sm text-base-content/60">Billing</p>
            <p className="mb-3 whitespace-pre-line">{invoice.cus_details}</p>
            <p className="mb-2 text-sm text-base-content/60">Shipping</p>
            <p className="whitespace-pre-line">{invoice.ship_details}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <a
            href={`/api/v1/InvoiceDownload/${invoice._id}`}
            className="inline-flex justify-center items-center rounded-lg bg-success px-5 py-3 text-success-content transition hover:brightness-110"
            target="_blank"
            rel="noreferrer"
          >
            Download Invoice
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex justify-center items-center rounded-lg border border-base-300 px-5 py-3 transition hover:bg-base-200"
          >
            Print Confirmation
          </button>
          <Link
            to="/history"
            className="inline-flex justify-center items-center rounded-lg bg-primary px-5 py-3 text-primary-content transition hover:brightness-110"
          >
            View Purchase History
          </Link>
        </div>
      </div>
    </main></Layout>
  )
}

export default OrderConfirmedPage

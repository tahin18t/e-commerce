import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import { InvoiceDetailByTrx, checkToken, InvoiceDownload } from '../APIRequest/APIRequest'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('unknown')
  const [trxID, setTrxID] = useState('')
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  const { status: pathStatus, trxID: pathTrxID } = useParams()

  useEffect(() => {
    const trx = pathTrxID || searchParams.get('trxID') || ''
    const step = pathStatus || searchParams.get('status') || 'unknown'
    setTrxID(trx)
    setStatus(step)

    const load = async () => {
      const auth = await checkToken()
      if (!auth?.validation) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }
      setIsAuthenticated(true)

      if (step === 'success' && trx) {
        const data = await InvoiceDetailByTrx(trx)
        if (data?.status === 'success') {
          setInvoice(data.data.invoice)
        } else {
          toast.error(data?.message || 'Unable to load order summary.')
        }
      }
      setLoading(false)
    }

    load()
  }, [searchParams, pathStatus, pathTrxID])

  const title = status === 'success'
    ? 'Payment Completed'
    : status === 'cancel'
      ? 'Payment Cancelled'
      : status === 'fail'
        ? 'Payment Failed'
        : 'Payment Result'

  const description = status === 'success'
    ? 'Thank you! Your payment completed successfully.'
    : status === 'cancel'
      ? 'Your checkout was cancelled. You can return to the cart to try again.'
      : status === 'fail'
        ? 'The payment could not be completed. Please try again or contact support.'
        : 'Your payment status could not be determined. Please check your order history.'

  if (loading || isAuthenticated === null) {
    return (
      <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex justify-center items-center"><div>Loading payment result...</div></div></Layout>
    )
  }

  if (!isAuthenticated) {
    return (
      <Layout><div className="min-h-[60vh] bg-base-100 text-base-content flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to view your payment result.</p>
          <Link to="/login" className="rounded-lg bg-primary px-4 py-2 text-primary-content">Login</Link>
        </div>
      </div></Layout>
    )
  }

  return (
    <Layout><main className="min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-2xl border border-base-300 bg-base-100 shadow-xl p-8">
        <div className={`rounded-full w-20 h-20 mb-6 flex items-center justify-center ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <span className="text-3xl">{status === 'success' ? '✓' : '✕'}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="mb-6 text-base-content/70">{description}</p>

        {status === 'success' && invoice && (
          <div className="mb-6 rounded-xl border border-base-300 bg-base-200 p-5">
            <p className="mb-2 text-sm text-base-content/60">Order Summary</p>
            <p><strong>Transaction ID:</strong> {invoice.trx_id}</p>
            <p><strong>Order Total:</strong> ${invoice.total}</p>
            <p><strong>VAT:</strong> ${invoice.vat}</p>
            <p><strong>Payable:</strong> ${invoice.Payable}</p>
            <div className="mt-3">
              <a
                href={InvoiceDownload(invoice._id)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                target="_blank"
                rel="noreferrer"
              >
                Download Invoice
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {status === 'success' ? (
            <>
              <Link
                to={`/order-confirmed/${trxID}`}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-5 rounded text-center"
              >
                View Order Confirmation
              </Link>
              <Link
                to="/history"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-5 rounded text-center"
              >
                View Purchase History
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/cart"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded text-center"
              >
                Return to Cart
              </Link>
              <Link
                to="/"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-5 rounded text-center"
              >
                Continue Shopping
              </Link>
            </>
          )}
        </div>
      </div>
    </main></Layout>
  )
}

export default PaymentResultPage

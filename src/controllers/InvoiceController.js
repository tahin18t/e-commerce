import PDFDocument from 'pdfkit'
import bwipjs from 'bwip-js'
import {
    CreateInvoiceService,
    PaymentFailService,
    PaymentCancelService,
    PaymentIPNService,
    PaymentSuccessService,
    InvoiceListService,
    InvoiceProductListService,
    InvoiceDetailService,
    InvoiceDetailByTrxService,
} from "../services/InvoiceServices.js"

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Generate a barcode or QR code as a PNG buffer using bwip-js
 * @param {object} options - bwip-js options
 * @returns {Promise<Buffer>}
 */
const generateBarcodeBuffer = (options) => {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer(options, (err, png) => {
            if (err) return reject(err)
            resolve(png)
        })
    })
}

/**
 * Format a number as USD currency string
 * @param {number|string} value
 * @returns {string}
 */
const moneyFormat = (value) =>
    `$${parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`

// ─── Payment Controllers ─────────────────────────────────────────────────────

export async function CreateInvoice(req, res) {
    try {
        const result = await CreateInvoiceService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function PaymentSuccess(req, res) {
    try {
        const result = await PaymentSuccessService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function PaymentFail(req, res) {
    try {
        const result = await PaymentFailService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function PaymentCancel(req, res) {
    try {
        const result = await PaymentCancelService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function PaymentIPN(req, res) {
    try {
        const result = await PaymentIPNService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

/**
 * SSLCommerz redirects here after payment. Updates DB then redirects user
 * to the frontend result page — NOT back to this endpoint.
 *
 * Route: POST /api/v1/payment-result/:status/:trxID
 *
 * @param {'success'|'fail'|'cancel'} req.params.status
 * @param {string} req.params.trxID
 */
export async function PaymentResultRedirect(req, res) {
    const { status, trxID } = req.params

    const ALLOWED_STATUSES = ['success', 'fail', 'cancel']

    if (!trxID || !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid payment status or transaction ID',
        })
    }

    // Update payment status in DB — errors are logged but don't block redirect
    try {
        if (status === 'success') await PaymentSuccessService(req)
        else if (status === 'fail')   await PaymentFailService(req)
        else if (status === 'cancel') await PaymentCancelService(req)
    } catch (err) {
        console.error(`[PaymentResultRedirect] DB update failed — status: ${status}, trxID: ${trxID}`, err)
    }

    // Redirect user to FRONTEND page, NOT back to this API route
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
    return res.redirect(`${FRONTEND_URL}/payment-result/${status}/${trxID}`)
}

// ─── Invoice Controllers ──────────────────────────────────────────────────────

export async function InvoiceList(req, res) {
    try {
        const result = await InvoiceListService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function InvoiceProductList(req, res) {
    try {
        const result = await InvoiceProductListService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function InvoiceDetail(req, res) {
    try {
        const result = await InvoiceDetailService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

export async function InvoiceDetailByTrx(req, res) {
    try {
        const result = await InvoiceDetailByTrxService(req)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }
}

// ─── PDF Download ─────────────────────────────────────────────────────────────

export async function InvoiceDownload(req, res) {
    // 1. Fetch invoice data
    let invoiceData
    try {
        invoiceData = await InvoiceDetailService(req)
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message })
    }

    if (invoiceData.status !== 'success') {
        return res.status(400).json(invoiceData)
    }

    const { invoice, products } = invoiceData.data

    // 2. Generate QR code and barcode buffers
    const host     = req.get('host')
    const protocol = req.protocol
    const invoiceUrl = `${protocol}://${host}/api/v1/InvoiceDownload/${invoice._id}`

    let qrBuffer       = null
    let barcodeBuffer  = null

    try {
        qrBuffer = await generateBarcodeBuffer({
            bcid: 'qrcode',
            text: invoiceUrl,
        })
    } catch (err) {
        console.error('[InvoiceDownload] QR code generation failed:', err)
    }

    try {
        barcodeBuffer = await generateBarcodeBuffer({
            bcid: 'code128',
            text: invoice.trx_id,
            includetext: true,
            textxalign: 'center',
        })
    } catch (err) {
        console.error('[InvoiceDownload] Barcode generation failed:', err)
    }

    // 3. Build PDF into a buffer first — only send headers when fully ready
    const doc    = new PDFDocument({ size: 'A4', margin: 40 })
    const chunks = []

    doc.on('data', (chunk) => chunks.push(chunk))

    doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.trx_id}.pdf`)
        res.setHeader('Content-Length', pdfBuffer.length)
        res.send(pdfBuffer)
    })

    doc.on('error', (err) => {
        console.error('[InvoiceDownload] PDFDocument stream error:', err)
        if (!res.headersSent) {
            res.status(500).json({ status: 'error', message: 'PDF generation failed' })
        }
    })

    // 4. Draw PDF content
    _drawPDF(doc, invoice, products, qrBuffer, barcodeBuffer)

    doc.end()
}

// ─── PDF Drawing (private) ───────────────────────────────────────────────────

const LEFT   = 40
const RIGHT  = 330
const EDGE   = 555

/**
 * Draw the full invoice PDF content onto the PDFDocument
 * Kept separate so InvoiceDownload stays readable
 */
function _drawPDF(doc, invoice, products, qrBuffer, barcodeBuffer) {
    // ── Header ──
    doc.fillColor('#1f2937').fontSize(22).font('Helvetica-Bold')
        .text('Ecommarch', { align: 'center' })
    doc.fontSize(12).font('Helvetica').fillColor('#4b5563')
        .text('Professional E-commerce Invoice', { align: 'center' })
    doc.moveDown(1)

    // ── Invoice title + ID ──
    doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold')
        .text(`Invoice #${invoice.trx_id}`, { align: 'center' })
    doc.moveDown(0.5)

    // ── Company + meta info ──
    const metaTop = doc.y
    doc.fillColor('#4b5563').fontSize(10).font('Helvetica')

    doc.text('Ecommarch Ltd.',                                LEFT,  metaTop)
    doc.text('Invoice Date:',                                 RIGHT, metaTop)

    doc.text('123 Commerce Ave',                              LEFT,  metaTop + 14)
    doc.text(new Date(invoice.createdAt).toLocaleDateString(), RIGHT, metaTop + 14)

    doc.text('Dhaka, Bangladesh',                             LEFT,  metaTop + 28)
    doc.text('Payment Status:',                               RIGHT, metaTop + 28)

    const statusColor = invoice.payment_status === 'success' ? '#047857' : '#b91c1c'
    doc.fillColor(statusColor)
        .text(invoice.payment_status.toUpperCase(),           RIGHT, metaTop + 42)

    doc.y = metaTop + 62
    doc.moveDown(0.5)

    // ── Separator ──
    _drawLine(doc, doc.y)
    doc.moveDown(1)

    // ── QR code + Barcode ──
    const imageTop = doc.y

    if (qrBuffer) {
        doc.image(qrBuffer, LEFT, imageTop, { width: 110 })
    }
    if (barcodeBuffer) {
        doc.image(barcodeBuffer, RIGHT, imageTop, { width: 180, height: 60 })
    }
    if (qrBuffer || barcodeBuffer) {
        doc.fontSize(9).fillColor('#4b5563').font('Helvetica')
        if (qrBuffer) {
            doc.text('Scan for invoice', LEFT, imageTop + 115, { width: 110, align: 'center' })
        }
        if (barcodeBuffer) {
            doc.text(`TRX: ${invoice.trx_id}`, RIGHT, imageTop + 65, { width: 180, align: 'center' })
        }
        doc.y = imageTop + 140
    }
    doc.moveDown(1)

    // ── Billing + Shipping ──
    const addressTop   = doc.y
    const billedTitle  = invoice.payment_status === 'success' ? 'Payment Complete' : 'Billed To'

    doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold')
        .text(billedTitle,    LEFT,  addressTop)
    doc.text('Shipping To',   RIGHT, addressTop)

    doc.font('Helvetica').fillColor('#4b5563').fontSize(10)

    const billedLines = _splitDetails(invoice.cus_details)
    const shipLines   = _splitDetails(invoice.ship_details)

    let billedY = addressTop + 18
    billedLines.forEach((line) => {
        doc.text(line, LEFT, billedY, { width: 260 })
        billedY += 14
    })

    let shipY = addressTop + 18
    shipLines.forEach((line) => {
        doc.text(line, RIGHT, shipY, { width: 215 })
        shipY += 14
    })

    doc.y = Math.max(billedY, shipY) + 16

    // ── Product Table ──
    _drawProductTable(doc, invoice, products)

    // ── Footer note ──
    doc.moveDown(1.5)
    doc.fontSize(10).fillColor('#6b7280').font('Helvetica')
        .text(
            'Thank you for your purchase! For any questions please contact support@ecommarch.com.',
            LEFT, doc.y, { width: 520, align: 'center' }
        )
}

/**
 * Draw the product table including header, rows, and totals
 */
function _drawProductTable(doc, invoice, products) {
    // Table header
    const tableTop = doc.y

    doc.fontSize(11).fillColor('#111827').font('Helvetica-Bold')
    doc.text('Item',        LEFT, tableTop,         { width: 240 })
    doc.text('Qty',         290,  tableTop)
    doc.text('Unit Price',  340,  tableTop)
    doc.text('Total',       455,  tableTop,         { width: 100, align: 'right' })

    _drawLine(doc, tableTop + 16)

    // Rows
    let y        = tableTop + 26
    let subtotal = 0

    doc.font('Helvetica').fontSize(10).fillColor('#374151')

    products.forEach((item, index) => {
        const unitPrice  = parseFloat(item.price)
        const qty        = parseInt(item.qty)
        const totalPrice = unitPrice * qty
        subtotal        += totalPrice

        doc.text(`${index + 1}. ${item.product.title}`, LEFT, y, { width: 240 })
        doc.text(qty.toString(),                          290,  y)
        doc.text(moneyFormat(unitPrice),                  340,  y)
        doc.text(moneyFormat(totalPrice),                 455,  y, { width: 100, align: 'right' })

        y += 20

        // Page break if near bottom
        if (y > 700) {
            doc.addPage()
            y = 50
        }
    })

    _drawLine(doc, y + 6)
    doc.y = y + 20

    // Totals block
    const vat        = parseFloat(invoice?.vat ?? subtotal * 0.05)
    const grandTotal = parseFloat(invoice?.Payable ?? subtotal + vat)

    _drawTotalRow(doc, 'Subtotal',   moneyFormat(subtotal),  false)
    doc.moveDown(0.6)
    _drawTotalRow(doc, 'VAT (5%)',   moneyFormat(vat),       false)
    doc.moveDown(0.6)
    _drawTotalRow(doc, 'Grand Total', moneyFormat(grandTotal), true)
}

/**
 * Draw a single key-value row in the totals section
 */
function _drawTotalRow(doc, label, value, bold) {
    const font = bold ? 'Helvetica-Bold' : 'Helvetica'
    const y    = doc.y

    doc.font(font).fontSize(11).fillColor('#111827')
        .text(label, 330,  y)
        .text(value, 455,  y, { width: 100, align: 'right' })
}

/**
 * Draw a full-width horizontal rule
 */
function _drawLine(doc, y) {
    doc.strokeColor('#e5e7eb').lineWidth(1)
        .moveTo(LEFT, y).lineTo(EDGE, y).stroke()
}

/**
 * Split a comma-separated detail string into trimmed lines
 */
function _splitDetails(str = '') {
    return str.split(',').map((s) => s.trim()).filter(Boolean)
}
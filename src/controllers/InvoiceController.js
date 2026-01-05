import {
    CreateInvoiceService,
    PaymentFailService,
    PaymentCancelService,
    PaymentIPNService,
    PaymentSuccessService,
    InvoiceListService,
    InvoiceProductListService,
} from "../services/InvoiceServices.js"

export async function CreateInvoice(req, res){
    let result = await CreateInvoiceService(req)
    res.status(200).json(result)
}

export async function PaymentFail(req, res){
    let result = await PaymentFailService(req)
    res.status(200).json(result)
}

export async function PaymentCancel(req, res){
    let result = await PaymentCancelService(req)
    res.status(200).json(result)
}

export async function PaymentIPN(req, res){
    let result = await PaymentIPNService(req)
    res.status(200).json(result)
}

export async function PaymentSuccess(req, res){
    let result = await PaymentSuccessService(req)
    res.status(200).json(result)
}

export async function InvoiceList(req, res){
    let result = await InvoiceListService(req)
    res.status(200).json(result)
}

export async function InvoiceProductList(req, res){
    let result = await InvoiceProductListService(req)
    res.status(200).json(result)
}


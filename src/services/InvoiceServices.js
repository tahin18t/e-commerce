import CartModel from "../models/CartModel.js";
import ProfileModel from "../models/ProfileModel.js";
import InvoiceModel from "../models/InvoiceModel.js";
import InvoiceProductModel from "../models/InvoiceProductModel.js";
import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;
import FormData from 'form-data'
import axios from 'axios'
import PaymentSettingsModel from "../models/PaymentSettingModel.js";

export async function CreateInvoiceService(req) {
    let user_id = new ObjectID(req.headers.user_id)
    let cus_email = req.headers.email
    let MatchStage = {$match: {userID: user_id}}

    //======== Step 1: Calculate Total Payable & Vat ===============//
    let JoinWIthProductStage = {
        $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "_id",
            as: "product"
        }
    }
    let UnwindProductStage = {$unwind: "$product"}
    let ProjectionStage = {
        $project: {
            qty: 1,
            productID: 1,
            price: 1,
            color: 1,
            size: 1,
            "product.price": 1,
            "product.discountPrice": 1
        }
    }
    let CartProduct
    try {
        CartProduct = await CartModel.aggregate([
            MatchStage,
            JoinWIthProductStage, UnwindProductStage,
            ProjectionStage
        ])
    } catch (error) {
        return {status: "Fail to read cart or product", message: error.message};
    }

    let totalAmount = 0
    CartProduct.forEach((Cart) => {
        let price = 0;
        if (Cart.product.discountPrice > 0)
            price = Cart.product.discountPrice
        else
            price = Cart.product.price
        totalAmount += parseInt(Cart.qty) * parseFloat(price)
    })
    let vat = totalAmount * 0.05    //5% vat
    let payable = totalAmount + vat

    //======== Step 2: Prepare Customer Details & Shipping details ========//
    let Profile, cus_details, ship_details
    try {
        Profile = await ProfileModel.aggregate([MatchStage])
        cus_details = `Name:${Profile[0].cus_name}, Email:${cus_email}, Address:${Profile[0].cus_add + "," + Profile[0].cus_city}, Phone:${Profile[0].cus_phone}`
        ship_details = `Name:${Profile[0].ship_name}, Address:${Profile[0].ship_add + ", " + Profile[0].ship_city + ", " + Profile[0].ship_state}, Phone:${Profile[0].ship_phone}`
    } catch (e) {
        return {status: "Fail to read Profile", data: e.message}
    }

    //======== Step 3: Transaction & other's ID ========//
    let trx_id = Date.now().toString()
    let val_id = 0
    let delivery_status = "pending"
    let payment_status = "pending"

    //======== Step 4: Create Invoice ========//

    let createInvoice
    try {
        createInvoice = await InvoiceModel.create({
            userID: user_id,
            Payable: payable,
            cus_details: cus_details,
            ship_details: ship_details,
            trx_id: trx_id,
            val_id: val_id,
            delivery_status: delivery_status,
            payment_status: payment_status,
            total: totalAmount,
            vat: vat
        })
    } catch (e) {
        return {status: "Fail to create Invoice", data: e.message}
    }

    //======== Step 5: Create Invoice Product ========//
    try {
        let InvoiceProduct = await InvoiceProductModel.insertMany(
            CartProduct.map(Cart => ({
                userID: user_id,
                invoiceID: createInvoice._id,
                productID: Cart.productID,
                qty: Cart.qty,
                price: (Cart.product.discountPrice > 0) ? Cart.product.discountPrice : Cart.product.price,
                color: Cart.color,
                size: Cart.size
            }))
        )
    } catch (e) {
        return {status: "Fail to create InvoiceProduct", data: e.message}
    }

    //======== Step 6: Remove Carts ========//
    // try {
    //     await CartModel.deleteMany({userID: user_id})
    // } catch (e) {
    //     return {status: "Fail to delete Invoice from cart", data: e.message}
    // }

    //======== Step 7: Prepare SSL Payment ========//
    let PaymentSettings = await PaymentSettingsModel.find()

    const form = new FormData()
    form.append('store_id', PaymentSettings[0].store_id)
    form.append('store_passwd', PaymentSettings[0].store_passwd)
    form.append('total_amount', payable.toString())
    form.append('currency', PaymentSettings[0].currency)
    form.append('tran_id', trx_id)
    form.append('success_url', `${PaymentSettings[0].success_url}/${trx_id}`)
    form.append('fail_url', `${PaymentSettings[0].fail_url}/${trx_id}`)
    form.append('cancel_url', `${PaymentSettings[0].cancel_url}/${trx_id}`)
    form.append('ipn_url', PaymentSettings[0].ipn_url)

    form.append('cus_name', Profile[0].cus_name)
    form.append('cus_email', cus_email)
    form.append('cus_add1', Profile[0].cus_add)
    form.append('cus_add2', Profile[0].cus_add)
    form.append('cus_city', Profile[0].cus_city)
    form.append('cus_state', Profile[0].cus_state)
    form.append('cus_postcode', Profile[0].cus_postcode)
    form.append('cus_country', Profile[0].cus_country)
    form.append('cus_phone', Profile[0].cus_phone)
    form.append('cus_fax', Profile[0].cus_phone)

    form.append('shipping_method', "Yes")
    form.append('ship_name', Profile[0].ship_name)
    form.append('ship_add1', Profile[0].ship_add)
    form.append('ship_add2', Profile[0].ship_add)
    form.append('ship_city', Profile[0].ship_city)
    form.append('ship_state', Profile[0].ship_state)
    form.append('ship_country', Profile[0].ship_country)
    form.append('ship_postcode', Profile[0].ship_postcode)

    form.append('product_name', 'Accoriding to Invoice')
    form.append('product_category', 'Accoriding to Invoice')
    form.append('product_profile', 'Accoriding to Invoice')
    form.append('product_amount', 'Accoriding to Invoice')

    let SSLRes = await axios.post(PaymentSettings[0].init_url, form)

    return {status: "success", data: SSLRes.data}
}

export async function PaymentSuccessService(req) {
    try {
        let trxID = req.params.trxID
        await InvoiceModel.updateOne({trx_id:trxID}, {payment_status: "success"})

        return {status: "success"};
    }
    catch (error) {
        return {status: error, data: error.message};
    }
}

export async function PaymentFailService(req) {
    try {
        let trxID = req.params.trxID
        await InvoiceModel.updateOne({trx_id:trxID}, {payment_status:"fail"})

        return {status: "success"};
    }
    catch (error) {
        return {status: error, data: error.message};
    }
}

export async function PaymentCancelService(req) {
    try {
        let trxID = req.params.trxID
        await InvoiceModel.updateOne({trx_id:trxID}, {payment_status:"cancel"})

        return {status: "success"};
    }
    catch (error) {
        return {status: error, data: error.message};
    }
}

export async function PaymentIPNService(req) {
    try {
        let trxID = req.params.trxID
        let status = req.body.status
        await InvoiceModel.updateOne({trx_id:trxID}, {payment_status:status})

        return {status: "success", data: req.body};
    }
    catch (error) {
        return {status: error, data: error.message};
    }
}

export async function InvoiceListService(req) {
    try {
        let userID = new ObjectID(req.headers.user_id)
        let invoices = await InvoiceModel.find({userID:userID}, {}, {})
        return {status: "success", data: invoices};
    }
    catch (error) {
        return {status: error, data: error.message};
    }
}

export async function InvoiceProductListService(req) {
    try {
        let invoiceID = new ObjectID(req.body.invoiceID)
        let MatchStage = {$match: {invoiceID: invoiceID}}
        let JoinWithProductStage = {
            $lookup: {
                from: "products",
                localField: "productID",
                foreignField: "_id",
                as: "product"
            }
        }
        let UnwindProductStage = {$unwind: "$product"}
        let ProjectionStage = {
            $project: {
                qty: 1,
                price: 1,
                color: 1,
                size: 1,
                productID: 1,
                "product.image": 1,
                "product.title": 1
            }
        }
        let InvoiceProduct = await InvoiceProductModel.aggregate([
            MatchStage,
            JoinWithProductStage,
            UnwindProductStage,
            ProjectionStage
        ])
        return {status: "success", data: InvoiceProduct};
    }
    catch (error) {
        return {status: error, data: error.message};
    }
}
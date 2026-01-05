import {
    CartListService,
    AddToCartService,
    RemoveFromCartService
} from "../services/CartListServices.js"

export async function CartList(req, res) {
    let result = await CartListService(req)
    res.status(200).json(result)
}

export async function AddToCart(req, res) {
    let result = await AddToCartService(req)
    res.status(200).json(result)
}

export async function RemoveFromCart(req, res) {
    let result = await RemoveFromCartService(req)
    res.status(200).json(result)
}

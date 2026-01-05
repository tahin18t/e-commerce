import {
    WishListService,
    AddToWishListService,
    RemoveFromWishListService
} from "../services/WishListServices.js"

export async function WishList(req, res) {
    let result = await WishListService(req)
    res.status(200).json(result)
}

export async function AddToWishList(req, res) {
    let result = await AddToWishListService(req)
    res.status(200).json(result)
}

export async function RemoveFromWishList(req, res) {
    let result = await RemoveFromWishListService(req)
    res.status(200).json(result)
}

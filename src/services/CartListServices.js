import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";
import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;

export async function CartListService(req) {
    try {
        let user_id = new ObjectID(req.headers.user_id);
        let MatchStage = { $match: { userID: user_id } }
        let JoinWithProductStage = {
            $lookup: {
                from: "products",
                localField: "productID",
                foreignField: "_id",
                as: "Product",
            }
        }
        let unwindProductStage = { $unwind: "$Product" };
        let projectionStage = {
            $project: {
                color: 1,
                qty: 1,
                size: 1,
                "Product._id": 1,
                "Product.image": 1,
                "Product.title": 1,
                "Product.price": 1,
                "Product.discountPrice": 1,
                "Product.star": 1,
                "Product.stock": 1,
                "Product.remark": 1
            }
        }

        let data = await CartModel.aggregate([
            MatchStage,
            JoinWithProductStage, unwindProductStage,
            projectionStage
        ])

        return { status: "success", data: data }
    }
    catch (e) {
        return { status: "error", error: e.message };
    }
}

export async function AddToCartService(req) {
    try {
        let reqBody = req.body;
        reqBody.userID = req.headers.user_id
        let data = await CartModel.updateOne(
            { userID: new ObjectID(reqBody.userID), productID: new ObjectID(reqBody.productID) },
            reqBody,
            { upsert: true }
        )

        return { status: "success", data: data }

    }
    catch (e) {
        return { status: "error", error: e.message };
    }
}

export async function RemoveFromCartService(req) {
    try {
        let ProductID = new ObjectID(req.params.ProductID)
        let UserID = new ObjectID(req.headers.user_id)
        // console.log(ProductID, UserID)
        
        // // Check all carts for this user
        // let allCarts = await CartModel.find({ userID: UserID })
        // console.log('All carts for user:', allCarts)
        
        // // Check if the document exists
        // let existingCart = await CartModel.findOne({
        //     productID: ProductID,
        //     userID: UserID
        // })
        // console.log('Existing cart item:', existingCart)
        
        let data = await CartModel.deleteOne({
            productID: ProductID,
            userID: UserID
        })
        console.log(data)
        return { status: "success", data: data }
    }
    catch (e) {
        return { status: "error", error: e.message };
    }
}
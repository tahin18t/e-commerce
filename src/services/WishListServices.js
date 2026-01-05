import WishModel from "../models/WishModel.js";
import ProductModel from "../models/ProductModel.js";
import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;

export async function WishListService(req) {
    try {
        let user_id = new ObjectID(req.headers.user_id);

        const wishListItems = await WishModel.find({ userID: user_id }, { productID: 1, _id: 0 });
        const productIDs = wishListItems.map(item => item.productID);
        const data = await ProductModel.find(
            { _id: { $in: productIDs } },
            'title shortDes price discountPrice image stock remark _id' // only the fields you want
        );

        /*
        let MatchStage = {
            $match:{
                userID: uset_id
            }
        }
        let JoinWithProductStage = {
            $lookup: {
                from: "products",
                localField: 'productID',
                foreignField: '_id',
                as: 'product'
            }
        }
        let UnwindProductStage = {$unwind:"$product"};
        let ProjectionStage = {
            $project:{
                "product._id": 1,
                "product.title": 1,
                "product.shortDes": 1,
                "product.price": 1,
                "product.discountPrice": 1,
                "product.image": 1,
                "product.stock": 1,
                "product.remark":1
            }
        }
        let data = await WishModel.aggregate([
            MatchStage,
            JoinWithProductStage, UnwindProductStage,
            ProjectionStage
        ])
         */
        return {status: "success", data: data}
    }
    catch (e) {
        return {status: "error", error: e.message};
    }
}

export async function AddToWishListService(req) {
    try{
        let ProductID = req.params.ProductID
        let UserID = req.headers.user_id
        let Wish = {
            productID: ProductID,
            userID: UserID
        }
        let data = await WishModel.create(Wish)

        return {status: "success", data: data}
    }
    catch (e) {
        return {status: "error", error: e.message};
    }
}

export async function RemoveFromWishListService(req) {
    try{
        let ProductID = new ObjectID(req.params.ProductID)
        let UserID = new ObjectID(req.headers.user_id)
        let Wish = {
            productID: ProductID,
            userID: UserID
        }
        let data = await WishModel.deleteOne(Wish)

        return {status: "success", data: data}
    }
    catch (e) {
        return {status: "error", error: e.message};
    }
}
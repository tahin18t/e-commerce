import BrandModel from "../models/BrandModel.js";
import CategoryModel from "../models/CategoryModel.js";
import ProductSliderModel from "../models/ProductSliderModel.js";
import ProductModel from "../models/ProductModel.js";
import ReviewModel from "../models/ReviewModel.js";
import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;

export async function BrandListService(){
    try {
        let data = await BrandModel.find(undefined, undefined, undefined);
        return {status: "success", data: data}
    }
    catch(err){
        return {status: "error", error: err}
    }
}
export async function CategoryListService(){
    try {
        let data = await CategoryModel.find(undefined, undefined, undefined);
        return {status: "success",data: data}
    }
    catch(err){
        return {status: "error",error: err}
    }
}
export async function SliderListService(){
    try {
        let data = await ProductSliderModel.find(undefined, undefined, undefined);
        return {status: "success",data: data}
    } catch(err){
        return {status: "error", error: err}
    }
}
export async function ListByBrandService(req) {
    let BrandId = new ObjectID(req.params.BrandID);
    return await getProductsByFilter([{$match:{ brandID: BrandId }}]);
}
export async function ListByCategoryService(req) {
    let CategoryId = new ObjectID(req.params.CategoryID);
    return await getProductsByFilter([{$match:{ categoryID: CategoryId }}]);
}
export async function ListByKeywordService(req){
    let SearchRegex = {$regex:req.params.Keyword, $options:"imsx"};
    let MatchCondition = {
        $or:[
            {title:SearchRegex},
            {shortDes:SearchRegex}
        ]
    }
    return await getProductsByFilter(MatchCondition)
}
export async function ListByRemarkService(req){
    return await getProductsByFilter({remark:req.params.Remark})
}
export async function DetailService(req){
    try {
        let ProductID = new ObjectID(req.params.ProductID);
        let MatchStage = {$match:{_id:ProductID}};
        let JoinWithDetailsStage = {
            $lookup:{
                from:"productdetails",
                localField:"_id",
                foreignField:"productID",
                as:"details",
            }
        }
        let UnwindDetailsStage = {$unwind:"$details"}
        let JoinWithBrandStage = {
            $lookup:{
                from:"brands",
                localField:"brandID",
                foreignField:"_id",
                as:"brand"
            }
        }
        let UnwindBrandStage = {$unwind:"$brand"}
        let JoinWithCategoryStage = {
            $lookup:{
                from:"categories",
                localField:"categoryID",
                foreignField:"_id",
                as:"category"
            }
        }
        let UnwindCategoryStage = {$unwind:"$category"}
        let projectionStage = {
            $project:{
                'details.productID':0,
                'details._id':0,
                'brand._id':0,
                'category._id':0,
                'brandID':0,
                'categoryID':0
            }
        }
        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithDetailsStage, UnwindDetailsStage,
            JoinWithBrandStage, UnwindBrandStage,
            JoinWithCategoryStage, UnwindCategoryStage,
            projectionStage
        ])
        return {status: "success", data: data}
    } catch (error) {
        return {status: "error",error: error.message}
    }
}
export async function ReviewListService(req){
    try {
        let ProductID = new ObjectID(req.params.ProductID);
        let MatchStage = {$match:{productID:ProductID}}
        let JoinWithProfileStage = {
            $lookup:{
                from:"profiles",
                localField:"userID",
                foreignField:"userID",
                as:"profile"
            }
        }
        let ProjectionStage = {
            $project:{
                "des":1,
                "rating":1,
                "profile.cus_name":1,
                "_id":1
            }
        }
        let UnwindProfileStage = {$unwind:"$profile"}
        let data = await ReviewModel.aggregate([
            MatchStage,
            JoinWithProfileStage, UnwindProfileStage,
            ProjectionStage
        ])
        return {status: "success", data: data}
    } catch (error) {
        return {status: "error",error: error.message}
    }
}

export async function ProductListByFilterService(req){
    try {
        let {minPrice, maxPrice, minStar, maxStar, categoryID, brandID, remark} = req.body;
        let pipeline = [
            {
                $addFields: {
                    effectivePrice: {
                        $cond: [
                            { $gt: [{ $convert: {input: "$discountPrice", to: "double", onError: 0, onNull: 0}}, 0] },
                            { $toDouble: "$discountPrice"},
                            { $convert: {input: "$price", to: "double", onError: 0, onNull: 0}}
                        ]
                    },
                    starNum: { $toDouble: "$star" }
                }
            },
            {
                $match: {
                    effectivePrice: { $gte: minPrice || 0, $lte: maxPrice || Number.MAX_VALUE },
                    starNum: { $gte: minStar || 0, $lte: maxStar || 5 }
                }
            },
            {
                $project:{
                    effectivePrice:0,
                    starNum:0
                }
            }
        ];

        // Optional filters
        if (categoryID) {
            pipeline[1].$match.categoryID = new ObjectID(categoryID);
        }
        if (brandID) {
            pipeline[1].$match.brandID = new ObjectID(brandID);
        }
        if (remark) {
            pipeline[1].$match.remark = { $regex: remark, $options: "i" };
        }
        return await getProductsByFilter(pipeline)
    }
    catch (e) {
        return {status: "error",error: e.message};
    }
}



async function getProductsByFilter(pipeline) {
    try {
        let JoinWithBrandStage = {
            $lookup: {
                from: "brands",
                localField: "brandID",
                foreignField: "_id",
                as: "brand"
            }
        };
        let UnwindBrandStage = { $unwind: "$brand" };

        let JoinWithCategoryStage = {
            $lookup: {
                from: "categories",
                localField: "categoryID",
                foreignField: "_id",
                as: "category"
            }
        };
        let UnwindCategoryStage = { $unwind: "$category" };

        let projectionStage = {
            $project: {
                "brand._id": 0,
                "category._id": 0,
                brandID: 0,
                categoryID: 0
            }
        };

        let data = await ProductModel.aggregate([
            ...pipeline,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            projectionStage
        ]);

        return { status: "success", data };
    } catch (error) {
        return { status: "error", error: error.message };
    }
}
import {
    BrandListService,
    CategoryListService,
    SliderListService,
    ListByBrandService,
    ListByCategoryService,
    ListByRemarkService,
    ListByKeywordService,
    DetailService,
    ReviewListService,
    ProductListByFilterService
} from "../services/ProductServices.js";

export async function ProductBrandList (req, res) {
    let result = await BrandListService();
    return res.status(200).json(result)
}
export async function ProductCategoryList (req, res){
    let result = await CategoryListService();
    return res.status(200).json(result)
}
export async function ProductSliderList (req, res){
    let result = await SliderListService();
    return res.status(200).json(result)
}
export async function ProductListByBrand (req, res){
    let result = await ListByBrandService(req);
    return res.status(200).json(result)
}
export async function ProductListByCategory (req, res){
    let result = await ListByCategoryService(req);
    return res.status(200).json(result)
}
export async function ProductListBySimilar (req, res){
    let result = await ListByCategoryService(req);
    return res.status(200).json(result)
}
export async function ProductListByKeyword (req, res){
    let result = await ListByKeywordService(req);
    return res.status(200).json(result)
}
export async function ProductListByRemark (req, res){
    let result = await ListByRemarkService(req);
    return res.status(200).json(result)
}
export async function ProductDetails (req, res){
    let result = await DetailService(req);
    return res.status(200).json(result)
}
export async function ProductReviewList (req, res){
    let result = await ReviewListService(req);
    return res.status(200).json(result)
}

export async function ProductListByFilter(req, res){
    let result = await ProductListByFilterService(req)
    return res.status(200).json(result)
}
import express from "express";
import * as ProductController from "../controllers/ProductController.js";
import * as UserController from "../controllers/UserController.js";
import * as WishListController from "../controllers/WishListController.js"
import * as CartListController from "../controllers/CartListController.js"
import * as FeaturesController from "../controllers/FeaturesController.js"
import * as InvoiceController from "../controllers/InvoiceController.js"
import AuthVerification from "../middleware/AuthVerification.js"
const router = express.Router();

// Product API
router.get("/ProductBrandList", ProductController.ProductBrandList)
router.get("/ProductCategoryList", ProductController.ProductCategoryList)
router.get("/ProductSliderList", ProductController.ProductSliderList)
router.get("/ProductListByBrand/:BrandID", ProductController.ProductListByBrand)
router.get("/ProductListByCategory/:CategoryID", ProductController.ProductListByCategory)
router.get("/ProductListBySimilar/:CategoryID", ProductController.ProductListBySimilar)
router.get("/ProductListByKeyword/:Keyword", ProductController.ProductListByKeyword)
router.get("/ProductListByRemark/:Remark", ProductController.ProductListByRemark)
router.get("/ProductDetails/:ProductID", ProductController.ProductDetails)
router.get("/ProductReviewList/:ProductID", ProductController.ProductReviewList)
router.post("/ProductListByFilter", ProductController.ProductListByFilter)

// User API
router.get("/LoginRequest/:email", UserController.UserOTP)
router.get("/VerifyLogin/:email/:otp", UserController.VerifyLogin)
router.post("/UpdateProfile", AuthVerification, UserController.UpdateProfile)
router.get("/ReadProfile", AuthVerification, UserController.ReadProfile)
router.get("/UserLogout", AuthVerification, UserController.UserLogout)
router.get("/checkToken", AuthVerification, (req, res) => {
  res.status(200).json({ validation: true });
});


router.post("/CreateReview", AuthVerification, UserController.CreateReview)

// Wish API
router.get("/WishList", AuthVerification, WishListController.WishList)
router.post("/AddToWishList/:ProductID", AuthVerification, WishListController.AddToWishList)
router.get("/RemoveFromWishList/:ProductID", AuthVerification, WishListController.RemoveFromWishList)

// Cart API
router.get("/CartList", AuthVerification, CartListController.CartList)
router.post("/AddToCart", AuthVerification, CartListController.AddToCart)
router.get("/RemoveFromCart/:ProductID", CartListController.RemoveFromCart)

// Invoice API
router.get("/CreatInvoice", AuthVerification, InvoiceController.CreateInvoice)

router.get("/InvoiceList", AuthVerification, InvoiceController.InvoiceList)
router.get("/InvoiceProductList/:invoice_id", AuthVerification, InvoiceController.InvoiceProductList)

router.post("/PaymentSuccess/:trxID", InvoiceController.PaymentSuccess)
router.post("/PaymentCancel/:trxID", InvoiceController.PaymentCancel)
router.post("/PaymentFail/:trxID", InvoiceController.PaymentFail)
router.post("/PaymentIPN/:trxID", InvoiceController.PaymentIPN)
router.get("/InvoiceList", AuthVerification, InvoiceController.InvoiceList)
router.get("/InvoiceProductList", AuthVerification, InvoiceController.InvoiceProductList)

// Features API
router.get("/FeaturesList", FeaturesController.FeaturesList)

export default router;



import express from "express";
import * as ProductController from "../controllers/ProductController.js";
import * as UserController from "../controllers/UserController.js";
import * as WishListController from "../controllers/WishListController.js"
import * as CartListController from "../controllers/CartListController.js"
import * as FeaturesController from "../controllers/FeaturesController.js"
import * as InvoiceController from "../controllers/InvoiceController.js"
import AuthVerification from "../middleware/AuthVerification.js"
import passport from 'passport'
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
router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  const { token } = req.user || {}
  if (!token) return res.redirect('/login')
  res.cookie('token', token, {
    expires: new Date(Date.now()+24*60*60*1000),
    httpOnly: true,
  })
  return res.redirect('/')
})
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const { token } = req.user || {};
    if (!token) return res.redirect('/login');
    res.cookie('token', token, {
      expires: new Date(Date.now() + 24*60*60*1000),
      httpOnly: true,
    });
    return res.redirect('/');
  }
);
router.post("/UpdateProfile", AuthVerification, UserController.UpdateProfile)
router.get("/ReadProfile", AuthVerification, UserController.ReadProfile)
router.get("/UserLogout", AuthVerification, UserController.UserLogout)
router.get("/checkToken", AuthVerification, (req, res) => {
  res.status(200).json({ validation: true });
});

router.post("/CreateReview", AuthVerification, UserController.CreateReview)
router.get('/InvoiceDetail/:invoiceID', AuthVerification, InvoiceController.InvoiceDetail)
router.get('/InvoiceDetailByTrx/:trxID', AuthVerification, InvoiceController.InvoiceDetailByTrx)
router.get('/InvoiceDownload/:invoiceID', AuthVerification, InvoiceController.InvoiceDownload)

// Wish API
router.get("/WishList", AuthVerification, WishListController.WishList)
router.post("/AddToWishList/:ProductID", AuthVerification, WishListController.AddToWishList)
router.get("/RemoveFromWishList/:ProductID", AuthVerification, WishListController.RemoveFromWishList)

// Cart API
router.get("/CartList", AuthVerification, CartListController.CartList)
router.post("/AddToCart", AuthVerification, CartListController.AddToCart)
router.get("/RemoveFromCart/:ProductID", AuthVerification, CartListController.RemoveFromCart)

// Invoice API
router.get("/CreateInvoice", AuthVerification, InvoiceController.CreateInvoice)

router.get("/InvoiceList", AuthVerification, InvoiceController.InvoiceList)

router.post("/PaymentSuccess/:trxID", InvoiceController.PaymentSuccess)
router.get("/PaymentSuccess/:status/:trxID", InvoiceController.PaymentSuccess)
router.post("/PaymentSuccess/:status/:trxID", InvoiceController.PaymentSuccess)
router.post("/PaymentCancel/:trxID", InvoiceController.PaymentCancel)
router.get("/PaymentCancel/:status/:trxID", InvoiceController.PaymentCancel)
router.post("/PaymentCancel/:status/:trxID", InvoiceController.PaymentCancel)
router.post("/PaymentFail/:trxID", InvoiceController.PaymentFail)
router.get("/PaymentFail/:status/:trxID", InvoiceController.PaymentFail)
router.post("/PaymentFail/:status/:trxID", InvoiceController.PaymentFail)
router.post("/PaymentIPN/:trxID", InvoiceController.PaymentIPN)
router.post("/PaymentIPN/:status/:trxID", InvoiceController.PaymentIPN)
router.get("/PaymentResultRedirect/:status/:trxID", InvoiceController.PaymentResultRedirect)
router.post("/PaymentResultRedirect/:status/:trxID", InvoiceController.PaymentResultRedirect)
router.get("/InvoiceList", AuthVerification, InvoiceController.InvoiceList)
router.post("/InvoiceProductList", AuthVerification, InvoiceController.InvoiceProductList)

// Features API
router.get("/FeaturesList", FeaturesController.FeaturesList)

export default router;



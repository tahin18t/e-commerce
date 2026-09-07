import axios from 'axios'

//const baseURL = "https://e-commerce-jzm6.onrender.com/api/v1"
// const baseURL = "https://e-commerce18t.onrender.com/api/v1"
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1"
const inFlightRequests = new Map()
const responseCache = new Map()

const axiosConfig = (headers = null) => ({
  ...(headers ? { headers } : {}),
  withCredentials: true,
})

async function get(URL, headers = null, cacheMs = 0) {
  const requestKey = `GET:${URL}:${JSON.stringify(headers || {})}`
  const cached = responseCache.get(requestKey)
  if (cacheMs && cached && cached.expiresAt > Date.now()) return cached.data
  if (inFlightRequests.has(requestKey)) return inFlightRequests.get(requestKey)

  const request = (async () => {
  try {
    const config = axiosConfig(headers)
    let res = await axios.get(URL, config);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("Something Went Wrong")
      return null;
    }
  } catch (err) {
    console.log("Something Went Wrong", err)
    return { status: "error", message: err.response?.data?.message || err.message };
  }
  })()

  inFlightRequests.set(requestKey, request)
  try {
    const data = await request
    if (cacheMs && data !== null) responseCache.set(requestKey, { data, expiresAt: Date.now() + cacheMs })
    return data
  } finally {
    inFlightRequests.delete(requestKey)
  }
}
async function post(URL, Body = {}, headers = null, cacheMs = 0) {
  const requestKey = `POST:${URL}:${JSON.stringify(Body)}:${JSON.stringify(headers || {})}`
  const cached = responseCache.get(requestKey)
  if (cacheMs && cached && cached.expiresAt > Date.now()) return cached.data
  if (inFlightRequests.has(requestKey)) return inFlightRequests.get(requestKey)

  const request = (async () => {
  try {
    const config = axiosConfig(headers)
    let res = await axios.post(URL, Body, config);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("Something Went Wrong")
      return false;
    }
  } catch (err) {
    console.log("Something Went Wrong", err)
    return { status: "error", message: err.response?.data?.message || err.message };
  }
  })()

  inFlightRequests.set(requestKey, request)
  try {
    const data = await request
    if (cacheMs && data !== false) responseCache.set(requestKey, { data, expiresAt: Date.now() + cacheMs })
    return data
  } finally {
    inFlightRequests.delete(requestKey)
  }
}

// Product API
export function ProductSliderList() {
  let URL = baseURL + "/ProductSliderList";
  return get(URL, null, 1000)
}
export function ProductBrandList() {
  let URL = baseURL + "/ProductBrandList"
  return get(URL, null, 1000)
}
export function ProductListByBrand(brandID) {
  let URL = baseURL + "/ProductListByBrand/" + brandID;
  return get(URL)
}
export function ProductCategoryList() {
  let URL = baseURL + "/ProductCategoryList"
  return get(URL, null, 1000)
}
export function ProductListByCategory(CategoryID) {
  let URL = baseURL + "/ProductListByCategory/" + CategoryID;
  return get(URL)
}
export function ProductDetails(ProductID) {
  let URL = baseURL + "/ProductDetails/" + ProductID;
  return get(URL)
}
export function ProductReviewList(ProductID) {
  let URL = baseURL + "/ProductReviewList/" + ProductID
  return get(URL)
}
export function ProductSearch(keyword) {
  let URL = baseURL + "/ProductListByKeyword/" + encodeURIComponent(keyword);
  return get(URL)
}
export function ProductListBySimilar(CategoryID) {
  let URL = baseURL + "/ProductListBySimilar/" + CategoryID
  return get(URL)
}
export function ProductListByRemark(remark) {
  let URL = baseURL + "/ProductListByRemark/" + encodeURIComponent(remark)
  return get(URL)
}
export function ProductListByFilter(FilterData={}) {
  let URL = baseURL + "/ProductListByFilter"
  return post(URL, FilterData, null, 500)
  /**
   * @FilterData = {
    "key1": "Value1",
    "Key2": "Value2"
  }
   */
}

// User API
export function checkToken() {
  let URL = baseURL + "/checkToken"
  return get(URL)
}

export function LoginRequest(email) {
  let URL = baseURL + "/LoginRequest/" + encodeURIComponent(email)
  return get(URL)
  /**
   @return 
   */
}
export function VerifyLogin(email, otp) {
  let URL = baseURL + "/VerifyLogin/" + encodeURIComponent(email) + "/" + encodeURIComponent(otp)
  return get(URL)
}
export function ReadProfile() {
  let URL = baseURL + "/ReadProfile"
  return get(URL)
}
export function UpdateProfile(user) {
  let URL = baseURL + "/UpdateProfile";
  return post(URL, user)
  /**
  @user = {
    "cus_add": "Cox's Bazar",
    "cus_city": "Moheskhali",
    "cus_country": "Dhaka",
    "cus_fax": "01812345678",
    "cus_name": "aaaa",
    "cus_phone": "01512345678",
    "cus_postcode": "1234",
    "cus_state": "Dhaka",
    "ship_add": "Dhaka",
    "ship_city": "Moheskhali",
    "ship_country": "Bangladesh",
    "ship_name": "aaaa",
    "ship_phone": "01512345678",
    "ship_postcode": "1234",
    "ship_state": "Dhaka",
    "updateAt": "2023-09-20",
    "createdAt": "2023-09-06"
  }*/
}
export function CreateReview(review) {
  let URL = baseURL + "/CreateReview"
  return post(URL, review)
  /**
   * @review{
      "productID":"68c1287c63b1bde145d716c7",
      "des":"This product is too good. i love it <3",
      "rating":"4.5"
    }
   */
}
export function UserLogout() {
  let URL = baseURL + "/UserLogout"
  return get(URL)
}

// Wish API
export function WishList() {
  let URL = baseURL + "/WishList"
  return get(URL)
}
export function AddToWishList(ProductID) {
  let URL = baseURL + "/AddToWishList/" + ProductID
  return post(URL, null)
}
export function RemoveFromWishList(ProductID) {
  let URL = baseURL + "/RemoveFromWishList/" + ProductID
  return get(URL)
}

// Cart API
export function CartList() {
  let URL = baseURL + "/CartList"
  return get(URL)
}
export function AddToCart(product) {
  let URL = baseURL + "/AddToCart"
  return post(URL, product)
  /**
    @product={
      "productID": "68c1287c63b1bde145d716c7",
      "color":"blue",
      "qty":2,
      "size":"latge"
    }
   */
}

export function UpdateCartQuantity(productID, qty, color = "red", size = "l") {
  let URL = baseURL + "/AddToCart"
  return post(URL, { productID, qty: String(qty), color, size })
}
export function RemoveFromCart(ProductID) {
  let URL = baseURL + "/RemoveFromCart/" + ProductID
  return get(URL)
}

// Invoice API
export function CreateInvoice() {
  let URL = baseURL + "/CreateInvoice"
  return get(URL)

  /**
   @return {
    "status": "success",
    "data": {
        "status": "SUCCESS",
        "failedreason": "",
        "sessionkey": "6D15CACAE4778ABF1BC2DF15C5840B92",
        "gw": {
            "visa": "city_visa,ebl_visa,visacard",
            "master": "city_master,ebl_master,mastercard",
            "amex": "city_amex,amexcard",
            "othercards": "qcash,fastcash",
            "internetbanking": "city,bankasia,ibbl,mtbl",
            "mobilebanking": "dbblmobilebanking,bkash,abbank,ibbl"
        },
        "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtml.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=",
        "directPaymentURLBank": "",
        "directPaymentURLCard": "",
        "directPaymentURL": "",
        "redirectGatewayURLFailed": "",
        "GatewayPageURL": "https://sandbox.sslcommerz.com/gwprocess/v3/gw.php?Q=PAY&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92",
        "storeBanner": "",
        "storeLogo": "",
        "desc": [
            {
                "name": "AMEX",
                "type": "amex",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/amex.png",
                "gw": "amexcard",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=amexcard"
            },
            {
                "name": "VISA",
                "type": "visa",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/visa.png",
                "gw": "visacard",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=visavard"
            },
            {
                "name": "MASTER",
                "type": "master",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/master.png",
                "gw": "mastercard",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=mastercard"
            },
            {
                "name": "AMEX-City Bank",
                "type": "amex",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/amex.png",
                "gw": "city_amex",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=city_amex"
            },
            {
                "name": "QCash",
                "type": "othercards",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/qcash.png",
                "gw": "qcash",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=qcash"
            },
            {
                "name": "Fast Cash",
                "type": "othercards",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/fastcash.png",
                "gw": "fastcash"
            },
            {
                "name": "BKash",
                "type": "mobilebanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/bkash.png",
                "gw": "bkash",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=bkash"
            },
            {
                "name": "DBBL Mobile Banking",
                "type": "mobilebanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/dbblmobilebank.png",
                "gw": "dbblmobilebanking",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=dbblmobilebanking"
            },
            {
                "name": "AB Direct",
                "type": "mobilebanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/abbank.png",
                "gw": "abbank",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=abbank"
            },
            {
                "name": "IBBL",
                "type": "internetbanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/ibbl.png",
                "gw": "ibbl",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=ibbl"
            },
            {
                "name": "Citytouch",
                "type": "internetbanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/citytouch.png",
                "gw": "city",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=city"
            },
            {
                "name": "MTBL",
                "type": "internetbanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/mtbl.png",
                "gw": "mtbl",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=mtbl"
            },
            {
                "name": "Bank Asia",
                "type": "internetbanking",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/bankasia.png",
                "gw": "bankasia",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=bankasia"
            },
            {
                "name": "VISA-Eastern Bank Limited",
                "type": "visa",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/visa.png",
                "gw": "ebl_visa",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=ebl_visa"
            },
            {
                "name": "MASTER-Eastern Bank Limited",
                "type": "master",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/master.png",
                "gw": "ebl_master",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=ebl_master"
            },
            {
                "name": "VISA-City Bank",
                "type": "visa",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/visa.png",
                "gw": "city_visa",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=city_visa"
            },
            {
                "name": "MASTER-City bank",
                "type": "master",
                "logo": "https://sandbox.sslcommerz.com/gwprocess/v3/image/gw/master.png",
                "gw": "city_master",
                "r_flag": "1",
                "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v3/bankgw/indexhtmlOTP.php?mamount=97650.00&ssl_id=26011231427QnFiHi333n7R2gx&Q=REDIRECT&SESSIONKEY=6D15CACAE4778ABF1BC2DF15C5840B92&tran_type=success&cardname=city_master"
            }
        ],
        "is_direct_pay_enable": "0"
    }
}
   */

}
export function InvoiceList() {
  let URL = baseURL + "/InvoiceList"
  return get(URL)
}
export function InvoiceProductList(invoiceID){
  let URL = baseURL+"/InvoiceProductList"
  return post(URL, {invoiceID})
}
export function InvoiceDetail(invoiceID) {
  let URL = baseURL + `/InvoiceDetail/${invoiceID}`
  return get(URL)
}
export function InvoiceDetailByTrx(trxID) {
  let URL = baseURL + `/InvoiceDetailByTrx/${trxID}`
  return get(URL)
}
export function InvoiceDownload(invoiceID) {
  return `${baseURL}/InvoiceDownload/${invoiceID}`
}
// 5 more api are here

// Feature List
export function FeaturesList() {
  let URL = baseURL + "/FeaturesList"
  return get(URL)
  // This is no complete yet
  /**
   @return {
    "status": "success",
      "data": [
        {
          "_id": "68bfd09b597dbdffc75d50fe",
          "name": "Secure Payment",
          "description": "100% secure Payment",
          "img": "https://share.google/images/vFFBG0greyhO8IUFJ"
        },
        {
          "_id": "68bfcfe3597dbdffc75d50fa",
          "name": "Free Dalivery",
          "description": "For all order over 99$",
          "img": "https://share.google/images/kAv7qEYNSPMua5GRz"
        },
        {
          "_id": "68bfd042597dbdffc75d50fc",
          "name": "90 Days Return",
          "description": "If goods have a problem",
          "img": "https://share.google/images/waR2Vl1I2MLbnBEtM"
        }
      ]
    }
   */
}

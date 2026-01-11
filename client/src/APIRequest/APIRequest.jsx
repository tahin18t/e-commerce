import axios from 'axios'

//const baseURL = "https://e-commerce-jzm6.onrender.com/api/v1"
const baseURL = "http://localhost:5020/api/v1"

async function get(URL, headers = null) {
  try {
    console.log(headers)
    const config = headers ? { headers } : {}
    let res = await axios.get(URL, config);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("Something Went Wrong")
      return null;
    }
  } catch (err) {
    console.log("Something Went Wrong", err)
    return null;
  }
}
async function post(URL, Body = {}, headers = null) {
  try {
    const config = headers ? { headers } : {}
    let res = await axios.post(URL, Body, config);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("Something Went Wrong")
      return false;
    }
  } catch (err) {
    console.log("Something Went Wrong", err)
    return false;
  }
}

// Product API
export function ProductSliderList() {
  let URL = baseURL + "/ProductSliderList";
  return get(URL)
}
export function ProductBrandList() {
  let URL = baseURL + "/ProductBrandList"
  return get(URL)
}
export function ProductListByBrand(brandID) {
  let URL = baseURL + "/ProductListByBrand/" + brandID;
  return get(URL)
}
export function ProductCategoryList() {
  let URL = baseURL + "/ProductCategoryList"
  return get(URL)
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
  let URL = baseURL + "/ProductListByKeyword/" + keyword;
  return get(URL)
}
export function ProductListBySimilar(CategoryID) {
  let URL = baseURL + "/ProductListBySimilar/" + CategoryID
  return get(URL)
}
export function ProductListByRemark(remark) {
  let URL = baseURL + "/ProductListByRemark/" + remark
}
export function ProductListByFilter(FilterData={}) {
  let URL = baseURL + "/ProductListByFilter"
  return post(URL, FilterData)
  /**
   * @FilterData = {
    "key1": "Value1",
    "Key2": "Value2"
  }
   */
}

// User API
export function checkToken(token) {
  let URL = baseURL + "/checkToken"
  console.log(URL, token)
  return get(URL, {token})
}

export function LoginRequest(email) {
  let URL = baseURL + "/LoginRequest/" + email
  console.log(URL)
  return get(URL)
  /**
   @return 
   */
}
export function VerifyLogin(email, otp) {
  let URL = baseURL + "/VerifyLogin/" + email + "/" + otp
  console.log(URL)
  return get(URL)
}
export function ReadProfile(token) {
  let URL = baseURL + "/ReadProfile"
  return get(URL, { token })
}
export function UpdateProfile(user, token) {
  let URL = baseURL + "/UpdateProfile";
  return post(URL, user, { token })
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
export function CreateReview(review, token) {
  let URL = baseURL + "/CreateReview"
  return post(URL, review, { token })
  /**
   * @review{
      "productID":"68c1287c63b1bde145d716c7",
      "des":"This product is too good. i love it <3",
      "rating":"4.5"
    }
   */
}
export function UserLogout(token) {
  let URL = baseURL + "/UserLogout"
  return get(URL, { token })
}

// Wish API
export function WishList(token) {
  let URL = baseURL + "/WishList"
  return get(URL, { token })
}
export function AddToWishList(ProductID, token) {
  let URL = baseURL + "/AddToWishList/" + ProductID
  return post(URL, null, { token })
}
export function RemoveFromWishList(ProductID, token) {
  let URL = baseURL + "/RemoveFromWishList/" + ProductID
  return get(URL, { token })
}

// Cart API
export function CartList(token) {
  let URL = baseURL + "/CartList"
  return get(URL, { token })
}
export function AddToCart(product, token) {
  let URL = baseURL + "/AddToCart"
  return post(URL, product, { token })
  /**
    @product={
      "productID": "68c1287c63b1bde145d716c7",
      "color":"blue",
      "qty":2,
      "size":"latge"
    }
   */
}
export function RemoveFromCart(ProductID, token) {
  let URL = baseURL + "/RemoveFromCart/" + ProductID
  return get(URL, { token })
}

// Invoice API
export function CreatInvoice(token) {
  let URL = baseURL + "/CreatInvoice"
  return get(URL, { token })
}
export function InvoiceList(token) {
  let URL = baseURL + "/InvoiceList"
  return get(URL, { token })
}
// 5 more api are here

// Feature List
export function FeaturesList(ProductID, token) {
  let URL = baseURL + "/FeaturesList/" + ProductID
  return get(URL, { token })
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
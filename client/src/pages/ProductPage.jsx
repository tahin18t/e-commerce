import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ProductDetails, ProductReviewList, ProductListBySimilar, CreateReview } from '../APIRequest/APIRequest'
import ProductList from '../components/ProductList'

const ProductPage = () => {

  let { productID } = useParams()
  let [product, setProduct] = useState()
  let [reviews, setReviews] = useState([])
  let [similarProducts, setSimilarProducts] = useState([])
  useEffect(() => {

    (async () => {

      let data = await ProductDetails(productID)
      if (data && Array.isArray(data)) {
        setProduct(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setProduct(data.data[0]);
      }

      data = await ProductReviewList(productID)
      data = data.data ? data.data : data
      setReviews(data)

    })()

  }, [productID])

  useEffect(() => {
    if (product && product.category) {
      (async () => {
        let similarData = await ProductListBySimilar(product.category._id)
        if (similarData && similarData.data) {
          setSimilarProducts(similarData.data)
        }
      })()
    }
  }, [product])

  if (!product) {
    return <div className="flex justify-center items-center h-screen bg-base-100 text-base-content">Loading...</div>
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4 bg-base-100 text-base-content min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex justify-center items-center border-2 mr-5">
            <img
              src={product.image}
              alt={product.title}
              className="rounded-lg shadow-lg object-cover w-100 h-120"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-700 mb-4">{product.shortDes}</p>
            <p className="text-lg mb-2"><strong>Price:</strong> <span className="text-green-600 font-semibold">${product.discountPrice}</span> <del className="text-gray-500">${product.price}</del></p>
            <p className="mb-2"><strong>Rating:</strong> {product.star} stars</p>
            <p className="mb-2"><strong>Stock:</strong> {product.stock}</p>
            <p className="mb-2"><strong>Remark:</strong> {product.remark}</p>
            <p className="mb-2"><strong>Brand:</strong> {product.brand.brandName}</p>
            <p className="mb-4"><strong>Category:</strong> {product.category.categoryName}</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add to Cart</button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <p className="text-gray-700 mb-4">{product.details.des}</p>
          <p className="mb-2"><strong>Color:</strong> {product.details.color}</p>
          <p className="mb-4"><strong>Size:</strong> {product.details.size}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[product.details.img1, product.details.img2, product.details.img3, product.details.img4, product.details.img5, product.details.img6, product.details.img7, product.details.img8].map((img, index) => (
              img && <img key={index} src={img} alt={`Detail ${index + 1}`} className="w-full h-32 object-cover rounded shadow" />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{review.userName || 'Anonymous'}</span>
                  <span className="text-yellow-500">
                    {'★'.repeat(Math.floor(review.rating))}{'☆'.repeat(5 - Math.floor(review.rating))}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">{review.rating}</span>
                </div>
                <p className="text-gray-700">{review.des}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
          <ProductList products={similarProducts} />
        </div>
      </div>

    </>
  )
}

export default ProductPage


// value of product/data
// {
//       "_id": "68c1009e0d62fc2e3166f983",
//       "title": "Realme GT 5",
//       "shortDes": "The Realme GT5 is a remarkable addition to the smartphone market, boasting an array of features that cater to tech enthusiasts looking for power and performance. Launched in September 2023, this device is powered by the robust Snapdragon 8 Gen 2 chipset and runs on Android 13, complemented by Realme UI 4.0. Its sleek design is encapsulated in a glass front and aluminum frame, with a glass back adding to its premium feel. The GT5’s display is a stunning 6.74-inch AMOLED screen, offering a resolution of 1240x2772 pixels, which brings visuals to life with vibrant colors and sharp details.",
//       "price": "75000.00",
//       "discountPrice": "00",
//       "image": "https://share.google/images/fM4jgVOQKlIMuIGpf",
//       "star": "4.3",
//       "stock": "7",
//       "remark": "New",
//       "details": {
//           "img1": "https://share.google/images/8rwrHZBYniRu8NRYH",
//           "img2": "https://share.google/images/6XmGUVPgmBYZY3luu",
//           "img3": "https://share.google/images/pNZbdyDisfvI9nigy",
//           "img4": "https://share.google/images/EbfxIHuv6UbeIAUAt",
//           "img5": "https://share.google/images/bndaDVxrOpAI4BETb",
//           "img6": "https://share.google/images/4y06Ouv4MYNW9JGEM",
//           "img7": "https://share.google/images/Wr9v5P647susVZLhD",
//           "img8": "https://share.google/images/1dSlIByE98eyyN8GN",
//           "des": "The Realme GT5 is a remarkable addition to the smartphone market, boasting an array of features that cater to tech enthusiasts looking for power and performance. Launched in September 2023, this device is powered by the robust Snapdragon 8 Gen 2 chipset and runs on Android 13, complemented by Realme UI 4.0. Its sleek design is encapsulated in a glass front and aluminum frame, with a glass back adding to its premium feel. The GT5’s display is a stunning 6.74-inch AMOLED screen, offering a resolution of 1240x2772 pixels, which brings visuals to life with vibrant colors and sharp details.",
//           "color": "Silver, Olivs",
//           "size": "5\" x 3\""
//       },
//       "brand": {
//           "brandName": "Realme",
//           "brandImg": "https://share.google/images/qLTHybjJyxHoOYK9Y",
//           "createdAt": 1,
//           "updatedAt": 1
//       },
//       "category": {
//           "categoryName": "Android",
//           "categoryImg": "https://images.seeklogo.com/logo-png/30/1/android-icon-logo-png_seeklogo-306470.png",
//           "createdAt": 1,
//           "updatedAt": 1
//       }
//   }
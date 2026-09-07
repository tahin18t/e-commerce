import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ProductDetails, ProductListBySimilar, AddToCart, checkToken } from '../APIRequest/APIRequest'
import ProductList from '../components/ProductList'
import ProductReview from '../components/ProductReview'
import Layout from '../layout/Layout'
import toast from 'react-hot-toast';

const ProductPage = () => {

  let { productID } = useParams()
  let [product, setProduct] = useState()
  let [similarProducts, setSimilarProducts] = useState([])
  let [selectedImage, setSelectedImage] = useState('')
  useEffect(() => {

    (async () => {

      let data = await ProductDetails(productID);
      let productData;
      if (data && Array.isArray(data)) {
        productData = data[0];
      } else if (data && data.data) {
        productData = Array.isArray(data.data) ? data.data[0] : data.data;
      } else {
        productData = data;
      }
      setProduct(productData);
      setSelectedImage(productData?.image || '')

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

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    ;(async () => {
      const auth = await checkToken();
      setIsAuthenticated(Boolean(auth?.validation));
    })();
  }, []);

  const addToCart = async (productID, title) => {
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    let product = { productID, qty: 1, color: "red", size: "l" };
    let res = await AddToCart(product);
    if (res) {
      toast.success(`${title} added to cart`);
    } else {
      toast.error("Failed to add to cart");
    }
  };

  if (!product) {
    return <div className="flex justify-center items-center h-screen bg-base-100 text-base-content">Loading...</div>
  }

  const details = product.details || {}
  const galleryImages = [product.image, details.img1, details.img2, details.img3, details.img4, details.img5, details.img6, details.img7, details.img8]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index)

  return (
    <Layout>
      <main className="min-h-screen bg-base-100 text-base-content">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-base-content/60">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span>{product.category?.categoryName || 'Product'}</span>
            <span>/</span>
            <span className="text-base-content">{product.title}</span>
          </div>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-12">
            <div className="relative grid self-start gap-4 sm:grid-cols-[88px_minmax(0,1fr)]">
              <div className="hide-scrollbar order-2 flex max-w-full min-h-0 gap-2 overflow-x-auto overflow-y-hidden pb-1 sm:absolute sm:inset-y-0 sm:left-0 sm:order-1 sm:w-[88px] sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0 sm:pr-1">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-base-200 transition sm:h-[76px] sm:w-[76px] ${selectedImage === image ? 'border-primary ring-2 ring-primary/20' : 'border-base-300 hover:border-primary/50'}`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="order-1 flex aspect-square max-h-[620px] items-center justify-center overflow-hidden rounded-3xl border border-base-300 bg-base-200 p-5 sm:col-start-2 sm:order-2 sm:p-8">
                <img src={selectedImage || product.image} alt={product.title} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </div>
            </div>

            <div className="flex self-start flex-col justify-start">
              <div className="mb-4 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{product.remark || 'New'}</span>
                <span className="text-amber-500">★ {product.star || '0.0'}</span>
                <span className="text-base-content/60">{product.stock} in stock</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>
              <div className="mt-7 flex items-end gap-3 border-b border-base-300 pb-7">
                <span className="text-3xl font-bold text-primary">${product.discountPrice && product.discountPrice !== '00' && product.discountPrice !== 0 ? product.discountPrice : product.price}</span>
                {product.discountPrice && product.discountPrice !== '00' && product.discountPrice !== 0 && <del className="pb-1 text-base text-base-content/50">${product.price}</del>}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-base-200 p-4"><span className="block text-base-content/50">Brand</span><strong>{product.brand?.brandName || 'N/A'}</strong></div>
                <div className="rounded-xl bg-base-200 p-4"><span className="block text-base-content/50">Category</span><strong>{product.category?.categoryName || 'N/A'}</strong></div>
                <div className="rounded-xl bg-base-200 p-4"><span className="block text-base-content/50">Color</span><strong>{details.color || 'N/A'}</strong></div>
                <div className="rounded-xl bg-base-200 p-4"><span className="block text-base-content/50">Size</span><strong>{details.size || 'N/A'}</strong></div>
              </div>

              <button className="mt-7 w-full rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-content transition hover:brightness-110" onClick={() => addToCart(product._id, product.title)}>
                Add to Cart
              </button>
            </div>
          </section>

          <section className="mt-14 grid gap-8 border-t border-base-300 pt-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.5fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Product information</p>
              <h2 className="mt-2 text-2xl font-bold">Details</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-base-content/75">{details.des || product.shortDes || 'No additional details are available for this product.'}</p>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-200 p-5">
              <h3 className="font-semibold">At a glance</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-base-content/60">Availability</dt><dd className="font-medium">{Number(product.stock) > 0 ? 'In stock' : 'Sold out'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-base-content/60">Rating</dt><dd className="font-medium">{product.star || '0.0'} / 5</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-base-content/60">Product type</dt><dd className="font-medium">{product.remark || 'Standard'}</dd></div>
              </dl>
            </div>
          </section>

          <ProductReview productID={productID} />

          <section className="mt-14 border-t border-base-300 pt-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">You may also like</p>
                <h2 className="mt-2 text-2xl font-bold">Similar products</h2>
              </div>
            </div>
            <ProductList products={similarProducts} compact />
          </section>
        </div>
      </main>
    </Layout>
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
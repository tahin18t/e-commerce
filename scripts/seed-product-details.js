import dotenv from "dotenv"
import mongoose from "mongoose"
import ProductModel from "../src/models/ProductModel.js"
import ProductDetailModel from "../src/models/ProductDetailModel.js"

dotenv.config()

const mongoUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=PersonalProject`

async function seedProductDetails() {
  await mongoose.connect(mongoUrl)

  const products = await ProductModel.find({}, {
    _id: 1,
    image: 1,
    shortDes: 1,
  }).lean()

  let created = 0
  let existing = 0

  for (const product of products) {
    const detail = await ProductDetailModel.findOneAndUpdate(
      { productID: product._id },
      {
        $setOnInsert: {
          img1: product.image,
          img2: product.image,
          img3: product.image,
          img4: product.image,
          des: product.shortDes || "Product details are not available yet.",
          color: "Standard",
          size: "Standard",
          productID: product._id,
        },
      },
      { upsert: true, new: false, setDefaultsOnInsert: true }
    )

    if (detail) existing += 1
    else created += 1
  }

  console.log(`Product details seed complete: ${created} created, ${existing} already existed.`)
}

seedProductDetails()
  .catch((error) => {
    console.error("Product details seed failed:", error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })

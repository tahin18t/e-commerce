import mongoose from 'mongoose'
const DataSchema = new mongoose.Schema({
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }

    },
    { timestamps: true, versionKey: false }

)
// Compound unique index
DataSchema.index({productID: 1, userID: 1 }, { unique: true });


const WishModel = mongoose.model('wishes', DataSchema)
export default WishModel
import mongoose from 'mongoose'
const DataSchema = new mongoose.Schema({
        mame: {type: String, required: true},
        description: {type: String, required: true},
        img: {type: String, required: true}
    },
    { timestamps: true, versionKey: false }

)

const FeatureModel = mongoose.model('features', DataSchema)
export default FeatureModel
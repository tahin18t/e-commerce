import mongoose from 'mongoose'
const DataSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true, lowercase: true},
    otp: {type: String},
    googleId: {type: String},
    provider: {type: String}
},
    { timestamps: true, versionKey: false }

)

const UserModel = mongoose.model('users', DataSchema)
export default UserModel
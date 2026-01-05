import EmailSend from "../utility/EmailHelper.js";
import {EncodeToken, DecodeToken} from "../utility/TokenHelper.js";
import UserModel from "../models/UserModel.js";
import ProfileModel from "../models/ProfileModel.js";
import ReviewModel from "../models/ReviewModel.js";

export async function UserOTPService(req) {

    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);
        let EmailText = `Your Verification Code is: ${code}\n`
        let EmailSubject = "Verification Code"
        await EmailSend(email, EmailText, EmailSubject);
        await UserModel.updateOne(
            {email: email},
            {$set:{otp:code}},
            {upsert: true}
        )
        return {status: "success", data: "6 Digit OTP Has Been Send"}
    }
    catch(error){
        return {status:"error", message:error.message}
    }
}

export async function VerifyOTPService(req) {
    try {
        let email = req.params.email;
        let otp = req.params.otp;
        let data = await UserModel.findOne({email:email, otp:otp})
        let result;
        if(!data) {
            result = "OTP verification failed"
            return {status: "failed", data: result}
        }
        else {
            await UserModel.updateOne({email:email}, {$set:{otp:null}})
            let userID = data._id.toString()
            let token = EncodeToken(email, userID)
            result = "OTP verification successful"
            return {status: "success", data: result, token:token}
        }

    }
    catch(error){
        return {status:"error", message:error.message}
    }
}

export async function UpdateProfileService(req) {
    try {
        let userID = req.headers.user_id
        let reqBody = req.body
        reqBody.userID = userID;
        await ProfileModel.updateOne(
            {userID:reqBody.userID},
            {$set:reqBody},
            {upsert: true}
        )
        return {status: "success", data: "Profile Save Success"}
    }
    catch(error){
        return {status:"error", message:error.message}
    }
}

export async function ReadProfileService(req) {
    try {
        let data = await ProfileModel.findOne(
            {userID:req.headers.user_id}
        )
        return {status: "success", data: data}
    }
    catch(error){
        return {status:"error", message:error.message}
    }
}

export async function CreateReviewService(req){
    try {
        let reqBody = req.body;
        reqBody.userID = req.headers.user_id;
        let data = await ReviewModel.create(reqBody)
        return {status: "success", data: data}
    }
    catch(error){
        return {status:"error", message:error.message}
    }
}
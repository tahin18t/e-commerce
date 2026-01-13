import {
    UserOTPService,
    VerifyOTPService,
    UpdateProfileService,
    ReadProfileService,
    CreateReviewService
} from "../services/UserServices.js"

export async function UserOTP(req, res) {
    let result = await UserOTPService(req)
    return res.status(200).json(result)
}

export async function VerifyLogin(req, res) {
    console.log("From VerifyLogin "+ req.params.email + " " +req.params.otp)
    let result = await VerifyOTPService(req)
    console.log("From VerifyLogin " + result)
    if (result.status === "success") {

        // Set Cookie
        let cookieOptions = {
            expires: new Date(Date.now()+24*60*60*1000),
            httpOnly: true,
        }
        res.cookie('token', result.token, cookieOptions)
    }
    return res.status(200).json(result)
}

export async function UserLogout(req, res) {
    let cookieOptions = {
        expires: new Date(Date.now()-24*60*60*1000),
        httpOnly: true,
    }
    res.cookie('token', "", cookieOptions)
    return res.status(200).json({status: "Logout Successful"})
}

export async function UpdateProfile(req, res) {
    let result = await UpdateProfileService(req)
    return res.status(200).json(result)
}

export async function ReadProfile(req, res) {
    let result = await ReadProfileService(req)
    return res.status(200).json(result)
}

export async function CreateReview(req, res) {
    let result = await CreateReviewService(req)
    return res.status(200).json(result)
}
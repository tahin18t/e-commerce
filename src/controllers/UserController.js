import {
    UserOTPService,
    VerifyOTPService,
    UpdateProfileService,
    ReadProfileService,
    CreateReviewService
} from "../services/UserServices.js"

// The Vercel frontend and Render API use different origins.  In production the
// auth cookie must explicitly allow cross-origin requests, otherwise browsers
// will store it but omit it from requests such as /checkToken.
const authCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge,
})

export async function UserOTP(req, res) {
    let result = await UserOTPService(req)
    console.log(result)
    return res.status(200).json(result)
}

export async function VerifyLogin(req, res) {
    let result = await VerifyOTPService(req)
    if (result.status === "success") {

        // Set Cookie
        res.cookie('token', result.token, authCookieOptions(24 * 60 * 60 * 1000))
    }
    return res.status(200).json(result)
}

export async function UserLogout(req, res) {
    res.cookie('token', "", authCookieOptions(0))
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

import EmailSend from "../utility/EmailHelper.js";
import { EncodeToken, DecodeToken } from "../utility/TokenHelper.js";
import UserModel from "../models/UserModel.js";
import ProfileModel from "../models/ProfileModel.js";
import ReviewModel from "../models/ReviewModel.js";

export async function UserOTPService(req) {

    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);
        let EmailText = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f7fa;
      padding: 20px;
    }
    .container {
      max-width: 420px;
      background: #ffffff;
      margin: auto;
      padding: 22px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .header {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      color: #2d3748;
    }
    .otp-box {
      background: #edf2f7;
      padding: 14px;
      text-align: center;
      border-radius: 8px;
      margin: 18px 0;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #1a202c;
      animation: pulseGlow 1.5s infinite alternate;
    }
    @keyframes pulseGlow {
      from { text-shadow: 0 0 6px rgba(49,130,206,0.3); transform: scale(1); }
      to { text-shadow: 0 0 14px rgba(49,130,206,0.7); transform: scale(1.05); }
    }
    .info {
      font-size: 15px;
      color: #4a5568;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 18px;
    }
    .btn {
      display: block;
      width: 100%;
      background: #3182ce;
      color: #fff;
      padding: 12px;
      text-align: center;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: 0.3s;
      animation: btnBounce 0.6s ease;
    }
    @keyframes btnBounce {
      0% { transform: scale(0.9); }
      60% { transform: scale(1.04); }
      100% { transform: scale(1); }
    }
    .btn:hover {
      background: #2b6cb0;
    }
    .contact {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 14px;
      color: #2d3748;
    }
    .link {
      color: #3182ce;
      text-decoration: none;
      font-weight: 600;
    }
    .footer {
      margin-top: 22px;
      font-size: 13px;
      text-align: center;
      color: #718096;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">E-commerce OTP Verification</div>

    <div class="otp-box">
      <div class="otp">${code}</div>
    </div>

    <div class="info">
      Use this code to verify your login request.<br>
      This OTP is valid for a short time. Do not share it with anyone.
    </div>

    <a class="btn">Verify Now</a>

    <div class="contact">
      <p><strong>Need help?</strong></p>
      <p>Email: <a class="link" href="mailto:tahin18t@gmail.com">tahin18t@gmail.com</a></p>
      <p>Website: <a class="link" href="https://sites.google.com/diu.edu.bd/tahin1383/home">Visit Website</a></p>
    </div>

    <div class="footer">
      Developed by <strong>Shahriar Sakhawat Tahin</strong><br>
      © 2026 E-commerce OTP System
    </div>
  </div>
</body>
</html>
`;


        let EmailSubject = "E-commerce Verification Code"
        await EmailSend(email, EmailText, EmailSubject);
        await UserModel.updateOne(
            { email: email },
            { $set: { otp: code } },
            { upsert: true }
        )
        return { status: "success", data: "6 Digit OTP Has Been Send" }
    }
    catch (error) {
        return { status: "error", message: error.message }
    }
}

export async function VerifyOTPService(req) {
    try {
        let email = req.params.email;
        let otp = req.params.otp;
        let data = await UserModel.findOne({ email: email, otp: otp })
        let result;
        if (!data) {
            result = "OTP verification failed"
            return { status: "failed", data: result }
        }
        else {
            await UserModel.updateOne({ email: email }, { $set: { otp: null } })

            let userID = data._id.toString()
            let token = EncodeToken(email, userID)
            result = "OTP verification successful"
            return { status: "success", data: result, token: token }
        }

    }
    catch (error) {
        return { status: "error", message: error.message }
    }
}

export async function UpdateProfileService(req) {
    try {
        let userID = req.headers.user_id
        let reqBody = req.body
        reqBody.userID = userID;
        await ProfileModel.updateOne(
            { userID: reqBody.userID },
            { $set: reqBody },
            { upsert: true }
        )
        return { status: "success", data: "Profile Save Success" }
    }
    catch (error) {
        return { status: "error", message: error.message }
    }
}

export async function ReadProfileService(req) {
    try {
        let data = await ProfileModel.findOne(
            { userID: req.headers.user_id }
        )
        return { status: "success", data: data }
    }
    catch (error) {
        return { status: "error", message: error.message }
    }
}

export async function CreateReviewService(req) {
    try {
        let reqBody = req.body;
        reqBody.userID = req.headers.user_id;
        let data = await ReviewModel.create(reqBody)
        return { status: "success", data: data }
    }
    catch (error) {
        return { status: "error", message: error.message }
    }
}
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LoginRequest, VerifyLogin } from "../APIRequest/APIRequest"
import { setCookie, readCookie } from "../helper/cookie"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    setOtp("")
    if (!email) return toast.error("Enter email first!");

    setLoading(true);
    try {
      const res = await LoginRequest(email)
      console.log("Login request Response: " + res)
      if (res.status === 200) toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error("Failed to send OTP");
      console.error(err);
    }
    setLoading(false);
  };

  const verifyLogin = async () => {
    if (!email || !otp) return toast.error("Fill all fields!");

    const res = await VerifyLogin(email, otp);
    console.log("VerifyLogin response:", res);

    if (res.status === "success") {
      toast.success("Login successful!");
      setCookie("token", res.token, 7)

      navigate("/");
    } else {
      toast.error("OTP verification failed!");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-base-200">
      <div className="w-[900px] max-w-full flex shadow-xl rounded-2xl overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 bg-base-100 flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-4">Sign in to your account</h2>

          {/* EMAIL + OTP BUTTON */}
          <div className="flex items-center w-full gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOTP}
              className="btn btn-accent whitespace-nowrap"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {/* OTP INPUT */}
          <input
            type="text"
            placeholder="Enter OTP"
            className="input input-bordered w-full mt-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {/* LOGIN BUTTON */}
          <button onClick={verifyLogin} className="btn btn-primary w-full mt-6">
            Login / Register
          </button>

          {/* OR CONTINUE WITH */}
          <div className="divider my-6">Or continue with</div>

          {/* SOCIAL LOGIN */}
          <div className="flex gap-4 w-full justify-center">
            <button className="btn btn-outline flex items-center gap-2">
              <FcGoogle size={22} /> Google
            </button>
            <button className="btn btn-outline flex items-center gap-2">
              <FaFacebook size={22} className="text-blue-600" /> Facebook
            </button>
          </div>
        </div>

        {/* RIGHT SECTION (IMAGE SIDE) */}
        <div className="w-1/2 sm:hidden lg:flex">
          <img
            src="/mnt/data/31805291-5240-4910-a622-e1b0ee80e676.png"
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

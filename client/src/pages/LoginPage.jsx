import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LoginRequest, VerifyLogin } from "../APIRequest/APIRequest"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    setOtp("")
    setGeneratedOtp("")
    setEmailSent(false)
    if (!email) return toast.error("Enter email first!");

    setLoading(true);
    try {
      const res = await LoginRequest(email)
      if (res && res.status === "success") {
        setGeneratedOtp(res.data?.otp || "")
        setEmailSent(res.data?.emailSent === true)
        toast.success(res.data?.emailSent ? "OTP sent successfully!" : "OTP generated for this showcase");
      } else {
        toast.error(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(`Failed to send OTP: ${err.message}`);
    }
    setLoading(false);
  };

  const verifyLogin = async () => {
    if (!email || !otp) return toast.error("Fill all fields!");

    const res = await VerifyLogin(email, otp);

    if (res?.status === "success") {
      toast.success("Login successful!");
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
            <button
              onClick={() => window.location.href = '/api/v1/auth/google'}
              className="btn btn-outline flex items-center gap-2"
            >
              <FcGoogle size={22} /> Google
            </button>
            <button 
              onClick={() => window.location.href = '/api/v1/auth/facebook'}
              className="btn btn-outline flex items-center gap-2">
              <FaFacebook size={22} className="text-blue-600" /> Facebook
            </button>
          </div>
        </div>

        {/* RIGHT SECTION (SHOWCASE OTP) */}
        <div className="hidden lg:flex w-1/2 bg-neutral text-neutral-content p-10 flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Demo access</p>
          <h3 className="text-3xl font-bold mt-3">Your verification code</h3>
          <p className="mt-3 text-neutral-content/70">
            Request an OTP and use the code shown here to complete the showcase login.
          </p>
          <div className="mt-8 rounded-xl bg-neutral-content/10 border border-neutral-content/20 p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-neutral-content/60">One-time password</p>
            <p className="text-4xl font-mono font-bold tracking-[0.35em] mt-3 min-h-12">
              {generatedOtp || "------"}
            </p>
            <p className="text-sm mt-4 text-neutral-content/70">
              {generatedOtp
                ? emailSent
                  ? "The code was also sent to your email."
                  : "Email delivery is unavailable, so use this showcase code."
                : "The code will appear after you request it."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

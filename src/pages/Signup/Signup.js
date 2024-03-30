import React, { useState } from "react";
import {
  FacebookRounded,
  Google,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full flex flex-row items-center relative">
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div className="border border-gray-400 rounded-xl px-8 py-12 space-y-6 shadow-xl w-2/5">
          <h1 className="text-black text-2xl">Welcome!</h1>
          <div className="flex flex-col space-y-1">
            <p>Email</p>
            <input
              required
              type="email"
              placeholder="Enter your Email"
              className="border border-gray-400 rounded-md py-3 px-3"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <p>Username</p>
            <input
              required
              placeholder="Enter your Username"
              className="border border-gray-400 rounded-md py-3 px-3"
            />
          </div>
          <div className="flex flex-col space-y-1 relative">
            <p>Password</p>
            <div className="border border-gray-400 rounded-md p-3 flex items-center">
              <input
                required
                placeholder="Enter your password"
                className="w-full outline-none"
                type={showPassword ? "text" : "password"}
              />
              <div
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1 relative">
            <p>Confirm Password</p>
            <div className="border border-gray-400 rounded-md p-3 flex items-center">
              <input
                required
                placeholder="Confirm your password"
                className="w-full outline-none"
                type={showConfirmPassword ? "text" : "password"}
              />
              <div
                className="cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
          </div>
          <button className="bg-black text-white w-full rounded-lg p-2 transition duration-300 ease-in-out hover:bg-gray-800 transform hover:scale-105">
            Signup
          </button>
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-black">
              Login
            </Link>
          </p>
          <hr className="w-full border-black" />
          <p className="text-center text-gray-500">Or continue with</p>
          <div className="flex flex-row space-x-2 justify-center">
            <Google fontSize="large" />
            <FacebookRounded fontSize="large" />
          </div>
        </div>
      </div>
      <div className="flex relative justify-center items-center h-screen">
        <div className=" absolute text-gradient-signup text-9xl font-bold -rotate-90 tracking-widest">
          SIGNUP
        </div>
      </div>
      <div className="w-1/2 h-screen bg-black flex justify-center items-center">
        <div className="flex flex-col space-y-2 ">
          <h1 className="text-white text-6xl ">LOGO</h1>
          <hr className="w-full border-white" />
          <p className="text-white text-6xl">
            “The future of
            <br /> security In Algeria”
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

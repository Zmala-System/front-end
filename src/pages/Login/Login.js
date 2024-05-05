import React, { useState } from "react";
import {
  FacebookRounded,
  Google,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./login.css";
import { LOGIN_MUTATION } from "../../GraphQL/mutations";
import { useMutation } from "@apollo/client";

function Login() {
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAdminInput, setLoginAdminInput] = useState({
    email: "",
    password: "",
  });
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    variables: {
      loginAdminInput,
    },
    onCompleted: (data) => {
      const token = data?.loginAdmin?.token;
      const username = data?.loginAdmin?.username;
      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "/";
      } else {
        console.error("Login successful, but no token received.");
      }
    },
  });
  const [loginError, setLoginError] = useState(null);

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!isEmailValid(email)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    try {
      const { data } = await login({
        variables: {
          loginAdminInput: {
            email,
            password,
          },
        },
      });
      console.log("Login successful:", data);
    } catch (error) {
      setLoginError("Invalid email or password.");
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="w-full flex flex-row items-center relative login">
      <div className="w-1/2 h-screen bg-black flex justify-center items-center">
        <div className="flex flex-col space-y-2 ">
          <h1 className="text-white text-6xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
            Zmala System
          </h1>
          <hr className="w-full border-white" />
          <p className="text-white text-6xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
            “The future of
            <br /> security In Algeria”
          </p>
        </div>
      </div>

      <div className="flex relative justify-center items-center h-screen">
        <div className=" absolute text-gradient text-9xl font-bold -rotate-90 tracking-widest">
          LOGIN
        </div>
      </div>
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div className="border border-gray-400 rounded-xl px-8 py-12 space-y-6 shadow-xl w-2/5">
          <h1 className="text-black text-2xl">Welcome!</h1>
          <div className="flex flex-col space-y-1">
            <p>Email</p>
            <input
              placeholder="Enter your Email"
              className="border border-gray-400 rounded-md py-3 px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <p>Password</p>
            <div className="border border-gray-400 rounded-md p-3 flex items-center">
              <input
                required
                placeholder="Enter your password"
                className="w-full outline-none"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <p className="text-center text-gray-500">Forgot Password?</p>
          <button
            className="bg-black text-white w-full rounded-lg p-2 transition duration-300 ease-in-out hover:bg-gray-800 transform hover:scale-105"
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

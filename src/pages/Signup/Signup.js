import React, { useState } from "react";
import {
  FacebookRounded,
  Google,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Signup.css";
import { REGISTER_MUTATION } from "../../GraphQL/mutations";
import { useMutation } from "@apollo/client";

function Signup() {
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerAdminInput, setRegisterAdminInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION, {
    variables: {
      registerAdminInput,
    },
    onCompleted: (data) => {
      const token = data?.registerAdmin?.token;
      const username = data?.registerAdmin?.username;
      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "/login";
      } else {
        console.error("Signup successful, but no token received.");
      }
    },
  });

  const [emailError, setEmailError] = useState(null);

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!username || !email || !password || !registerAdminInput.confirmPassword) {
      console.error("All fields are required.");
      return;
    }
    console.log(password);
    console.log(registerAdminInput.confirmPassword)

    try {
      // Create a copy of registerAdminInput to avoid immediate state update issue
      const updatedRegisterAdminInput = {
        username,
        email,
        password,
        confirmPassword: registerAdminInput.confirmPassword, // Update this line
      };
      console.log(updatedRegisterAdminInput);
      setRegisterAdminInput(updatedRegisterAdminInput); // Update state after creating the copy
  
      const { data } = await register();
      console.log("Signup successful:", data);
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  };

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
    <div className="w-full flex flex-row items-center relative signup">
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div className="border border-gray-400 rounded-xl px-8 py-12 space-y-6 shadow-xl w-[clamp(200px,60%,400px)]">
          <h1 className="text-black text-2xl">Welcome!</h1>
          <div className="flex flex-col space-y-1">
            <p>Email</p>
            <input
              required
              type="email"
              placeholder="Enter your Email"
              className="border border-gray-400 rounded-md py-3 px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isEmailValid(email) && <p className="text-red-500 text-sm">Please enter a valid email address.</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <p>Username</p>
            <input
              required
              placeholder="Enter your Username"
              className="border border-gray-400 rounded-md py-3 px-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="flex flex-col space-y-1 relative">
            <p>Confirm Password</p>
            <div className="border border-gray-400 rounded-md p-3 flex items-center">
              <input
                required
                placeholder="Confirm your password"
                className="w-full outline-none"
                type={showConfirmPassword ? "text" : "password"}
                value={registerAdminInput.confirmPassword}
                onChange={(e) =>
                  setRegisterAdminInput({
                    ...registerAdminInput,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div
                className="cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
          </div>
          <button
            className="bg-black text-white w-full rounded-lg p-2 transition duration-300 ease-in-out hover:bg-gray-800 transform hover:scale-105"
            onClick={handleSignup}
            disabled={!username || !email || !password || !registerAdminInput.confirmPassword}
          >
            Signup
          </button>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-black">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="flex relative justify-center items-center h-screen">
        <div className=" absolute text-gradient-signup text-9xl font-bold -rotate-90 tracking-widest">
          SIGNUP
        </div>
      </div>
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

    </div>
  );
}

export default Signup;

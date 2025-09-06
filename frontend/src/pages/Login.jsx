import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  function isValidEmail(email) {
    // Simple regex for validation
    return /\S+@\S+\.\S+/.test(email);
  }

  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function login() {
    console.log("Logging in...");
    setLoading(true);
    setLoginMessage("");
    // Check email format
    if (!isValidEmail(email)) {
      setLoginMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setLoginMessage("Logged In successfully!");
        setEmail("");
        setPassword("");
        navigate("/books");
      }
    } catch (error) {
      console.log(`Error:- ${error}`);
      if (error.response) {
        // Server responded with a status other than 2xx
        setLoginMessage(error.response.data.message || "Something went wrong");
      } else if (error.request) {
        // Request was made but no response
        setLoginMessage("No response from server. Please try again.");
      } else {
        // Error setting up the request
        setLoginMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center h-dvh'>
        <p className='text-4xl mb-15'>Login</p>
        <span className='flex flex-col mb-5'>
          <label htmlFor="email" className='text-lg mb-1 self-start justify-center'>Email</label>
          <input type="text" value={email} id='email' onChange={(e) => setEmail(e.target.value)} className='p-3 w-100 border-2 rounded-2xl h-8' />
        </span>
        <span className='flex flex-col mb-5'>
          <label htmlFor="password" className='text-lg mb-1 self-start justify-center'>Password</label>
          <input type="password" value={password} id='password' onChange={(e) => setPassword(e.target.value)} className='p-3 w-100 border-2 rounded-2xl h-8' />
        </span>
        <button onClick={() => login()} className='bg-amber-500 rounded-2xl mb-10 h-10 p-6 cursor-pointer flex justify-center items-center'>
          {loading ? "Logging In..." : "Login"}
        </button>
        <div className='flex'>
          <p className='mr-2'>Don't have an account?</p>
          <Link to={'/signup'} className='text-blue-400'>
            Signup
          </Link>
        </div>
        <p className='mt-2 text-lg text-red-400'>{loginMessage}</p>
      </div>
    </>
  )
}

export default Login
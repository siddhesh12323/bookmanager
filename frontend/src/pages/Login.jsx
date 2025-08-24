import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  // set on login
  // localStorage.setItem("token", response.data.token);

  // send token on protected routes
  // const token = localStorage.getItem("token");
  // const response = await axios.get("http://localhost:5555/users/me", {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // });

  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  async function login() {
    console.log("Logging in...");
    setLoading(true);
    setLoginMessage("");
    console.log("Before try catch...");
    try {
      console.log("Inside try catch...");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        'username': username,
        'password': password
      });
      if (response.status === 200) {
        setLoginMessage("Logged In successfully!");
        setUsername("");
        setPassword("");
        localStorage.setItem("token", response.data.token);
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
        <p className='text-4xl mb-15'>Create an Account</p>
        <span className='flex flex-col mb-5'>
          <label htmlFor="username" className='text-lg mb-1 self-start justify-center'>Username</label>
          <input type="text" value={username} id='username' onChange={(e) => setUsername(e.target.value)} className='p-3 w-100 border-2 rounded-2xl h-8' />
        </span>
        <span className='flex flex-col mb-5'>
          <label htmlFor="password" className='text-lg mb-1 self-start justify-center'>Password</label>
          <input type="password" value={password} id='password' onChange={(e) => setPassword(e.target.value)} className='p-3 w-100 border-2 rounded-2xl h-8' />
        </span>
        <button onClick={() => login()} className='bg-amber-500 rounded-2xl mb-10 h-10 p-6 cursor-pointer flex justify-center items-center'>
          {loading ? "Logging In..." : "Login"}
        </button>
        <p className='text-lg'>{loginMessage}</p>
      </div>
    </>
  )
}

export default Login
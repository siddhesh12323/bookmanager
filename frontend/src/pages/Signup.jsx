import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [signupMessage, setSignupMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    async function signup() {
        console.log("Signing up...");
        setLoading(true);
        setSignupMessage("");
        console.log("Before try catch...");
        try {
            console.log("Inside try catch...");
            if (password != confirmPassword) {
                throw new Error("Password and Confirm Passwords are not the same");
            }
            console.log("Passwords same...");
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
                'username': username,
                'password': password
            });
            if (response.status === 201) {
                setSignupMessage("Account created successfully!");
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                localStorage.setItem("token", response.data.token);
                navigate("/books");
            }
        } catch (error) {
            console.log(`Error:- ${error}`);
            if (error.response) {
                // Server responded with a status other than 2xx
                setSignupMessage(error.response.data.message || "Something went wrong");
            } else if (error.request) {
                // Request was made but no response
                setSignupMessage("No response from server. Please try again.");
            } else {
                // Error setting up the request
                setSignupMessage(error.message);
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
                <span className='flex flex-col mb-15'>
                    <label htmlFor="confirm-password" className='text-lg mb-1 self-start justify-center'>Confirm Password</label>
                    <input type="password" value={confirmPassword} id='confirm-password' onChange={(e) => setConfirmPassword(e.target.value)} className='p-3 w-100 border-2 rounded-2xl h-8' />
                </span>
                <button onClick={() => signup()} className='bg-amber-500 rounded-2xl mb-10 h-10 p-6 cursor-pointer flex justify-center items-center'>
                    {loading ? "Creating..." : "Create"}
                </button>
                <div className='flex'>
                    <p className='mr-2'>Already have an account?</p>
                    <Link to={'/login'} className='text-blue-400'>
                        Login
                    </Link>
                </div>
                <p className='text-lg'>{signupMessage}</p>
            </div>
        </>
    )
}

export default Signup
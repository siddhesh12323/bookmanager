import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';


const Onboarding = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/me`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    navigate("/books");
                }
            } catch (error) {
                console.error("Error checking auth:", error);
            }
        }

        checkAuth();
    }, [navigate]);


    return (
        <div className="flex flex-col justify-center items-center h-dvh">
            <div className='mb-4 text-3xl text-pink-400'>
                <p>BookManager - Manage your books!</p>
            </div>
            <div>
                <span>Already have an account?  </span>
                <span className='text-blue-500 cursor-pointer'>
                    <Link to={'/login'}>
                        Login
                    </Link>
                </span>
            </div>
            <div className='mb-4'>
                <span>Don't have an account?  </span>
                <span className='text-blue-500 cursor-pointer'>
                    <Link to={'/signup'}>
                        Signup
                    </Link>
                </span>
            </div>
            {showToast && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
                    Please login or signup to continue.
                </div>
            )}
        </div>
    );
};

export default Onboarding
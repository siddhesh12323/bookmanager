import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton'
import { BookInfoCard } from '../components/BookInfoCard';
import { Link } from 'react-router-dom';

const ShowBook = () => {
  const { id } = useParams();
  console.log(`Params:- ${id}`);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const token = localStorage.getItem("token");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      if (!token) {
        setSuccessMessage("❌ You must be logged in to create a book.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`, {
          withCredentials: true
        });

        console.log(`response 1:- ${response.data.data}`);
        console.log(`response 2:- ${response.data}`);
        setBook(response.data.data);
      } catch (error) {
        console.log("Axios error:", error);

        if (error.response) {
          setSuccessMessage(`❌ ${error.response.data.message || "Something went wrong"} (Code: ${error.response.status})`);
        } else if (error.request) {
          setSuccessMessage("❌ No response from server. Please try again.");
        } else {
          setSuccessMessage(`❌ ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, token]);

  let content;

  if (loading) {
    <>
      <BackButton></BackButton>
      <Spinner></Spinner>
    </>
  } else {
    if (successMessage === "") {
      content = <>
        <BackButton></BackButton>
        {BookInfoCard(book)}
      </>
    } else {
      content = <div className='ml-6 mr-6 mt-6 flex flex-col text-xl text-red-500'>
        {successMessage}
        <Link to="/login" className="w-fit mt-3">
          <div className="text-white pl-4 pr-4 pt-2 pb-2 w-fit rounded-2xl bg-green-500">
            Login
          </div>
        </Link>
      </div>
    }
  }

  return (
    <div >
      {content}
    </div>
  )
}

export default ShowBook
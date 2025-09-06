import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md'

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/books/`,
          { withCredentials: true }
        );

        console.log(`response 1:- ${response.data.data}`);
        console.log(`response 2:- ${response.data}`);
        setBooks(response.data.data);
      } catch (error) {
        console.log("Axios error:", error);

        if (error.response) {
          setLoadingMessage(`❌ ${error.response.data.message || "Something went wrong"} (Code: ${error.response.status})`);
        } else if (error.request) {
          setLoadingMessage("❌ No response from server. Please try again.");
        } else {
          setLoadingMessage(`❌ ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  let content;

  if (loading) {
    content = <Spinner></Spinner>;
  } else {
    if (loadingMessage === "") {
      content = <div className='p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl my-8'>Books List</h1>
          <Link to='/books/create'>
            <MdOutlineAddBox className='text-sky-700 text-4xl'></MdOutlineAddBox>
          </Link>
        </div>
        {

          <table className='w-full border-separate border-spacing-2'>
            <thead>
              <tr>
                <th className='border border-slate-600 rounded-md'>No.</th>
                <th className='border border-slate-600 rounded-md'>Title</th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>Author</th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>Publish Year</th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>Operations</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book._id} className='h-8'>
                  <td className='border border-slate-700 rounded-md text-center'>
                    {index + 1}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center'>
                    {book.title}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                    {book.author}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                    {book.publishedYear}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center'>
                    <div className='flex justify-center gap-x-4'>
                      <Link to={`/books/details/${book._id}`}>
                        <BsInfoCircle className='text-2xl text-green-800'></BsInfoCircle>
                      </Link>
                      <Link to={`/books/edit/${book._id}`}>
                        <AiOutlineEdit className='text-2xl text-yellow-600'></AiOutlineEdit>
                      </Link>
                      <Link to={`/books/delete/${book._id}`}>
                        <MdOutlineDelete className='text-2xl text-red-600'></MdOutlineDelete>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        }
      </div>
    } else {
      // oh no, we have some error
      content = <div className='ml-6 mr-6 mt-6 flex flex-col text-xl text-red-500'>
        {loadingMessage}
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

export default Home
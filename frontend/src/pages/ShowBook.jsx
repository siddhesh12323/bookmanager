import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton'

const ShowBook = () => {
  const { id } = useParams();
  console.log(`Params:- ${id}`);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(`response 1:- ${response.data.data}`);
      console.log(`response 2:- ${response.data}`)
      setBook(response.data.data);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    });
  }, [id, token]);
  return (
    <div>
      <BackButton></BackButton>
      {
        loading ? (
          <Spinner></Spinner>
        ) : (
          <div className='ml-6 flex flex-col border-2 rounded-xl w-fit p-3'>
            <span className='text-gray-600'>
              Id
            </span>
            <span className='mb-3 text-2xl font-bold'>
              {book._id}
            </span>
              <span className='text-gray-600'>
              Title
            </span>
              <span className='mb-3 text-2xl font-bold'>
              {book.title}
            </span>
              <span className='text-gray-600'>
              Author
            </span>
              <span className='mb-3 text-2xl font-bold'>
              {book.author}
            </span>
              <span className='text-gray-600'>
                Published Year
              </span>
              <span className='mb-3 text-2xl font-bold'>
                {book.publishedYear}
              </span>
              <span className='text-gray-600'>
                Created At
              </span>
              <span className='text-2xl font-bold'>
                {new Date(book.createdAt).toString()}
              </span>
          </div>
        )
      }
    </div>
  )
}

export default ShowBook
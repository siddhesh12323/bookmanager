import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton'
import { BookInfoCard } from '../components/BookInfoCard';

const ShowBook = () => {
  const { id } = useParams();
  console.log(`Params:- ${id}`);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`, {
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
          BookInfoCard(book)
        )
      }
    </div>
  )
}

export default ShowBook
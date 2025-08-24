import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const EditBook = () => {
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(`response:- ${response.data.data}`);
      console.log(`response title:- ${response.data.data.title}`);
      setAuthor(response.data.data.author);
      setTitle(response.data.data.title);
      setPublishedYear(response.data.data.publishedYear);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      setLoadingMessage(`Error in loading book!`);
      console.log(error);
    });
  }, [id, token])

  async function editbook() {
    setSubmitting(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/books/${id}`, {
        title: title,
        author: author,
        publishedYear: publishedYear
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Response code:- ${response.status}`);
      if (response.status === 200) {
        setSuccessMessage("✅ Book edited successfully!");
      }
    } catch (error) {
      console.log(`Error message:- ${error}`)
    } finally {
      setSubmitting(false);
    }
  }

  let content;
  
  
    if (loading) {
      content = (<Spinner></Spinner>)
    } else {
      if (loadingMessage === "") {
        // no worries
        content = (
          <div className='ml-6 mr-6 flex flex-col'>
            <label htmlFor="title" className='text-gray-500 text-xl'>Title </label>
            <input type="text" name="title" value={title} id="title" onChange={(e) => setTitle(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
            <label htmlFor="author" className='text-gray-500 text-xl'>Author </label>
            <input type="text" name="author" value={author} id="author" onChange={(e) => setAuthor(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
            <label htmlFor="publishedYear" className='text-gray-500 text-xl'>Published Year </label>
            <input type="number" min="1900" value={publishedYear} max="2099" step="1" onChange={(e) => setPublishedYear(e.target.value)} placeholder="YYYY" name="publishedYear" id="publishedYear" className='mt-1 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
            <button type="submit" className='bg-green-500 w-40 mt-3 rounded-2xl h-10' disabled={submitting}
              onClick={editbook}>{submitting ? "Submitting..." : "Edit"}</button>
            {successMessage && (
              <p className="mt-3 text-lg text-left text-green-600">
                {successMessage}
              </p>
            )}
          </div>)
      } else {
        // oh no!
        content = <p>{loadingMessage}</p>
      }
    }

  return (
    <div >
      <BackButton></BackButton>
      {content}
    </div>
  )
}

export default EditBook
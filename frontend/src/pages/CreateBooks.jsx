import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import axios from 'axios';
// import process from 'process'

const CreateBooks = () => {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  async function createbook() {
    setSubmitting(true);
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/books`, {
        'title': title,
        'author': author,
        'publishedYear': publishedYear,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Response code:- ${response.status}`);
      if (response.status === 201) {
        setSuccessMessage("✅ Book created successfully!");
        setTitle("");
        setAuthor("");
        setPublishedYear("");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setSuccessMessage("❌ Failed to create book.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div >
      <BackButton></BackButton>
      <div className='ml-6 mr-6 flex flex-col'>
        <label htmlFor="title" className='text-gray-500 text-xl'>Title </label>
        <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
        <label htmlFor="author" className='text-gray-500 text-xl'>Author </label>
        <input type="text" name="author" id="author" onChange={(e) => setAuthor(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
        <label htmlFor="publishedYear" className='text-gray-500 text-xl'>Published Year </label>
        <input type="number" min="1900" max="2099" step="1" onChange={(e) => setPublishedYear(e.target.value)} placeholder="YYYY" name="publishedYear" id="publishedYear" className='mt-1 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
        <button type="submit" className='bg-green-500 w-40 mt-3 rounded-2xl h-10' disabled={submitting}
          onClick={createbook}>{submitting ? "Submitting..." : "Create"}</button>
        {successMessage && (
          <p className="mt-3 text-lg text-left text-green-600">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  )
}

export default CreateBooks
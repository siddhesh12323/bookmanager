import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { useDropzone } from "react-dropzone";

const EditBook = () => {
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile)); // preview image
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop,
  });

  useEffect(() => {
    setLoading(true);

    axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`, { withCredentials: true }).then((response) => {
      console.log(`response:- ${response.data.data}`);
      console.log(`response title:- ${response.data.data.title}`);
      setAuthor(response.data.data.author);
      setTitle(response.data.data.title);
      setPublishedYear(response.data.data.publishedYear);
      setImage(response.data.data.image)
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      setLoadingMessage(`Error in loading book!`);
      console.log(error);
    });
  }, [id])

  async function editbook() {
    setSubmitting(true);
    setSuccessMessage("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("publishedYear", publishedYear);
      if (file) formData.append("image", file);
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/books/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }, withCredentials: true
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
        <div>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            {/* <img src={image} alt="book image" className='md:order-2 mt-6 md:mb-6 mb-0 md:mr-6 object-contain rounded-xl shadow w-full md:w-auto md:h-full max-w-[200px] md:max-w-[250px]' /> */}
            {/* Drag & Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl md:order-2 mt-6 md:mb-6 mb-0 md:mr-6 cursor-pointer text-center ${isDragActive ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-300"
                }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-xl shadow w-full md:w-auto md:h-full max-w-[200px] md:max-w-[250px]"
                />
              ) : (
                <img src={image} alt="book image" className='rounded-xl shadow w-full md:w-auto md:h-full max-w-[200px] md:max-w-[250px]' />
              )}
            </div>

            <div className='ml-6 mr-6 flex flex-col justify-between items-start'>
              <label htmlFor="title" className='text-gray-500 text-xl'>Title </label>
              <input type="text" name="title" value={title} id="title" onChange={(e) => setTitle(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
              <label htmlFor="author" className='text-gray-500 text-xl'>Author </label>
              <input type="text" name="author" value={author} id="author" onChange={(e) => setAuthor(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
              <label htmlFor="publishedYear" className='text-gray-500 text-xl'>Published Year </label>
              <input type="number" min="1" value={publishedYear} max="2099" step="1" onChange={(e) => setPublishedYear(e.target.value)} placeholder="YYYY" name="publishedYear" id="publishedYear" className='mt-1 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
            </div>
          </div>
          <div className='ml-6 mb-6 flex flex-col'>
            <button type="submit" className='bg-green-500 w-40 mt-3 rounded-2xl h-10 cursor-pointer' disabled={submitting}
              onClick={editbook}>{submitting ? "Submitting..." : "Edit"}</button>
            {successMessage && (
              <p className="mt-3 text-lg text-left text-green-600">
                {successMessage}
              </p>
            )}
          </div>
        </div>
      )
    } else {
      // oh no!
      content = <div className='ml-6 mr-6 flex flex-col text-xl text-red-500'>
        {loadingMessage}
        <Link to="/login" className="w-fit mt-6">
          <div className="text-white pl-4 pr-4 pt-2 pb-2 w-fit rounded-2xl bg-green-500">
            Login
          </div>
        </Link>
      </div>
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
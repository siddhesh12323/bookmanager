import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useDropzone } from "react-dropzone";
import { useEffect } from 'react';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const CreateBooks = () => {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/users/me`, { withCredentials: true })
      .then(() => setLoading(false))
      .catch(() => {
        setLoadingMessage("Please login to create books!");
        setLoading(false);
      });
  }, []);

  async function createbook() {
    setSubmitting(true);
    try {
      const tokenResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, { withCredentials: true }).catch(() => {
        setLoadingMessage("Please login to create books!");
        setSubmitting(false);
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoadingMessage("Please login to create books!");
      setSubmitting(false);
      return;
    }
    setSuccessMessage("");
    try {
      if (!file || !title || !author || !publishedYear) return alert("All fields are required!");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("publishedYear", publishedYear);
      if (file) formData.append("image", file);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/books`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
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

  let content;

  if (loading) {
    content = <Spinner></Spinner>;
  } else {
    if (loadingMessage === "") {
      content = <>

        <BackButton></BackButton>
        <div className='ml-6 mr-6 flex flex-col'>
          <label htmlFor="title" className='text-gray-500 text-xl'>Title </label>
          <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
          <label htmlFor="author" className='text-gray-500 text-xl'>Author </label>
          <input type="text" name="author" id="author" onChange={(e) => setAuthor(e.target.value)} className='mt-1 mb-3 border-2 w-2xl h-10 px-1.5 rounded-2xl' />
          <label htmlFor="publishedYear" className='text-gray-500 text-xl'>Published Year </label>
          <input type="number" min="1" max="2099" step="1" onChange={(e) => setPublishedYear(e.target.value)} placeholder="YYYY" name="publishedYear" id="publishedYear" className='mt-1 border-2 w-2xl h-10 px-1.5 rounded-2xl' />

          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`mt-4 p-6 border-2 border-dashed rounded-xl cursor-pointer text-center mb-4 ${isDragActive ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-300"
              }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-green-600">✅ {file.name} selected</p>
            ) : (
              <p>Drag & drop an image here, or click to browse</p>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div className="mb-4 flex justify-center">
              <img
                src={preview}
                alt="preview"
                className="max-h-48 w-auto rounded-lg shadow"
              />
            </div>
          )}


          <button type="submit" className='bg-green-500 w-40 mt-3 rounded-2xl h-10 cursor-pointer' disabled={submitting}
            onClick={createbook}>{submitting ? "Submitting..." : "Create"}</button>
          {successMessage && (
            <p className="mt-3 text-lg text-left text-green-600">
              {successMessage}
            </p>
          )}
        </div></>
    } else {
      // oh no, we have some error
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

    return (
      <div >
        {content}
      </div>
    )
  }
}

export default CreateBooks
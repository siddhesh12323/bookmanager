import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DeleteBook = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [deletedMessage, setDeletedMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(`response:- ${response.data}`);
      console.log(`response code:- ${response.status}`);
      if (response.status === 200) {
        setBook(response.data.data);
        setLoadingMessage(`Data Loaded!`);
      }
    }).catch((error) => {
      console.log(`Error message:- ${error}`);
      if (error.response) {
        // Server responded with status code out of 2xx
        if (error.response.status === 404) {
          setLoadingMessage("No Book Found with the given ID :(");
        } else {
          setLoadingMessage(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // No response received
        setLoadingMessage("No response from server. Check your connection.");
      } else {
        // Something else went wrong
        setLoadingMessage("Unexpected error occurred.");
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [id, token]);

  const deleteBook = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(`http://localhost:5555/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200) {
        setDeletedMessage(`Book Deleted!`);
      }
    } catch (error) {
      console.log(`Error message:- ${error}`);
      setDeletedMessage(`Couldn't Delete Book!`);
    } finally {
      setDeleting(false);
      setShowPopup(false);
    }
  };

  let content;

  if (loading) {
    content = <Spinner />;
  } else if (
    loadingMessage === "Error in loading data!" ||
    loadingMessage === "No Book Found with the given ID :("
  ) {
    content = <p>{loadingMessage}</p>;
  } else {
    content = (
      <>
        <div className="ml-6 flex flex-col border-2 rounded-xl w-fit p-3">
          <span className="text-gray-600">Id</span>
          <span className="mb-3 text-2xl font-bold">{book._id}</span>

          <span className="text-gray-600">Title</span>
          <span className="mb-3 text-2xl font-bold">{book.title}</span>

          <span className="text-gray-600">Author</span>
          <span className="mb-3 text-2xl font-bold">{book.author}</span>

          <span className="text-gray-600">Published Year</span>
          <span className="mb-3 text-2xl font-bold">{book.publishedYear}</span>

          <span className="text-gray-600">Created At</span>
          <span className="text-2xl font-bold">
            {new Date(book.createdAt).toString()}
          </span>
        </div>

        <div>
          <button
            className="ml-6 mt-4 bg-red-500 w-30 h-10 rounded-2xl mr-1.5"
            onClick={() => setShowPopup(true)}
          >
            Delete
          </button>
        </div>

        <div>
          <p className='ml-6 mt-4 text-green-500'>{deletedMessage}</p>
        </div>

        {/* Popup */}
        {showPopup && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              <h2 className="text-2xl mb-3 font-semibold">Confirm Deletion</h2>
              <p className="text-xl mb-5">
                Do you confirm to Delete this Book?
              </p>
              <div className="flex justify-end mt-5">
                <button
                  className="bg-red-500 w-20 rounded-2xl mr-1.5"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 w-20 rounded-2xl"
                  onClick={deleteBook}
                >
                  {deleting ? "Deleting..." : "Yes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <BackButton />
      {content}
    </div>
  );

}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "300px",
  },
};

export default DeleteBook
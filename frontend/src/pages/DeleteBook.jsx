import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookInfoCard } from '../components/BookInfoCard';

const DeleteBook = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [deletedMessage, setDeletedMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`, {
      withCredentials: true
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
  }, [id]);

  const deleteBook = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/books/${id}`, {
        withCredentials: true
      });
      if (response.status === 200) {
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
    content = <>
      <BackButton />
      <Spinner />
    </>;
  } else if (
    loadingMessage === "Error in loading data!" ||
    loadingMessage === "No Book Found with the given ID :("
  ) {
    content = <>
      <BackButton />
      <p>{loadingMessage}</p>
    </>
  } else if (loadingMessage === "Please login to delete books!") {
    // oh no, we have some error
    content = <div className='ml-6 mr-6 mt-6 flex flex-col text-xl text-red-500'>
      {loadingMessage}
      <Link to="/login" className="w-fit mt-3">
        <div className="text-white pl-4 pr-4 pt-2 pb-2 w-fit rounded-2xl bg-green-500">
          Login
        </div>
      </Link>
    </div>
  } else {
    content = (
      <>
        <BackButton />
        {BookInfoCard(book)}
        <div>
          <button
            className="ml-6 mt-4 bg-red-500 w-30 h-10 rounded-2xl mr-1.5 cursor-pointer"
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
                  className="bg-green-500 w-20 text-white rounded-2xl mr-1.5 cursor-pointer"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white w-20 rounded-2xl cursor-pointer"
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
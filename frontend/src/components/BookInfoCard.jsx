import React from 'react'

export const BookInfoCard = (book) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center m-6 border-2 rounded-lg">
            {/* Image first on mobile, right on desktop */}
            <img
                src={book.image}
                alt="book image"
                className="w-full md:w-auto md:h-full max-w-[200px] md:max-w-[250px] object-contain rounded-xl shadow md:order-2 mt-6 md:mb-6 mb-0 md:mr-6"
            />

            {/* Info section */}
            <div className="ml-0 md:ml-6 flex flex-col rounded-xl w-full md:w-fit p-3">
                <span className="text-gray-600">Id</span>
                <span className="mb-3 text-2xl font-bold">{book._id}</span>

                <span className="text-gray-600">Title</span>
                <span className="mb-3 text-2xl font-bold">{book.title}</span>

                <span className="text-gray-600">Author</span>
                <span className="mb-3 text-2xl font-bold">{book.author}</span>

                <span className="text-gray-600">Published Year</span>
                <span className="mb-3 text-2xl font-bold">{book.publishedYear}</span>

                <span className="text-gray-600">Created At</span>
                <span className="text-2xl font-bold">{new Date(book.createdAt).toString()}</span>
            </div>
        </div>
    )
}

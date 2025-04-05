import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { addBook, deleteBook, fetchBooks, getBook, updateBook } from "../api/ProjectsAPI";
import Pagination from "../components/Pagination";
import BookForm from "../components/BookForm";
import "./AdminBookPage.css";

const AdminBookPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBooks(pageSize, currentPage, []);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      setBooks(data.books);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [pageSize, currentPage]);

  const handleAddClick = () => {
    setSelectedBook(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = async (bookId: number) => {
    try {
      const book = await getBook(bookId);
      setSelectedBook(book);
      setIsEditing(true);
      setShowForm(true);
    } catch (error) {
      console.error(`Error getting book with ID ${bookId}:`, error);
    }
  };

  const handleDeleteClick = (bookId: number) => {
    setConfirmDelete(bookId);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete === null) return;

    try {
      await deleteBook(confirmDelete);
      await loadBooks();
    } catch (error) {
      console.error(`Error deleting book with ID ${confirmDelete}:`, error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = async (bookData: Omit<Book, 'bookID'> | Book) => {
    try {
      if (isEditing && 'bookID' in bookData) {
        await updateBook(bookData as Book);
      } else {
        await addBook(bookData as Omit<Book, 'bookID'>);
      }
      setShowForm(false);
      await loadBooks();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedBook(null);
  };

  if (isLoading && books.length === 0) return <p className="loading">Loading books...</p>;

  return (
    <div className="admin-book-page">
      <header className="admin-header">
        <h1>Admin - Books</h1>
        <div className="admin-actions">
          <button className="add-book-btn" onClick={handleAddClick}>
            Add New Book
          </button>
        </div>
      </header>

      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.bookID}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(book.bookID)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(book.bookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />

      {showForm && (
        <BookForm
          book={selectedBook || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isEditing={isEditing}
        />
      )}

      {confirmDelete !== null && (
        <div className="confirm-delete-overlay">
          <div className="confirm-delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="confirm-actions">
              <button
                className="confirm-btn"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookPage;
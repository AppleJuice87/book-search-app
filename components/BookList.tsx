import { useState } from 'react';
import React, { ChangeEvent } from 'react';
import { Book } from '../types/book';
import axios from 'axios';

interface BookListProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  isAdmin: boolean;
  searchTerm: string;
}

export default function BookList({ books, setBooks, isAdmin, searchTerm }: BookListProps) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState<Omit<Book, 'id'>>({ title: '', shelfNumber: 1 });

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = async (bookId: number) => {
    try {
      const response = await axios.delete(`/api/books/${bookId}`);
      if (response.status === 200) {
        setBooks(books.filter(book => book.id !== bookId));
        setEditingBook(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`책 삭제에 실패했습니다: ${error.response.data.message}`);
      } else {
        alert('책 삭제에 실패했습니다. 네트워크 연결을 확인해주세요.');
      }
    }
  };

  const handleSave = async (updatedBook: Book) => {
    try {
      const response = await axios.put(`/api/books/${updatedBook.id}`, updatedBook);
      if (response.status === 200) {
        const updatedBooks = books.map(book => 
          book.id === updatedBook.id ? updatedBook : book
        );
        setBooks(updatedBooks);
        setEditingBook(null);
      }
    } catch (error) {
      console.error('Error updating book:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`책 정보 업데이트에 실패했습니다: ${error.response.data.message}`);
      } else {
        alert('책 정보 업데이트에 실패했습니다. 네트워크 연결을 확인해주세요.');
      }
    }
  };

  const handleAddBook = async (newBook: Book) => {
    try {
      const response = await axios.post('/api/books', newBook);
      if (response.status === 201) {
        setBooks([...books, response.data]);
        setIsAddingBook(false);
        setNewBook({ title: '', shelfNumber: 1 });
      }
    } catch (error) {
      console.error('Error adding book:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`책 추가에 실패했습니다: ${error.response.data.message}`);
      } else {
        alert('책 추가에 실패했습니다. 네트워크 연결을 확인해주세요.');
      }
    }
  };

  return (
    <ul className="mt-4">
      {books.map((book) => (
        <li key={book.id} className="mb-2 p-2 border rounded bg-gray-100 text-black">
          {editingBook?.id === book.id ? (
            <BookEditForm book={book} onSave={handleSave} onCancel={() => setEditingBook(null)} onDelete={handleDelete} />
          ) : (
            <>
              <HighlightedText text={book.title} highlight={searchTerm} /> (책장 번호: {book.shelfNumber})
              {isAdmin && (
                <div className="mt-2">
                  <button onClick={() => handleEdit(book)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">수정</button>
                </div>
              )}
            </>
          )}
        </li>
      ))}
      {isAdmin && searchTerm.trim() && (
        <li className="mb-2 p-2 border rounded bg-gray-100 text-black">
          {isAddingBook ? (
            <BookEditForm
              book={{ id: 0, title: searchTerm.trim(), shelfNumber: 1 }}
              onSave={handleAddBook}
              onCancel={() => setIsAddingBook(false)}
            />
          ) : (
            <>
              <p>"{searchTerm.trim()}" 라는 제목의 책을 추가하시겠습니까?</p>
              <button
                onClick={() => setIsAddingBook(true)}
                className="mt-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                추가
              </button>
            </>
          )}
        </li>
      )}
    </ul>
  );
}

interface BookEditFormProps {
  book: Book;
  onSave: (updatedBook: Book) => void;
  onCancel: () => void;
  onDelete?: (bookId: number) => void;
}

function BookEditForm({ book, onSave, onCancel, onDelete }: BookEditFormProps) {
  const [editedBook, setEditedBook] = useState<Book>(book);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'shelfNumber' ? parseInt(e.target.value) : e.target.value;
    setEditedBook({ ...editedBook, [e.target.name]: value });
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleDeleteConfirm = () => {
    onDelete && onDelete(book.id);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave(editedBook);
    }}>
      <input
        type="text"
        name="title"
        value={editedBook.title}
        onChange={handleChange}
        className="w-full p-1 mb-2 border rounded"
      />
      <input
        type="number"
        name="shelfNumber"
        value={editedBook.shelfNumber}
        onChange={handleChange}
        className="w-full p-1 mb-2 border rounded"
      />
      <div className="flex justify-between">
        <div>
          <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded mr-2">저장</button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-2 py-1 rounded">취소</button>
        </div>
        {onDelete && !isDeleting && (
          <button type="button" onClick={handleDeleteClick} className="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
        )}
      </div>
      {isDeleting && (
        <div className="mt-2">
          <p>"{editedBook.title}" 항목을 삭제하시겠습니까?</p>
          <button type="button" onClick={handleDeleteConfirm} className="bg-red-500 text-white px-2 py-1 rounded mr-2">확인</button>
          <button type="button" onClick={handleDeleteCancel} className="bg-gray-500 text-white px-2 py-1 rounded">취소</button>
        </div>
      )}
    </form>
  );
}

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const characters = highlight.replace(/\s/g, '').split('').map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${characters})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

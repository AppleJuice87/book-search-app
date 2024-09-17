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

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = (bookId: number) => {
    // 삭제 로직 구현
    console.log(`책 ID ${bookId} 삭제`);
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

  return (
    <ul className="mt-4">
      {books.map((book) => (
        <li key={book.id} className="mb-2 p-2 border rounded bg-gray-100 text-black">
          {editingBook?.id === book.id ? (
            <BookEditForm book={book} onSave={handleSave} />
          ) : (
            <>
              <HighlightedText text={book.title} highlight={searchTerm} /> (책장 번호: {book.shelfNumber})
              {isAdmin && (
                <div className="mt-2">
                  <button onClick={() => handleEdit(book)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">수정</button>
                  <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

interface BookEditFormProps {
  book: Book;
  onSave: (updatedBook: Book) => void;
}

function BookEditForm({ book, onSave }: BookEditFormProps) {
  const [editedBook, setEditedBook] = useState<Book>(book);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'shelfNumber' ? parseInt(e.target.value) : e.target.value;
    setEditedBook({ ...editedBook, [e.target.name]: value });
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
      <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">저장</button>
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

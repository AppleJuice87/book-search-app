"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './BookList';
import AdminPanel from './AdminPanel';
import { Book } from '../types/book';

export default function BookSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const searchBooks = async () => {
      if (searchTerm.trim().length > 0) {
        try {
          const response = await axios.get(`/api/search?q=${searchTerm}`);
          setBooks(response.data);
        } catch (error) {
          console.error('Error searching books:', error);
          setBooks([]);
        }
      } else {
        setBooks([]);
      }
    };

    const debounceTimer = setTimeout(searchBooks, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="책 제목을 입력하세요"
        className="w-full p-2 border rounded text-black"
      />
      <BookList books={books} setBooks={setBooks} isAdmin={isAdmin} searchTerm={searchTerm} />
      <AdminPanel isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    </div>
  );
}

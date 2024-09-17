import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (typeof q !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '2004Mujin^^my',
    database: 'book_search_db',
  });

  try {
    const searchTerms = q.split('').join('%');
    const [rows] = await connection.execute(
      'SELECT * FROM books WHERE title LIKE ?',
      [`%${searchTerms}%`]
    );
    res.status(200).json(rows);
  } catch (error: unknown) {
    console.error('Database error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error searching books', details: error.message });
    } else {
      res.status(500).json({ error: 'Error searching books', details: 'Unknown error' });
    }
  } finally {
    await connection.end();
  }
}

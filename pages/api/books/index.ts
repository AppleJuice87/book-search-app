import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, shelfNumber } = req.body;

  if (!title || !shelfNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [result] = await connection.execute(
      'INSERT INTO books (title, shelfNumber) VALUES (?, ?)',
      [title, shelfNumber]
    );

    if ('insertId' in result) {
      const newBook = {
        id: result.insertId,
        title,
        shelfNumber,
      };
      res.status(201).json(newBook);
    } else {
      throw new Error('Failed to insert book');
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error adding book' });
  } finally {
    await connection.end();
  }
}
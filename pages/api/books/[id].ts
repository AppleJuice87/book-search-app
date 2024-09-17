import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { title, shelfNumber } = req.body;

  if (!id || !title || !shelfNumber) {
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
    await connection.execute(
      'UPDATE books SET title = ?, shelfNumber = ? WHERE id = ?',
      [title, shelfNumber, id]
    );
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating book' });
  } finally {
    await connection.end();
  }
}

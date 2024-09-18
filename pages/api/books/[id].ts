import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    if (req.method === 'PUT') {
      const { title, shelfNumber } = req.body;

      if (!id || !title || !shelfNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      await connection.execute(
        'UPDATE books SET title = ?, shelfNumber = ? WHERE id = ?',
        [title, shelfNumber, id]
      );
      res.status(200).json({ message: 'Book updated successfully' });
    } else if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ message: 'Missing book id' });
      }

      await connection.execute('DELETE FROM books WHERE id = ?', [id]);
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error processing request' });
  } finally {
    await connection.end();
  }
}

import fs from 'fs';
import mysql, { Pool, PoolOptions, ResultSetHeader } from 'mysql2/promise';
import { Record } from './entities/Record';

// Database connection details
const dbConfig: PoolOptions = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'valorant',
};

// Create a connection pool
const pool: Pool = mysql.createPool(dbConfig);

// Read JSON file
const data: Buffer = fs.readFileSync('./src/agents.json');
const records: Record[] = JSON.parse(data.toString());

// Insert records into database
async function insertRecords(): Promise<void> {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to database.');

    const insertQuery =
      'INSERT INTO agents (field1, field2, field3, field4) VALUES ?';
    const values = records.map((record) => [
      record.field1,
      record.field2,
      record.field3,
      record.field4,
    ]);

    const [rows] = await connection.query<ResultSetHeader>(insertQuery, [
      values,
    ]);

    console.log('Inserted', rows.affectedRows, 'records into database.');
  } catch (error) {
    console.error('Error inserting records:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Disconnected from database.');
    }
  }
}

insertRecords();

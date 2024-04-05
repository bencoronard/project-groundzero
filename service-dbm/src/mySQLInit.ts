import * as fs from 'fs';
import * as mysql from 'mysql2/promise';

import { IRecord } from './entities/Record';

// Database connection details
const dbConfig: mysql.PoolOptions = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'valorant',
};

// Create a connection pool
const pool: mysql.Pool = mysql.createPool(dbConfig);

// Read JSON file
const data: Buffer = fs.readFileSync('./src/agents.json');
const records: IRecord[] = JSON.parse(data.toString());

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

    const result = await connection.query(insertQuery, [values]);
    const rows = result[0] as mysql.ResultSetHeader;

    console.log('Inserted', rows.affectedRows, 'records into database.');
  } catch (error) {
    console.error('Error inserting records:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Disconnected from database.');
    }
  }

  if (pool) {
    await pool.end();
    console.log('Connection pool closed');
  }
}

insertRecords();

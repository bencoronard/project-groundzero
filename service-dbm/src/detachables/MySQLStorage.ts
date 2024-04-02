import { RecordRepository } from '../entities/RecordRepository';
import { Record } from '../entities/Record';
import mysql, { Pool, RowDataPacket } from 'mysql2';

export class MySQLStorage implements RecordRepository {
  private pool;
  constructor() {
    this.pool = mysql
      .createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'valorantDB',
      })
      .promise();
  }

  async readEntries(
    matchCriteria: Partial<Record>,
    matchLimit?: number | undefined,
    matchOffset?: number | undefined
  ): Promise<Record[]> {
    const [rows] = await this.pool.query(`
    SELECT *
    FROM agents
    WHERE 
    `);
  }

  // async createUser(user: User): Promise<User> {
  //   const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  //   const args = [user.name, user.email];
  //   await this.query(sql, args);
  //   return user;
  // }

  // async getUserById(id: string): Promise<User | null> {
  //   const sql = 'SELECT * FROM users WHERE id = ?';
  //   const args = [id];
  //   const rows = await this.query<RowDataPacket[]>(sql, args);
  //   if (rows.length > 0) {
  //     const userRow = rows[0];
  //     return { id: userRow.id, name: userRow.name, email: userRow.email };
  //   }
  //   return null;
  // }

  // async updateUser(user: User): Promise<User | null> {
  //   const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  //   const args = [user.name, user.email, user.id];
  //   const result = await this.query<RowDataPacket[]>(sql, args);
  //   if (result.affectedRows > 0) {
  //     return user;
  //   }
  //   return null;
  // }

  // async deleteUser(id: string): Promise<User | null> {
  //   const sql = 'DELETE FROM users WHERE id = ?';
  //   const args = [id];
  //   const result = await this.query<RowDataPacket[]>(sql, args);
  //   if (result.affectedRows > 0) {
  //     return { id, name: '', email: '' };
  //   }
  //   return null;
  // }
}

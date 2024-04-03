import { RecordRepository } from '../entities/RecordRepository';
import { Record } from '../entities/Record';
import mysql, { Pool } from 'mysql2/promise';

// export class MySQLStorage implements RecordRepository {
export class MySQLStorage {
  private pool: Pool;
  private dbName: string;
  private tableName: string;
  constructor(config: { [key: string]: string }, table: string) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    this.dbName = config.database;
    this.tableName = table;
  }

  async readEntries(
    matchCriteria: Partial<Record>,
    matchLimit: number,
    matchOffset: number
  ): Promise<Record[]> {
    let conditions: string = '';
    const matchValues: any[] = [];
    Object.keys(matchCriteria).forEach((key) => {
      conditions += key + ' = ' + '?' + ' AND ';
      matchValues.push(matchCriteria[key as keyof Record]);
    });
    conditions = conditions.slice(0, -5);
    const [rows] = await this.pool.query(`
      SELECT field1, field2, field3, field4
      FROM \`${this.dbName}\`.\`${this.tableName}\`
      WHERE ${conditions}
      LIMIT ${matchLimit}
      OFFSET ${matchOffset};
    `);
    return rows as Record[];
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

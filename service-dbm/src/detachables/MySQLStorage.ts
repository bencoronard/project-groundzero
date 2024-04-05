import { RecordRepository } from '../entities/RecordRepository';
import { IRecord } from '../entities/Record';
import * as mysql from 'mysql2/promise';

export class MySQLStorage implements RecordRepository {
  private pool: mysql.Pool;
  private database: string;
  private table: string;
  constructor(config: { [key: string]: string }, table: string) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    this.database = config.database;
    this.table = table;
  }

  async readEntries(
    matchCriteria: Partial<IRecord>,
    matchLimit: number,
    matchOffset: number
  ): Promise<IRecord[]> {
    let connection;
    try {
      const { conditions, values } = await parseConditions(matchCriteria);
      connection = await this.pool.getConnection();
      const [rows] = await connection.query(
        `
        SELECT field1, field2, field3, field4
        FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${conditions}
        LIMIT ${matchLimit}
        OFFSET ${matchOffset};
      `,
        values
      );
      return rows as IRecord[];
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<IRecord[]> {
    return [
      { field1: 777, field2: 'Ronoa', field3: 'Zoro', field4: 'OnePiece' },
    ];
  }

  async updateEntries(
    matchCriteria: Partial<IRecord>,
    updateValues: Partial<IRecord>
  ): Promise<IRecord[]> {
    return [
      { field1: 777, field2: 'Ronoa', field3: 'Zoro', field4: 'OnePiece' },
    ];
  }

  async deleteEntries(
    matchCriteria: Partial<IRecord>,
    matchOffset?: number | undefined
  ): Promise<IRecord[]> {
    return [
      { field1: 777, field2: 'Ronoa', field3: 'Zoro', field4: 'OnePiece' },
    ];
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

async function parseConditions(input: {
  [key: string]: any;
}): Promise<{ [key: string]: string | any[] }> {
  try {
    let parsedConditions: string = '';
    const parsedValues: any[] = [];
    Object.keys(input).forEach((key) => {
      parsedConditions += key + ' = ' + '?' + ' AND ';
      parsedValues.push(input[key as keyof IRecord]);
    });
    parsedConditions = parsedConditions.slice(0, -5);
    return { conditions: parsedConditions, values: parsedValues };
  } catch {
    throw new Error('Error parsing query conditions');
  }
}

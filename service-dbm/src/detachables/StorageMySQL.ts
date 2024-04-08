import { RecordRepository } from '../entities/RecordRepository';
import { Record, IRecord } from '../entities/Record';
import * as mysql from 'mysql2/promise';
import { promises } from 'dns';

export class StorageMySQL implements RecordRepository {
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
      const [matchConditions, conn] = await Promise.all([
        parseConditions(matchCriteria, ' AND '),
        this.pool.getConnection(),
      ]);
      const { conditions: matchString, values: matchValues } = matchConditions;
      connection = conn;
      const query: string = `
        SELECT ${Record.getAttributes().join(', ')}
        FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${matchString}
        LIMIT ${matchLimit}
        OFFSET ${matchOffset};
    `;
      const [result] = await connection.query(query, matchValues);
      return result as IRecord[];
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateEntries(
    matchCriteria: Partial<IRecord>,
    updateCriteria: Partial<IRecord>
  ): Promise<number> {
    let connection;
    try {
      const [matchConditions, updateConditions, conn] = await Promise.all([
        parseConditions(matchCriteria, ' AND '),
        parseConditions(updateCriteria, ', '),
        this.pool.getConnection(),
      ]);
      const { conditions: matchString, values: matchValues } = matchConditions;
      const { conditions: updateString, values: updateValues } =
        updateConditions;
      connection = conn;
      const query: string = `
        UPDATE \`${this.database}\`.\`${this.table}\`
        SET ${updateString}
        WHERE ${matchString};
    `;
      const [result] = await connection.query(
        query,
        updateValues.concat(matchValues)
      );
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<number> {
    let connection;
    try {
      const [records, conn] = await Promise.all([
        parseRecords(recordsToInsert),
        this.pool.getConnection(),
      ]);
      connection = conn;
      const query: string = `
        INSERT INTO \`${this.database}\`.\`${
        this.table
      }\` (${Record.getAttributes().join(', ')})
        VALUES ?;
      `;
      const [result] = await connection.query(query, [records]);
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async deleteEntries(matchCriteria: Partial<IRecord>): Promise<number> {
    let connection;
    try {
      const [matchConditions, conn] = await Promise.all([
        parseConditions(matchCriteria, ' AND '),
        this.pool.getConnection(),
      ]);
      const { conditions: matchString, values: matchValues } = matchConditions;
      connection = conn;
      const query: string = `
        DELETE FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${matchString};
    `;
      const [result] = await connection.query(query, matchValues);
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async closeConnection(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

async function parseConditions(
  input: {
    [key: string]: any;
  },
  separator: string
): Promise<{ conditions: string; values: any[] }> {
  let parsedConditions: string = '';
  const parsedValues: any[] = [];
  Object.keys(input).forEach((key) => {
    parsedConditions += key + ' = ' + '?' + separator;
    parsedValues.push(input[key]);
  });
  parsedConditions = parsedConditions.slice(0, -separator.length);
  return { conditions: parsedConditions, values: parsedValues };
}

async function parseRecords(input: IRecord[]): Promise<any[]> {
  return input.map((record) => {
    const array: any[] = [];
    Object.keys(record).forEach((key) => {
      array.push(record[key as keyof IRecord]);
    });
    return array;
  });
}

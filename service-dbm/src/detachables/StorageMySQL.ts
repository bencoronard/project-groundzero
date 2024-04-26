import * as mysql from 'mysql2/promise';
import { RecordRepository } from '../entities/RecordRepository';
import { Record, IRecord } from '../entities/Record';

export class StorageMySQL implements RecordRepository {
  private pool: mysql.Pool;
  private database: string;
  private table: string;

  constructor(config: {
    host: string;
    user: string;
    password: string;
    database: string;
    table: string;
  }) {
    try {
      // Create MySQL pool of connections
      this.pool = mysql.createPool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
      });
      // Select default schema
      this.database = config.database;
      // Select default table
      this.table = config.table;
    } catch (error) {
      // MySQL database connection failed
      throw error;
    }
  }

  async readEntries(
    matchCriteria: Partial<IRecord>,
    matchLimit: number,
    matchOffset: number
  ): Promise<IRecord[]> {
    let connection;
    try {
      // Concurrently parse inputs and get MySQL pool connection
      const [matchConditions, conn] = await Promise.all([
        parseConditions(matchCriteria, ' AND '),
        this.pool.getConnection(),
      ]);
      // Destructure match conditions
      const { conditions: matchString, values: matchValues } = matchConditions;
      // Assign alias to MySQL connection object
      connection = conn;
      // Construct SQL query
      const query: string = `
        SELECT ${Record.getAttributes().join(', ')}
        FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${matchString}
        LIMIT ${matchLimit}
        OFFSET ${matchOffset};
    `;
      // Send query to MySQL service
      const [result] = await connection.query(query, matchValues);
      // Return retrieved records
      return result as IRecord[];
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to retrieve records');
    } finally {
      // Check if current connection is active
      if (connection) {
        // Release current connection to MySQL connection pool
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
      // Concurrently parse inputs and get MySQL pool connection
      const [matchConditions, updateConditions, conn] = await Promise.all([
        parseConditions(matchCriteria, ' AND '),
        parseConditions(updateCriteria, ', '),
        this.pool.getConnection(),
      ]);
      // Destructure match conditions
      const { conditions: matchString, values: matchValues } = matchConditions;
      // Destructure update conditions
      const { conditions: updateString, values: updateValues } =
        updateConditions;
      // Assign alias to MySQL connection object
      connection = conn;
      // Construct SQL query
      const query: string = `
        UPDATE \`${this.database}\`.\`${this.table}\`
        SET ${updateString}
        WHERE ${matchString};
    `;
      // Send query to MySQL service
      const [result] = await connection.query(
        query,
        updateValues.concat(matchValues)
      );
      // Return number of records updated
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to update records');
    } finally {
      // Check if current connection is active
      if (connection) {
        // Release current connection to MySQL connection pool
        connection.release();
      }
    }
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<number> {
    let connection;
    try {
      // Concurrently parse inputs and get MySQL pool connection
      const [records, conn] = await Promise.all([
        parseRecords(recordsToInsert),
        this.pool.getConnection(),
      ]);
      // Assign alias to MySQL connection object
      connection = conn;
      // Construct SQL query
      const query: string = `
        INSERT INTO \`${this.database}\`.\`${
        this.table
      }\` (${Record.getAttributes().join(', ')})
        VALUES ?;
      `;
      // Send query to MySQL service
      const [result] = await connection.query(query, [records]);
      // Return number of records created
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to create new records');
    } finally {
      // Check if current connection is active
      if (connection) {
        // Release current connection to MySQL connection pool
        connection.release();
      }
    }
  }

  async deleteEntries(matchCriteria: Partial<IRecord>): Promise<number> {
    let connection;
    try {
      // Concurrently parse inputs and get MySQL pool connection
      const [matchConditions, conn] = await Promise.all([
        parseConditions(matchCriteria, ' AND '),
        this.pool.getConnection(),
      ]);
      // Destructure match conditions
      const { conditions: matchString, values: matchValues } = matchConditions;
      // Assign alias to MySQL connection object
      connection = conn;
      // Construct SQL query
      const query: string = `
        DELETE FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${matchString};
    `;
      // Send query to MySQL service
      const [result] = await connection.query(query, matchValues);
      // Return number of records deleted
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to delete records');
    } finally {
      // Check if current connection is active
      if (connection) {
        // Release current connection to MySQL connection pool
        connection.release();
      }
    }
  }

  async closeConnection(): Promise<void> {
    try {
      // Check if current pool of connections is active
      if (this.pool) {
        // End current MySQL connection pool
        await this.pool.end();
      }
    } catch (error) {
      // MySQL connection pool termination failed
      throw error;
    }
  }
}

async function parseConditions(
  input: {
    [key: string]: any;
  },
  separator: string
): Promise<{ conditions: string; values: any[] }> {
  // Initialize empty string for SQL query
  let parsedConditions: string = '';
  // Initialize empty array for input values
  const parsedValues: any[] = [];
  // Construct SQL WHERE conditions along with values
  Object.keys(input).forEach((key) => {
    parsedConditions += key + ' = ' + '?' + separator;
    parsedValues.push(input[key]);
  });
  // Trim ending separator
  parsedConditions = parsedConditions.slice(0, -separator.length);
  // Return SQL query string
  return { conditions: parsedConditions, values: parsedValues };
}

async function parseRecords(input: IRecord[]): Promise<any[]> {
  // Transform individual JSON record into array of field values
  return input.map((record) => {
    // Initialize empty field value array
    const array: any[] = [];
    // Populate array with field values
    Object.keys(record).forEach((key) => {
      array.push(record[key as keyof IRecord]);
    });
    // Return parsed array
    return array;
  });
}

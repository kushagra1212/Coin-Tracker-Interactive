import SQLite, { ResultSet } from 'react-native-sqlite-storage';
import { DataItem } from '../types';
const DATABASE_NAME = `coins.db`;
const TABLE_NAME = 'coins';
let db: Promise<SQLite.SQLiteDatabase>;
export class Database {
  private static instance: Database;

  private constructor() {
    SQLite.enablePromise(true);
  }

  public static getInstance(databaseName: string): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      db = SQLite.openDatabase({
        name: databaseName,
        createFromLocation: `${databaseName}`,
      });
    }
    return Database.instance;
  }

  private createTable(): Promise<any> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT, volume REAL, lastPrice REAL)`
        )
          .then(() => {
            console.log('Table created/updated successfully');
            resolve(null);
          })
          .catch((error) => {
            console.log('Error creating table:', error);
            if (error.code === 5) {
              console.log('Table already exists');
              resolve(null);
            } else {
              console.log('Error creating table:', error);
              reject(error);
            }
          });
      });
    });
  }
  private tableExists(tableName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        const query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
        tx.executeSql(
          query,
          [tableName],
          (tx, result) => {
            if (result?.rows?.length) {
              const rowCount = result.rows.length;
              const tableExists = rowCount > 0;
              console.log(`Table ${tableName} exists: ${tableExists}`);
              resolve(tableExists);
            } else {
              console.log('Error checking table existence:');
              resolve(false);
            }
          },
          (error) => {
            console.log('Error checking table existence:', error);
            resolve(false);
          }
        );
      });
    });
  }
  private createIndexes(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.then(async (tx) => {
        await tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_symbol ON ${TABLE_NAME} (symbol)`
        );
        await tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_volume ON ${TABLE_NAME} (volume)`
        );
        await tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_lastPrice ON ${TABLE_NAME} (lastPrice)`
        );
        console.log('Indexes created successfully');
        resolve();
      }).catch((err) => {
        console.log('indexes not created', err);
        reject(err);
      });
    });
  }

  private isValidElement = (item: DataItem) => {
    return item.lastPrice && item.symbol && item.volume;
  };
  private fetchDataAndStore(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        tx.executeSql(`SELECT * FROM ${TABLE_NAME}`)
          .then((result: SQLite.ResultSet[]) => {
            if (result[0].rows.length === 0) {
              fetch('https://api.binance.com/api/v3/ticker/24hr')
                .then((response) => response.json())
                .then((data: DataItem[]) => {
                  const filteredData = data.filter((item) =>
                    item.symbol.endsWith('USDT')
                  );
                  const updateData = [];
                  const size = filteredData.length;
                  for (let i = 0; i < size; i++) {
                    if (this.isValidElement(filteredData[i]))
                      updateData.push(filteredData[i]);
                  }
                  this.insertData(updateData)
                    .then(() => {
                      resolve();
                    })
                    .catch((error) => {
                      console.log('Error inserting data:', error);
                      reject(error);
                    });
                })
                .catch((error) => {
                  console.log('Error fetching data:', error);
                  reject(error);
                });
            } else {
              // tx.executeSql(`DROP table ${TABLE_NAME}`)
              //   .then((res) => console.log('Droped', res))
              //   .catch((err) => console.log(err));
              console.log('Data already inserted');
              resolve();
            }
          })
          .catch((error) => {
            console.log('Error fetching data:', error);
            reject(error);
          });
      });
    });
  }

  private insertData(dataArray: DataItem[]): Promise<void> {
    console.log('Inserting data...');

    return new Promise((resolve, reject) => {
      db.then((tx) => {
        const placeholders = dataArray
          .map(() => '(?, CAST(? AS REAL), CAST(? AS REAL))')
          .join(',');
        const values = dataArray.flatMap((data) => [
          data.symbol,
          data.volume,
          data.lastPrice,
        ]);
        const query = `INSERT INTO ${TABLE_NAME} (symbol, volume, lastPrice) VALUES ${placeholders}`;

        tx.executeSql(
          query,
          values,
          () => {
            console.log('Data inserted successfully');
            resolve();
          },
          (error) => {
            console.log('Error inserting data:', error);
            reject(error);
          }
        );
      });
    });
  }

  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tableExists(TABLE_NAME)
        .then((isExists) => {
          if (isExists) resolve();

          return this.createTable()
            .then(() => this.createIndexes())
            .then(() => this.fetchDataAndStore())
            .then(() => {
              resolve();
            });
        })
        .catch((error) => {
          console.log('Error:', error);
          reject(error);
        });
    });
  }

  getData(
    sortBy: 'lastPrice' | 'volume',
    sortOrder: 'asc' | 'desc',
    offset: number,
    limit: number
  ): Promise<DataItem[]> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        const query = `SELECT * FROM ${TABLE_NAME} ORDER BY ${sortBy} ${sortOrder} LIMIT ${offset}, ${limit}`;
        tx.executeSql(query)
          .then((result) => {
            const data: DataItem[] = [];
            for (let i = 0; i < result[0].rows.length; i++) {
              const item = result[0].rows.item(i);
              data.push({
                symbol: item.symbol,
                volume: item.volume,
                lastPrice: item.lastPrice,
              });
            }
            console.log('Data retrieved successfully');
            resolve(data);
          })
          .catch((error) => {
            console.log('Error retrieving data:', error);
            reject(error);
          });
      });
    });
  }
}
export const database = Database.getInstance(DATABASE_NAME);

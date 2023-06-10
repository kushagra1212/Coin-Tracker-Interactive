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
            console.log(`${TABLE_NAME} Table created/updated successfully`);
            return resolve(null);
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
        const query = `SELECT * FROM ${tableName}`;
        console.log('Checking table existence...');
        tx.executeSql(query)
          .then((results) => {
            if (results[0].rows.length) {
              const rowCount = results[0].rows.length;
              const tableExists = rowCount > 0;
              console.log(`Table ${tableName} exists: ${tableExists}`);
              resolve(tableExists);
            } else {
              console.log('Error checking table existence:');
              resolve(false);
            }
          })
          .catch((error) => {
            console.log('Error checking table existence:', error);
            resolve(false);
          });
      });
    });
  }
  private createIndexes(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        return Promise.all([
          tx.executeSql(
            `CREATE INDEX IF NOT EXISTS idx_symbol ON ${TABLE_NAME} (symbol)`
          ),
          tx.executeSql(
            `CREATE INDEX IF NOT EXISTS idx_volume ON ${TABLE_NAME} (volume)`
          ),
          tx.executeSql(
            `CREATE INDEX IF NOT EXISTS idx_lastPrice ON ${TABLE_NAME} (lastPrice)`
          ),
        ]);
      })
        .then((res) => {
          console.log('indexes created');
          resolve();
        })
        .catch((err) => {
          console.log('indexes not created');
          reject(err);
        });
    });
  }

  private isValidElement = (item: DataItem) => {
    return item.lastPrice && item.symbol && item.volume;
  };
  private fetchDataAndStore(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('fetching data using binance api...');
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
          console.log('data fetched successfully');
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
    });
  }
  public dropAllTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        tx.executeSql(`DROP table coins`)
          .then(() => tx.executeSql(`DROP table time_table`))
          .then((res) => resolve())
          .catch((err) => reject(err));
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
  private updateDateTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.then((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS time_table (id INTEGER PRIMARY KEY AUTOINCREMENT, store_time REAL)'
        )
          .then((res) => {
            console.log('time_table created/updated successfully');
            tx.executeSql('SELECT * FROM time_table WHERE id = 1')
              .then((results: any) => {
                if (results[0].rows.length > 0) {
                  const storedTime = results[0].rows.item(0).store_time;
                  const currentTime = Date.now();
                  const timeDifference = currentTime - storedTime;
                  if (timeDifference >= 86400000) {
                    // 24 hours in milliseconds
                    console.log('timeDifference', timeDifference);
                    tx.executeSql(
                      'UPDATE time_table SET store_time = ? WHERE id = ?',
                      [currentTime, 1],
                      () => {
                        console.log('store_time updated');
                        tx.executeSql(`DROP table ${TABLE_NAME}`)
                          .then((res) => {
                            console.log('Droped', res);
                            return this.createTable()
                              .then(() => this.createIndexes())
                              .then(() => this.fetchDataAndStore());
                          })
                          .catch((err) => console.log(err))
                          .finally(() => resolve());

                        console.log('Reinitiliazing... the database');
                      },
                      (error: any) => {
                        console.error('Error updating store_time:', error);
                        resolve();
                      }
                    );
                  } else {
                    console.log(
                      'No need to update the time_table :  less than 24 hours'
                    );
                    resolve();
                  }
                } else {
                  const currentTime = Date.now();
                  tx.executeSql(
                    'INSERT INTO time_table (id, store_time) VALUES (?, ?)',
                    [1, currentTime],
                    () => {
                      console.log('store_time inserted');
                      resolve();
                    },
                    (error: any) => {
                      console.error('Error inserting store_time:', error);
                      resolve();
                    }
                  );
                }
              })
              .catch((error) => {
                console.error('Error retrieving store_time:', error);
                resolve();
              });
          })
          .catch((error) => {
            console.error('Error creating time_table:', error);
          });
      });
    });
  }
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tableExists(TABLE_NAME)
        .then((isExists) => {
          if (isExists) {
            return this.updateDateTable();
          } else {
            return this.createTable()
              .then(() => this.createIndexes())
              .then(() => this.fetchDataAndStore())
              .then(() => this.updateDateTable());
          }
        })
        .then(() => {
          console.log('Done : Reinitiliazing... the database');
          return resolve();
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

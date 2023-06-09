import {
  openDatabase,
  enablePromise,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import { DataItem } from '../types';
const DATABASE_NAME = `coins.db`;
const TABLE_NAME = 'coin';
export class Database {
  private static instance: Database;
  private db: Promise<SQLiteDatabase>;
  private constructor() {
    enablePromise(true);
    this.db = openDatabase({
      name: DATABASE_NAME,
      location: 'default',
      createFromLocation: 1,
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private createIndexes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db
        .then((tx) => {
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
    return (
      item.lastPrice &&
      item.symbol &&
      item.volume &&
      item.symbol.endsWith('USDT')
    );
  };
  private fetchDataAndStore(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('fetching data using binance api...');
      fetch('https://api.binance.com/api/v3/ticker/24hr')
        .then((response) => response.json())
        .then((data: DataItem[]) => {
          const updateData = [];
          const size = data.length;
          for (let i = 0; i < size; i++) {
            if (this.isValidElement(data[i])) updateData.push(data[i]);
          }
          console.log('data fetched successfully');
          this.insertData(0, updateData)
            .then(resolve)
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
  public storeDataInMappingTable = (dataArray: any[]) => {
    this.db.then((tx) => {
      dataArray.forEach((item) => {
        tx.executeSql(
          'INSERT INTO crypto_mapping (symbol, name) VALUES (?, ?);',
          [item.symbol, item.name],
          () => {
            console.log(`Data stored for ${item.symbol}`);
          },
          (error) => {
            console.error(`Failed to store data for ${item.symbol}:`, error);
          }
        );
      });
    });
  };

  private insertData(fr: number, dataArray: DataItem[]): Promise<void> {
    console.log('Inserting data...');

    return new Promise((resolve, reject) => {
      const DB = this.db;
      function handleInsertData(from: number, dataArray: DataItem[]) {
        if (from >= dataArray.length) {
          resolve();
          return;
        }
        let to = Math.min(from + 300, dataArray.length - 1);
        DB.then((tx) => {
          let placeholders = '';
          for (let i = from; i <= to; i++) {
            placeholders += '(?, CAST(? AS REAL), CAST(? AS REAL))';
            if (i != to) placeholders += ',';
          }
          let values = [];
          for (let i = from; i <= to; i++) {
            values.push(dataArray[i].symbol);
            values.push(dataArray[i].volume);
            values.push(dataArray[i].lastPrice);
          }
          const query = `INSERT INTO ${TABLE_NAME} (symbol, volume, lastPrice) VALUES ${placeholders}`;
          console.log(from, to);
          tx.executeSql(
            query,
            values,
            () => {
              console.log('Data inserted successfully');
              handleInsertData(to + 1, dataArray);
            },
            (error) => {
              console.log('Error inserting data:', error);
              reject(error);
            }
          );
        }).catch((err) => {
          console.log('Error inserting data:', err);
          reject(err);
        });
      }

      handleInsertData(fr, dataArray);
    });
  }

  public truncateTable = (tableName: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.db
        .then((tx) => {
          tx.executeSql(
            `DELETE FROM ${tableName};`,
            [],
            () => {
              console.log(`Table ${tableName} truncated successfully.`);
              resolve(true);
            },
            (error) => {
              console.error(`Failed to truncate table ${tableName}:`, error);
              reject(false);
            }
          );
        })
        .catch((err) => {
          console.log('Error truncating table:', err);
          reject(false);
        });
    });
  };
  public getCryptoName = (symbol: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.db
        .then((tx) => {
          tx.executeSql(
            `SELECT name FROM crypto_mapping WHERE symbol = '${symbol}'`
          )
            .then((results: any) => {
              if (results[0].rows.length > 0) {
                const name = results[0].rows.item(0).name;
                resolve(name);
              } else {
                resolve('');
              }
            })
            .catch((err) => {
              console.log('Error getting name:', err);
              reject('');
            });
        })
        .catch((err) => {
          console.log('Error getting name:', err);
          reject('');
        });
    });
  };
  private updateDateTable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db
        .then((tx) => {
          tx.executeSql('SELECT * FROM time_table WHERE id = 1')
            .then((results: any) => {
              if (results[0].rows.length > 0) {
                const storedTime = results[0].rows.item(0).storeTime;
                const currentTime = Date.now();
                const timeDifference = currentTime - storedTime;
                const TIME_GAP = 86400000;

                if (timeDifference >= TIME_GAP) {
                  // 24 hours  in milliseconds 86400000
                  console.log('timeDifference', timeDifference);
                  tx.executeSql(
                    'UPDATE time_table SET storeTime = ? WHERE id = ?',
                    [currentTime, 1],
                    () => {
                      console.log('storedTime updated');

                      resolve(true);
                    },
                    (error: any) => {
                      console.error('Error updating storedTime:', error);
                      resolve(true);
                    }
                  );
                } else {
                  console.log(
                    `No need to update the time_table :  less than 24 hours | ${
                      (TIME_GAP - timeDifference) / 1000
                    }s left`
                  );
                  resolve(false);
                }
              } else {
                console.log('No need to update the time_table :  no data');
                resolve(false);
              }
            })
            .catch((error) => {
              console.error('Error retrieving storedTime:', error);
              resolve(false);
            });
        })
        .catch((err) => {
          console.log('Error updating store_time:', err);
          resolve(false);
        });
    });
  }
  public initialize(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('initializing database...');
        const requireUpdate = await this.updateDateTable();
        if (requireUpdate) {
          return this.truncateTable(TABLE_NAME)
            .then(() => this.fetchDataAndStore())
            .then(() => this.createIndexes())
            .then(resolve)
            .catch(reject);
        }
        resolve();
      } catch (err) {
        console.log('Error initializing database:', err);
        reject(err);
      }
    });
  }

  getData(
    sortBy: 'lastPrice' | 'volume',
    sortOrder: 'asc' | 'desc',
    offset: number,
    limit: number
  ): Promise<DataItem[]> {
    return new Promise((resolve, reject) => {
      this.db.then((tx) => {
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

export const database = Database.getInstance();
